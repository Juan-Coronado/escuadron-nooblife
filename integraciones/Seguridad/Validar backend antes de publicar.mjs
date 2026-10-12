import { readFileSync } from 'node:fs'
import process from 'node:process'
import console from 'node:console'

const campos = ['nombres', 'apellidos', 'apodos', 'correo', 'institucion', 'carreras', 'habilidades', 'hobbies', 'metas', 'foto', 'linkedin']

try {
  const configuracion = JSON.parse(readFileSync(new URL('../../public/Configuracion de datos.json', import.meta.url), 'utf8'))
  const servicio = configuracion?.servicioDeFotos?.trim()
  if (typeof servicio !== 'string' || !/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(servicio)) {
    throw new Error('Configuración pendiente')
  }
  const respuesta = await fetch(servicio, { signal: AbortSignal.timeout(15000), credentials: 'omit', cache: 'no-store' })
  if (!respuesta.ok) throw new Error('API no disponible')
  const datos = await respuesta.json()
  if (datos?.version !== 1 || datos?.estado !== 'ok' || !Array.isArray(datos.personas)) throw new Error('Contrato inválido')
  if (datos.personas.some(persona => !persona || typeof persona !== 'object'
    || Object.keys(persona).length !== campos.length
    || campos.some(campo => typeof persona[campo] !== 'string'))) {
    throw new Error('Campos no autorizados o incompletos')
  }
  console.log('Backend público verificado: contrato válido y únicamente los once campos de presentación.')
} catch {
  console.error('Publicación detenida: activar y verificar la API real y configurar su URL antes de desplegar esta rama.')
  process.exitCode = 1
}
