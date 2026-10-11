import type { Persona } from './Personas'

const ordenAlfabetico = new Intl.Collator('es', { sensitivity: 'base', numeric: true })

export function compararPersonas(primera: Persona, segunda: Persona) {
  return ordenAlfabetico.compare(nombreDePersona(primera), nombreDePersona(segunda))
}

export function nombreDePersona(persona: Persona) {
  return [persona.nombres, persona.apellidos].filter(Boolean).join(' ')
}

export function inicialesDePersona(persona: Persona) {
  return [persona.nombres[0], persona.apellidos[0]].filter(Boolean).join('')
}

export function esCorreoValido(correo: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
}

export function enlaceDeLinkedIn(linkedin: string | undefined): string | undefined {
  if (!linkedin?.trim()) return undefined
  try {
    const enlace = new URL(linkedin.trim())
    const dominio = enlace.hostname
    if (enlace.protocol !== 'https:' || enlace.username || enlace.password
      || !(dominio === 'linkedin.com' || dominio.endsWith('.linkedin.com'))
      || !/^\/in\/[^/]+\/?$/.test(enlace.pathname)) return undefined
    return enlace.href
  } catch {
    return undefined
  }
}

export function textoParaBuscar(texto: string) {
  return texto.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('es').trim()
}
