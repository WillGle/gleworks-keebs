import { spawn, spawnSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { createWriteStream, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { constants } from 'node:os'

const [label, command, ...args] = process.argv.slice(2)
if (!label || !command || !/^[a-z0-9-]+$/.test(label)) {
  console.error('Usage: node scripts/run-logged.mjs <label> <command> [arguments...]')
  process.exit(1)
}

const started = new Date()
const stamp = started.toISOString().replace(/[:.]/g, '-')
const name = `${stamp}-${label}-${randomUUID().slice(0, 8)}`
const logsRoot = path.resolve('logs')
const inherited = process.env.GLEWORKS_RUN_DIR
const nested = inherited && path.dirname(inherited) === logsRoot
const runDir = nested ? inherited : path.join(logsRoot, name)
mkdirSync(runDir, { recursive: true })

const logPath = path.join(runDir, `${name}.log`)
const resultPath = path.join(runDir, nested ? `${name}.json` : 'result.json')
const git = (args) => spawnSync('git', args, { encoding: 'utf8' }).stdout?.trim() || null
const result = {
  label,
  command: [command, ...args],
  startedAt: started.toISOString(),
  status: 'running',
  node: process.version,
  platform: process.platform,
  revision: git(['rev-parse', 'HEAD']),
  dirty: Boolean(git(['status', '--porcelain'])),
  log: path.basename(logPath),
}
writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`)
console.log(`Run logs: ${runDir}`)

const output = createWriteStream(logPath)
const child = spawn(command, args, {
  stdio: ['inherit', 'pipe', 'pipe'],
  env: { ...process.env, GLEWORKS_RUN_DIR: runDir },
  detached: process.platform !== 'win32',
})
child.stdout.pipe(output, { end: false })
child.stderr.pipe(output, { end: false })
child.stdout.pipe(process.stdout)
child.stderr.pipe(process.stderr)

// Signal the command's group so shell/npm grandchildren also stop.
let requestedSignal = null
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    requestedSignal = signal
    if (!child.pid || child.exitCode !== null || child.signalCode !== null) return
    try {
      process.kill(process.platform === 'win32' ? child.pid : -child.pid, signal)
    } catch (error) {
      if (error.code !== 'ESRCH') throw error
    }
  })
}
child.on('error', (error) => {
  console.error(error.message)
  output.write(`${error.message}\n`)
})

child.on('close', (code, signal) => {
  output.end(() => {
    const exitCode = code ?? (signal ? 128 + constants.signals[signal] : 1)
    const terminationSignal = signal || requestedSignal
    Object.assign(result, {
      finishedAt: new Date().toISOString(),
      durationMs: Date.now() - started.getTime(),
      status: terminationSignal ? 'interrupted' : exitCode === 0 ? 'passed' : 'failed',
      exitCode,
      signal: terminationSignal,
    })
    writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`)
    console.log(`Result: ${result.status} (${exitCode}) — ${resultPath}`)

    // Only completed wrapper-created runs count toward the retention limit.
    if (!nested) {
      const completed = readdirSync(logsRoot).filter((directory) => {
        if (!/^\d{4}-\d{2}-\d{2}T.*-[a-z0-9-]+-[a-f0-9]{8}$/.test(directory)) return false
        try {
          return ['passed', 'failed', 'interrupted'].includes(JSON.parse(readFileSync(path.join(logsRoot, directory, 'result.json'), 'utf8')).status)
        } catch { return false }
      }).sort()
      for (const directory of completed.slice(0, -20)) rmSync(path.join(logsRoot, directory), { recursive: true })
    }
    process.exitCode = exitCode
  })
})
