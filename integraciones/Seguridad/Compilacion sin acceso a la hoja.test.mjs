import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import test from 'node:test'

test('published JavaScript contains no spreadsheet identifier or direct Sheets query', () => {
  const carpeta = new URL('../../dist/assets/', import.meta.url)
  const archivos = readdirSync(carpeta).filter(nombre => nombre.endsWith('.js'))
  assert.ok(archivos.length > 0, 'Debe existir la compilación antes de esta comprobación')
  for (const archivo of archivos) {
    const contenido = readFileSync(new URL(archivo, carpeta), 'utf8')
    assert.ok(!contenido.includes('1wdpvPkIsyjZUyDQefSE-yTGMmAqqHGuz7A5dxy4M8rs'), 'La hoja no debe estar en la compilación')
    assert.ok(!contenido.includes('docs.google.com/spreadsheets'), 'El cliente no puede consultar Google Sheets')
    assert.ok(!contenido.includes('gviz/tq'), 'La consulta pública pertenece a la versión anterior')
  }
})
