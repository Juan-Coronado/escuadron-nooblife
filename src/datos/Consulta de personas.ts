import type { Persona } from './Personas'

// Contrato público de la API. Las columnas y el acceso a la hoja pertenecen al backend.
const camposPublicos = [
  'nombres', 'apellidos', 'apodos', 'correo', 'institucion', 'carreras',
  'habilidades', 'hobbies', 'metas', 'foto', 'linkedin',
] as const

export function identificarPersonas(personas: readonly Persona[]): Persona[] {
  const repeticiones = new Map<string, number>()
  return personas.map(persona => {
    const identidad = JSON.stringify([persona.nombres.trim(), persona.apellidos.trim(), persona.correo.trim()])
    const repeticion = repeticiones.get(identidad) ?? 0
    repeticiones.set(identidad, repeticion + 1)
    return { ...persona, id: `hoja:${identidad}:${repeticion}` }
  })
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
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(servicio)) {
    throw new Error('El servicio de presentaciones no está configurado.')
  }
  // Un fallo o una configuración vacía nunca habilitan el acceso directo a Google Sheets.
  const respuesta = await fetch(servicio, { signal, cache: 'no-store', credentials: 'omit' })
  if (!respuesta.ok) throw new Error('El servicio de presentaciones no está disponible.')
  return leerPersonasDelServicio(await respuesta.json())
}

export function leerPersonasDelServicio(respuesta: unknown): Persona[] {
  if (!respuesta || typeof respuesta !== 'object' || !('version' in respuesta) || respuesta.version !== 1
    || !('estado' in respuesta) || respuesta.estado !== 'ok' || !('personas' in respuesta) || !Array.isArray(respuesta.personas)) {
    throw new Error('El servicio de presentaciones no devolvió datos válidos.')
  }
  const personas = respuesta.personas.map((fila: unknown) => {
    if (!fila || typeof fila !== 'object') throw new Error('El servicio devolvió una persona inválida.')
    const registro = fila as Record<string, unknown>
    const datos = Object.fromEntries(camposPublicos.map(campo => {
      const valor = registro[campo]
      if (typeof valor !== 'string') throw new Error('El servicio devolvió un campo inválido.')
      return [campo, valor]
    })) as Omit<Persona, 'id'>
    return { ...datos, id: '' }
  }).filter(persona => persona.nombres.trim() || persona.apellidos.trim())
  return identificarPersonas(personas)
}
