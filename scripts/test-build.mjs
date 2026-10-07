import assert from 'node:assert/strict'
import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { test } from 'node:test'

const output = new URL('../dist/', import.meta.url)

test('built HTML references files present in the deployable artifact', async () => {
  const html = await readFile(new URL('index.html', output), 'utf8')
  assert.match(html, /<div id="root">/)
  assert.doesNotMatch(html, /\/src\//)
  const references = [...html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)]
  assert.ok(references.length > 0)
  for (const [, asset] of references) assert.ok((await stat(new URL(asset.slice(1), output))).isFile())
})

test('production artifact has no source maps or test reports', async () => {
  const files = await readdir(output, { recursive: true })
  assert.ok(files.some((file) => file.endsWith('.js')))
  assert.ok(files.some((file) => file.endsWith('.css')))
  assert.ok(files.filter((file) => file.endsWith('.webp')).length === 21)
  for (const file of files) {
    assert.ok(!file.endsWith('.map'), file)
    assert.ok(!/^(?:coverage|test-results|playwright-report)(?:\/|$)/.test(file), file)
    if (/\.(?:js|css)$/.test(file)) {
      const content = await readFile(new URL(file, output), 'utf8')
      assert.doesNotMatch(content, /sourceMappingURL=/)
      for (const [, reference] of content.matchAll(/(?:["'(])(\/assets\/[^"')\s]+\.webp)/g)) {
        assert.ok((await stat(path.join(output.pathname, reference.slice(1)))).isFile(), reference)
      }
    }
  }
})
