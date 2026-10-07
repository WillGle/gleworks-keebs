import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { createServer } from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'
import { test } from 'node:test'

const host = '127.0.0.1'
const vite = new URL('../node_modules/vite/bin/vite.js', import.meta.url)

async function reservePort() {
  const socket = createServer()
  socket.listen(0, host)
  await once(socket, 'listening')
  return socket
}

async function closeSocket(socket) {
  await new Promise((resolve, reject) => socket.close((error) => error ? reject(error) : resolve()))
}

function launch(mode, port) {
  const child = spawn(process.execPath, [vite.pathname, ...(mode === 'preview' ? ['preview'] : []), '--port', String(port)], {
    cwd: new URL('..', import.meta.url),
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let output = ''
  for (const stream of [child.stdout, child.stderr]) stream.on('data', (data) => { output += data })
  const exited = once(child, 'exit')
  return { child, exited, output: () => output }
}

async function stop(server) {
  if (server.child.exitCode === null && server.child.signalCode === null) server.child.kill('SIGTERM')
  await server.exited
}

for (const mode of ['dev', 'preview']) {
  test(`${mode} exits when its port is occupied instead of opening another port`, { timeout: 15000 }, async () => {
    const socket = await reservePort()
    const port = socket.address().port
    const server = launch(mode, port)
    try {
      const result = await Promise.race([server.exited, delay(4000, null, { ref: false })])
      assert.ok(result, `Server kept running on a different port:\n${server.output()}`)
      assert.equal(result[0], 1)
      assert.match(server.output(), /already in use/)
    } finally {
      await stop(server)
      await closeSocket(socket)
    }
  })

  test(`${mode} serves only on loopback and releases its port after stopping`, { timeout: 15000 }, async () => {
    const socket = await reservePort()
    const port = socket.address().port
    await closeSocket(socket)
    const server = launch(mode, port)
    try {
      let ready = false
      for (let attempt = 0; attempt < 60; attempt++) {
        if (server.output().includes('Local:')) { ready = true; break }
        if (server.child.exitCode !== null) break
        await delay(100)
      }
      assert.ok(ready, server.output())
      assert.doesNotMatch(server.output(), /Network:.*http/)
      const response = await fetch(`http://${host}:${port}/`)
      assert.equal(response.status, 200)
      assert.match(await response.text(), /<div id="root">/)
    } finally {
      await stop(server)
    }
    const released = createServer()
    released.listen(port, host)
    await once(released, 'listening')
    await closeSocket(released)
  })
}
