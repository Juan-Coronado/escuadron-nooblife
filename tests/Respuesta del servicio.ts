import type { Page } from '@playwright/test'
import type { Persona } from '../src/datos/Personas'

export const rutaDelServicio = 'https://script.google.com/macros/s/pruebaNooblife/exec'

export async function configurarServicio(page: Page) {
  await page.route('**/Configuracion%20de%20datos.json', route => route.fulfill({
    json: { servicioDeFotos: rutaDelServicio },
  }))
}

export function respuestaDelServicio(personas: readonly Persona[]) {
  return JSON.stringify({
    version: 1, estado: 'ok',
    personas: personas.map(persona => ({ ...persona, foto: persona.foto ?? '', linkedin: persona.linkedin ?? '' })),
  })
}
