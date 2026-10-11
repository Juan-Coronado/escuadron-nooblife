import type { Persona } from '../src/datos/Personas'

export const rutaDeHoja = 'https://docs.google.com/spreadsheets/d/1wdpvPkIsyjZUyDQefSE-yTGMmAqqHGuz7A5dxy4M8rs/gviz/tq?**'

export function respuestaDeHoja(personas: readonly Persona[]) {
  const columnas = [
    ['B', 'Nombres', 'nombres'],
    ['C', 'Apellidos', 'apellidos'],
    ['D', 'Apodos', 'apodos'],
    ['H', 'Correo', 'correo'],
    ['I', 'Universidades / Institutos', 'institucion'],
    ['K', 'Carrera(s)', 'carreras'],
    ['L', 'Habilidades', 'habilidades'],
    ['N', 'Hobbies', 'hobbies'],
    ['O', 'Metas', 'metas'],
    ['P', 'Foto ', 'foto'],
    ['Q', 'Link de linkedin', 'linkedin'],
  ] as const
  return `/*O_o*/\ngoogle.visualization.Query.setResponse(${JSON.stringify({
    version: '0.6', status: 'ok',
    table: {
      cols: columnas.map(([id, label]) => ({ id, label, type: 'string' })),
      rows: personas.map(persona => ({ c: columnas.map(([, , campo]) => persona[campo] ? { v: persona[campo] } : null) })),
    },
  })});`
}
