import { expect, test } from '@playwright/test'
import { personas } from '../src/datos/Personas'
import { respuestaDeHoja, rutaDeHoja } from './Respuesta de hoja'

test('live updates keep alphabetical order, refresh the open profile and preserve search and focus', async ({ page }) => {
  await page.clock.install()
  let registros = [...personas]
  await page.route(rutaDeHoja, route => {
    const consulta = new URL(route.request().url()).searchParams.get('tq')
    expect(consulta).toBe('select B, C, D, H, I, K, L, N, O, P, Q')
    return route.fulfill({ contentType: 'application/javascript', body: respuestaDeHoja(registros) })
  })
  await page.goto('/prueba-pages/')
  await expect(page.getByRole('article').first()).toHaveAccessibleName('Presentación de Andre Mestanza')
  await expect(page.getByRole('article').last()).toHaveAccessibleName('Presentación de Sergio Ayuque')

  const search = page.getByRole('searchbox', { name: 'Encuentra a alguien' })
  await search.fill('Joseph')
  await page.getByRole('button', { name: 'Ver perfil de Joseph Ccana', exact: true }).click()
  const perfil = page.getByRole('dialog', { name: 'Joseph Ccana', exact: true })
  const correo = perfil.getByRole('link', { name: 'joseph200345@gmail.com', exact: true })
  await correo.focus()
  registros = registros.map(persona => persona.apellidos === 'Ccana' ? { ...persona, metas: 'Meta actualizada desde la hoja' } : persona)
  await page.clock.fastForward(60000)
  await expect(perfil.getByText('Meta actualizada desde la hoja', { exact: true })).toBeVisible()
  await expect(correo).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(search).toHaveValue('Joseph')
  await expect(page.getByRole('article')).toHaveCount(2)
  await page.getByRole('button', { name: 'Limpiar búsqueda', exact: true }).click()

  registros = registros.filter(persona => persona.nombres !== 'Neil')
  registros.push({ ...personas[0], id: 'nueva', nombres: 'Álvaro', apellidos: 'Zapata', correo: '', apodos: '' })
  await page.clock.fastForward(60000)
  await expect(page.getByRole('article').first()).toHaveAccessibleName('Presentación de Álvaro Zapata')
  await expect(page.getByRole('heading', { name: 'Neil', exact: true })).toHaveCount(0)
  await expect(page.getByRole('article')).toHaveCount(17)
})

test('a failed or invalid sheet keeps the last valid data and recovers on the next refresh', async ({ page }) => {
  await page.clock.install()
  let contenido = '<html>No disponible</html>'
  await page.route(rutaDeHoja, route => route.fulfill({ contentType: 'application/javascript', body: contenido }))
  await page.goto('/prueba-pages/')
  await expect(page.getByText('No pudimos actualizar los datos. Mostramos la última información disponible.', { exact: true })).toBeVisible()
  await expect(page.getByRole('article')).toHaveCount(17)

  const registros = personas.map(persona => persona.nombres === 'Marco' ? { ...persona, apodos: 'Apodo actualizado' } : persona)
  contenido = respuestaDeHoja(registros)
  await page.clock.fastForward(60000)
  await expect(page.getByText('Apodo actualizado', { exact: true })).toBeVisible()
  await expect(page.getByText('No pudimos actualizar los datos. Mostramos la última información disponible.', { exact: true })).toHaveCount(0)

  contenido = respuestaDeHoja(personas).replace('Universidades / Institutos', 'Columna incorrecta')
  await page.clock.fastForward(60000)
  await expect(page.getByText('No pudimos actualizar los datos. Mostramos la última información disponible.', { exact: true })).toBeVisible()
  await expect(page.getByText('Apodo actualizado', { exact: true })).toBeVisible()
  await expect(page.getByRole('article')).toHaveCount(17)
})
