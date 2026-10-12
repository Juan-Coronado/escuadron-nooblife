import { expect, test } from '@playwright/test'
import { rutaDelServicio } from './Respuesta del servicio'

test('an empty configuration or failing API never reconnects directly to Google Sheets', async ({ page }) => {
  await page.clock.install()
  let servicioDeFotos = ''
  let consultasDeHoja = 0
  let consultasDeApi = 0
  await page.route('**/Configuracion%20de%20datos.json', route => route.fulfill({ json: { servicioDeFotos } }))
  await page.route('https://docs.google.com/spreadsheets/**', route => {
    consultasDeHoja += 1
    return route.fulfill({ status: 403, body: '' })
  })
  await page.route(rutaDelServicio, route => {
    consultasDeApi += 1
    return route.fulfill({ status: 503, body: '' })
  })
  const aviso = page.getByText('No pudimos actualizar los datos. Mostramos la última información disponible.', { exact: true })
  for (const configuracion of ['', 'https://docs.google.com/spreadsheets/d/otraHojaDePrueba/gviz/tq', rutaDelServicio]) {
    servicioDeFotos = configuracion
    await page.goto('/prueba-pages/')
    await expect(aviso).toBeVisible()
    expect(consultasDeHoja).toBe(0)
    expect(consultasDeApi).toBe(configuracion === rutaDelServicio ? 1 : 0)
  }

  await page.clock.fastForward(60000)
  await expect.poll(() => consultasDeApi).toBe(2)
  await expect(aviso).toBeVisible()
  expect(consultasDeHoja).toBe(0)
  await expect(page.getByRole('article')).toHaveCount(17)
})
