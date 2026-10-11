import type { Persona } from './Personas'
import { textoParaBuscar } from './Presentacion de persona'

const camposDeLaHoja = [
  { columna: 'B', titulo: 'Nombres', campo: 'nombres' },
  { columna: 'C', titulo: 'Apellidos', campo: 'apellidos' },
  { columna: 'D', titulo: 'Apodos', campo: 'apodos' },
  { columna: 'H', titulo: 'Correo', campo: 'correo' },
  { columna: 'I', titulo: 'Universidades / Institutos', campo: 'institucion' },
  { columna: 'K', titulo: 'Carrera(s)', campo: 'carreras' },
  { columna: 'L', titulo: 'Habilidades', campo: 'habilidades' },
  { columna: 'N', titulo: 'Hobbies', campo: 'hobbies' },
  { columna: 'O', titulo: 'Metas', campo: 'metas' },
  { columna: 'P', titulo: 'Foto', campo: 'foto' },
  { columna: 'Q', titulo: 'Link de linkedin', campo: 'linkedin' },
] as const

const parametros = new URLSearchParams({
  gid: '709021814',
  headers: '1',
  tqx: 'out:json',
  tq: `select ${camposDeLaHoja.map(campo => campo.columna).join(', ')}`,
})

export const urlDeLaHoja = `https://docs.google.com/spreadsheets/d/1wdpvPkIsyjZUyDQefSE-yTGMmAqqHGuz7A5dxy4M8rs/gviz/tq?${parametros}`

interface RespuestaDeHoja {
  status?: string
  table?: {
    cols: { id: string; label: string }[]
    rows: { c: ({ v?: unknown; f?: unknown } | null)[] }[]
  }
}

export function identificarPersonas(personas: readonly Persona[]): Persona[] {
  const repeticiones = new Map<string, number>()
  return personas.map(persona => {
    const identidad = JSON.stringify([persona.nombres.trim(), persona.apellidos.trim(), persona.correo.trim()])
    const repeticion = repeticiones.get(identidad) ?? 0
    repeticiones.set(identidad, repeticion + 1)
    return { ...persona, id: `hoja:${identidad}:${repeticion}` }
  })
}

export function leerPersonasDeLaHoja(texto: string): Persona[] {
  const contenido = texto.match(/^\s*\/\*O_o\*\/\s*google\.visualization\.Query\.setResponse\(([\s\S]*)\);\s*$/)?.[1]
  if (!contenido) throw new Error('La hoja no devolvió una respuesta válida.')
  const respuesta = JSON.parse(contenido) as RespuestaDeHoja
  const tabla = respuesta.table
  if (respuesta.status !== 'ok' || !tabla || !Array.isArray(tabla.cols) || !Array.isArray(tabla.rows)) {
    throw new Error('No se pudieron consultar las presentaciones.')
  }
  if (tabla.cols.length !== camposDeLaHoja.length || camposDeLaHoja.some((campo, indice) => {
    const columna = tabla.cols[indice]
    return !columna || columna.id !== campo.columna || typeof columna.label !== 'string'
      || textoParaBuscar(columna.label) !== textoParaBuscar(campo.titulo)
  })) {
    throw new Error('Las columnas de la hoja cambiaron.')
  }

  const personas = tabla.rows.map(fila => {
    if (!fila || !Array.isArray(fila.c)) throw new Error('La hoja contiene una fila inválida.')
    const datos = Object.fromEntries(camposDeLaHoja.map((campo, indice) => {
      const celda = fila.c[indice]
      const valor = campo.campo === 'foto' || campo.campo === 'linkedin' ? celda?.v ?? '' : celda?.f ?? celda?.v ?? ''
      if (!['string', 'number', 'boolean'].includes(typeof valor)) {
        throw new Error('La hoja contiene un valor inválido.')
      }
      return [campo.campo, String(valor)]
    })) as Omit<Persona, 'id'>
    return { ...datos, id: '' }
  }).filter(persona => persona.nombres.trim() || persona.apellidos.trim())
  return identificarPersonas(personas)
}

export async function consultarPersonas(signal: AbortSignal): Promise<Persona[]> {
  const configuracion = await fetch(`${import.meta.env.BASE_URL}Configuracion de datos.json`, {
    signal, cache: 'no-store', credentials: 'omit',
  })
  if (!configuracion.ok) throw new Error('No se pudo consultar la configuración de datos.')
  const datos: unknown = await configuracion.json()
  if (!datos || typeof datos !== 'object' || !('servicioDeFotos' in datos) || typeof datos.servicioDeFotos !== 'string') {
    throw new Error('La configuración de datos no es válida.')
  }
  const servicio = datos.servicioDeFotos.trim()
  if (servicio && !/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(servicio)) {
    throw new Error('La dirección del servicio de fotos no es válida.')
  }
  const respuesta = await fetch(servicio || urlDeLaHoja, { signal, cache: 'no-store', credentials: 'omit' })
  if (!respuesta.ok) throw new Error('La hoja no está disponible.')
  if (!servicio) return leerPersonasDeLaHoja(await respuesta.text())
  return leerPersonasDelServicio(await respuesta.json())
}

export function leerPersonasDelServicio(respuesta: unknown): Persona[] {
  if (!respuesta || typeof respuesta !== 'object' || !('version' in respuesta) || respuesta.version !== 1
    || !('estado' in respuesta) || respuesta.estado !== 'ok' || !('personas' in respuesta) || !Array.isArray(respuesta.personas)) {
    throw new Error('El servicio de fotos no devolvió datos válidos.')
  }
  const personas = respuesta.personas.map((fila: unknown) => {
    if (!fila || typeof fila !== 'object') throw new Error('El servicio devolvió una persona inválida.')
    const registro = fila as Record<string, unknown>
    const datos = Object.fromEntries(camposDeLaHoja.map(({ campo }) => {
      const valor = registro[campo]
      if (typeof valor !== 'string') {
        throw new Error('El servicio devolvió un campo inválido.')
      }
      return [campo, valor]
    })) as Omit<Persona, 'id'>
    return { ...datos, id: '' }
  }).filter(persona => persona.nombres.trim() || persona.apellidos.trim())
  return identificarPersonas(personas)
}
