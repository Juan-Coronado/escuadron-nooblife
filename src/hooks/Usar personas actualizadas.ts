import { useEffect, useRef, useState } from 'react'
import { personas as personasGuardadas } from '../datos/Personas'
import { consultarPersonas, identificarPersonas } from '../datos/Consulta de personas'

const respaldo = identificarPersonas(personasGuardadas)
const datosLocales = new Map(respaldo.map(persona => [persona.id, persona]))

export function usePersonasActualizadas() {
  const [personas, cambiarPersonas] = useState(respaldo)
  const [sinConexion, cambiarConexion] = useState(false)
  const ultimaLectura = useRef(JSON.stringify(respaldo))

  useEffect(() => {
    let activa = true
    let consulta: AbortController | null = null

    async function actualizar() {
      if (!activa || consulta || document.visibilityState === 'hidden') return
      const controlador = new AbortController()
      consulta = controlador
      const limite = window.setTimeout(() => controlador.abort(), 15000)
      try {
        const nuevas = (await consultarPersonas(controlador.signal)).map(persona => ({
          ...datosLocales.get(persona.id), ...persona,
        }))
        if (!activa) return
        const lectura = JSON.stringify(nuevas)
        if (lectura !== ultimaLectura.current) {
          ultimaLectura.current = lectura
          cambiarPersonas(nuevas)
        }
        cambiarConexion(false)
      } catch {
        if (activa) cambiarConexion(true)
      } finally {
        window.clearTimeout(limite)
        if (consulta === controlador) consulta = null
      }
    }

    void actualizar()
    const intervalo = window.setInterval(() => { void actualizar() }, 60000)
    const reanudar = () => { void actualizar() }
    document.addEventListener('visibilitychange', reanudar)
    window.addEventListener('online', reanudar)
    return () => {
      activa = false
      window.clearInterval(intervalo)
      consulta?.abort()
      document.removeEventListener('visibilitychange', reanudar)
      window.removeEventListener('online', reanudar)
    }
  }, [])

  return {
    personas,
    aviso: sinConexion ? 'No pudimos actualizar los datos. Mostramos la última información disponible.' : undefined,
  }
}
