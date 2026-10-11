import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

const codigo = readFileSync(new URL('./Fotos y presentaciones.gs', import.meta.url), 'utf8')

function prepararServicio() {
  let lecturaDeFoto = 0
  const columnasPermitidas = [2, 3, 4, 8, 9, 11, 12, 14, 15, 16, 17]
  const filas = [
    ['datoNoAutorizado', 'Nombres', 'Apellidos', 'Apodos', '', '', '', 'Correo', 'Universidades / Institutos', '', 'Carrera(s)', 'Habilidades', '', 'Hobbies', 'Metas', 'Foto ', 'Link de linkedin'],
    ['datoNoAutorizado', 'Joseph', 'Ccana', 'Zorro', '', '', '', 'joseph@example.test', 'Instituto', '', 'Carrera', 'Habilidad', '', 'Hobby original', 'Meta original', {
      valueType: 'IMAGE', getContentUrl: () => `https://lh3.googleusercontent.com/fotoCcana${++lecturaDeFoto}`,
    }, 'https://www.linkedin.com/in/prueba-ccana/'],
    ['datoNoAutorizado', 'Joseph', 'Quispe', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ]
  const hoja = {
    getSheetId: () => 709021814,
    getLastRow: () => filas.length,
    getRange: (inicio, columna, cantidad, ancho) => {
      assert.equal(inicio, 1)
      assert.equal(ancho, 1)
      assert.equal(cantidad, filas.length)
      assert.ok(columnasPermitidas.includes(columna), 'Solo puede leer columnas autorizadas')
      return {
        getDisplayValues: () => filas.map(fila => [typeof fila[columna - 1] === 'object' ? '' : fila[columna - 1]]),
        getValues: () => filas.map(fila => [fila[columna - 1]]),
      }
    },
  }
  const contexto = vm.createContext({
    SpreadsheetApp: {
      ValueType: { IMAGE: 'IMAGE' },
      openById: id => {
        assert.equal(id, '1wdpvPkIsyjZUyDQefSE-yTGMmAqqHGuz7A5dxy4M8rs')
        return { getSheets: () => [hoja] }
      },
    },
    ContentService: {
      MimeType: { JSON: 'application/json' },
      createTextOutput: texto => ({ setMimeType: tipo => {
        assert.equal(tipo, 'application/json')
        return texto
      } }),
    },
    console: { error: () => {} },
  })
  vm.runInContext(codigo, contexto)
  return { filas, consultar: () => JSON.parse(contexto.doGet()) }
}

test('serves only approved fields and renews inserted cell photos without mixing people', () => {
  const { filas, consultar } = prepararServicio()
  const primera = consultar()
  assert.equal(primera.estado, 'ok')
  assert.equal(primera.version, 1)
  assert.equal(primera.personas.length, 2)
  assert.equal(primera.personas[0].foto, 'https://lh3.googleusercontent.com/fotoCcana1')
  assert.equal(primera.personas[1].foto, '')
  assert.equal(primera.personas[0].hobbies, 'Hobby original')
  assert.equal(primera.personas[0].metas, 'Meta original')
  assert.equal(primera.personas[0].linkedin, 'https://www.linkedin.com/in/prueba-ccana/')
  assert.equal(primera.personas[1].linkedin, '')
  assert.deepEqual(Object.keys(primera.personas[0]).sort(), ['nombres', 'apellidos', 'apodos', 'correo', 'institucion', 'carreras', 'habilidades', 'hobbies', 'metas', 'foto', 'linkedin'].sort())
  assert.ok(!JSON.stringify(primera).includes('datoNoAutorizado'))
  assert.equal(consultar().personas[0].foto, 'https://lh3.googleusercontent.com/fotoCcana2')
  filas[1][15] = ''
  assert.equal(consultar().personas[0].foto, '')
  filas[2][15] = { valueType: 'IMAGE', getContentUrl: () => 'https://lh3.googleusercontent.com/fotoQuispe' }
  assert.equal(consultar().personas[1].foto, 'https://lh3.googleusercontent.com/fotoQuispe')
})

test('rejects renamed columns without exposing errors and accepts an empty sheet', () => {
  const { filas, consultar } = prepararServicio()
  filas[0][15] = 'Otro encabezado'
  assert.deepEqual(consultar(), { version: 1, estado: 'error' })
  filas[0][15] = 'Foto'
  filas.splice(1)
  assert.deepEqual(consultar(), { version: 1, estado: 'ok', personas: [] })
})
