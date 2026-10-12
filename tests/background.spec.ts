import { expect, test } from '@playwright/test'
import { personas } from '../src/datos/Personas'
import { configurarServicio, respuestaDelServicio, rutaDelServicio } from './Respuesta del servicio'

test.beforeEach(async ({ page }) => {
  await page.route(rutaDelServicio, route => route.fulfill({
    contentType: 'application/json', body: respuestaDelServicio(personas),
  }))
})

test('all people and the original background load at the GitHub Pages path', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('response', response => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`)
  })

  await configurarServicio(page)
  await page.goto('/prueba-pages/')
  await expect(page).toHaveTitle('Escuadrón Nooblife')
  await expect(page.getByRole('heading', { name: 'Escuadrón Nooblife', exact: true })).toBeVisible()
  await expect(page.getByRole('article')).toHaveCount(17)
  await expect(page.getByRole('article', { name: 'Presentación de Joseph Ccana', exact: true })).toHaveCount(1)
  await expect(page.getByRole('article', { name: 'Presentación de Joseph Quispe', exact: true })).toHaveCount(1)
  await expect(page.getByRole('heading', { name: 'Neil', exact: true })).toBeVisible()
  const background = page.locator('.fondo img')
  await expect(background).toBeVisible()
  await expect(background).toHaveAttribute('alt', '')
  await expect(background).toHaveAttribute('src', './images/fondo-textura.png')

  await expect.poll(() => background.evaluate(image => {
    const element = image as HTMLImageElement
    return element.complete && element.naturalWidth === 1536 && element.naturalHeight === 1024
  })).toBe(true)

  const viewport = page.viewportSize()!
  expect(await background.boundingBox()).toEqual({ x: 0, y: 0, ...viewport })
  await expect(background).toHaveCSS('object-fit', 'cover')
  await expect(background).toHaveCSS('filter', 'none')
  await page.waitForLoadState('networkidle')
  expect(await page.evaluate(() => document.fonts.check('600 32px "Bricolage Grotesque"'))).toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  expect(errors).toEqual([])
  await page.screenshot({ path: `test-results/Presentaciones ${test.info().project.name}.png` })
})

test('complete profiles preserve data, contain keyboard focus and return it on close', async ({ page }) => {
  await configurarServicio(page)
  await page.goto('/prueba-pages/')
  const trigger = page.getByRole('button', { name: 'Ver perfil de Joseph Ccana', exact: true })
  await trigger.focus()
  await trigger.press('Enter')
  const joseph = page.getByRole('dialog', { name: 'Joseph Ccana', exact: true })
  await expect(joseph).toBeVisible()
  await expect(joseph.getByRole('button', { name: 'Cerrar perfil' })).toBeFocused()
  await expect(joseph.getByRole('link', { name: 'joseph200345@gmail.com', exact: true })).toHaveAttribute('href', 'mailto:joseph200345@gmail.com')
  await expect(joseph.getByRole('heading', { name: 'Metas', exact: true })).toBeVisible()
  await expect(joseph.getByText('Modelador REVIT BIM, Dibujante Autocad, Etabs e Investigador y experiencia en visitas en obras', { exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden')
  await page.keyboard.press('Shift+Tab')
  await expect(joseph.getByRole('link')).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(joseph).not.toBeVisible()
  await expect(trigger).toBeFocused()
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('')

  await page.getByRole('button', { name: 'Ver perfil de Juan Coronado', exact: true }).click()
  const juan = page.getByRole('dialog', { name: 'Juan Coronado', exact: true })
  await expect(juan.getByText('pasa prompt fast', { exact: true })).toBeVisible()
  await expect(juan.getByRole('link')).toHaveCount(0)
  await juan.getByRole('button', { name: 'Cerrar perfil' }).click()
  await page.getByRole('button', { name: 'Ver perfil de Cristhian Chujutalli', exact: true }).click()
  const cristhian = page.getByRole('dialog', { name: 'Cristhian Chujutalli', exact: true })
  await expect(cristhian.getByText('cual de los 3?', { exact: true })).toBeVisible()
  await expect(cristhian.getByRole('link')).toHaveCount(0)
  await page.keyboard.press('Escape')

  await page.getByRole('button', { name: 'Ver perfil de Gabriela Garay Salinas', exact: true }).click()
  const gabriela = page.getByRole('dialog', { name: 'Gabriela Garay Salinas', exact: true })
  await expect(gabriela.getByText('tener mi casita de playa </3', { exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  expect(await gabriela.evaluate(dialog => dialog.scrollWidth <= dialog.clientWidth)).toBe(true)
  await page.screenshot({ path: `test-results/Perfil completo ${test.info().project.name}.png` })
  await page.keyboard.press('Escape')
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.getByRole('button', { name: 'Ver perfil de Marco Pillaca', exact: true }).click()
  await page.mouse.click(2, 2)
  await expect(page.getByRole('dialog')).not.toBeVisible()
})

test('search finds names without accents, nicknames and studies and recovers from empty results', async ({ page }) => {
  await configurarServicio(page)
  await page.goto('/prueba-pages/')
  const search = page.getByRole('searchbox', { name: 'Encuentra a alguien' })
  await search.fill('ramon')
  await expect(page.getByRole('article')).toHaveCount(1)
  await expect(page.getByRole('heading', { name: 'Ramón Jean Paul', exact: true })).toBeVisible()
  await search.fill('zorro')
  await expect(page.getByRole('article', { name: 'Presentación de Joseph Ccana', exact: true })).toBeVisible()
  await search.fill('TECSUP')
  await expect(page.getByRole('article')).toHaveCount(1)
  await expect(page.getByRole('heading', { name: 'Diego Colquichagua', exact: true })).toBeVisible()
  await search.fill('Joseph')
  await expect(page.getByRole('article')).toHaveCount(2)
  await search.fill('zzzzz')
  await expect(page.getByRole('article')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'No encontramos a esa persona' })).toBeVisible()
  await page.getByRole('button', { name: 'Ver todo el grupo' }).click()
  await expect(search).toHaveValue('')
  await expect(page.getByRole('article')).toHaveCount(17)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('navigation reaches the group and clearing search restores all people and focus', async ({ page }) => {
  await configurarServicio(page)
  await page.goto('/prueba-pages/')
  await page.getByRole('link', { name: 'Conoce al grupo', exact: true }).click()
  await expect(page).toHaveURL(/#grupo$/)
  await expect(page.getByRole('heading', { name: 'Nuestra gente.', exact: true })).toBeInViewport()

  const search = page.getByRole('searchbox', { name: 'Encuentra a alguien' })
  await search.fill('Joseph')
  await expect(page.getByRole('article')).toHaveCount(2)
  await expect(page.getByRole('heading', { name: 'Joseph Ccana', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Limpiar búsqueda', exact: true }).click()
  await expect(search).toBeFocused()
  await expect(search).toHaveValue('')
  await expect(page.getByRole('article')).toHaveCount(17)

  await page.getByRole('link', { name: 'Volver arriba', exact: true }).click()
  await expect(page).toHaveURL(/#inicio$/)
  await expect(page.getByRole('heading', { name: 'Escuadrón Nooblife', exact: true })).toBeInViewport()
})
