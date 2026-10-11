import { expect, test } from '@playwright/test'
import { personas } from '../src/datos/Personas'
import { respuestaDeHoja, rutaDeHoja } from './Respuesta de hoja'

const servicio = 'https://script.google.com/macros/s/pruebaNooblife/exec'
// Imagen mínima exclusivamente para comprobar carga, errores y asociación en las pruebas.
const imagen = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jY1kAAAAASUVORK5CYII=', 'base64')

test('cell image photos follow the correct person and refresh in the gallery and open profile', async ({ page }) => {
  await page.clock.install()
  let registros = personas.map(persona => ({ ...persona, foto: '', linkedin: '' }))
  let falloDeFoto = true
  registros = registros.map(persona => persona.apellidos === 'Ccana' ? {
    ...persona, foto: 'https://lh3.googleusercontent.com/pruebaFotoCcana', hobbies: 'Hobby de la hoja', metas: 'Meta de la hoja',
  } : persona)
  await page.route('**/Configuracion%20de%20datos.json', route => route.fulfill({ json: { servicioDeFotos: servicio } }))
  await page.route(servicio, route => route.fulfill({ json: { version: 1, estado: 'ok', personas: registros } }))
  await page.route('https://lh3.googleusercontent.com/pruebaFoto*', route => {
    if (falloDeFoto && route.request().url().endsWith('Rota')) return route.fulfill({ status: 404, body: '' })
    return route.fulfill({ contentType: 'image/png', body: imagen })
  })
  await page.goto('/prueba-pages/')
  const search = page.getByRole('searchbox', { name: 'Encuentra a alguien' })
  await search.fill('Joseph')
  const ccana = page.getByRole('article', { name: 'Presentación de Joseph Ccana', exact: true })
  const quispe = page.getByRole('article', { name: 'Presentación de Joseph Quispe', exact: true })
  await expect(ccana.getByRole('img', { name: 'Retrato de Joseph Ccana' })).toHaveAttribute('src', 'https://lh3.googleusercontent.com/pruebaFotoCcana')
  await expect.poll(() => ccana.getByRole('img').evaluate(image => (image as HTMLImageElement).naturalWidth)).toBe(1)
  await expect(quispe.getByRole('img')).toHaveCount(0)
  await expect(ccana.getByText('Hobby de la hoja', { exact: true })).toHaveCount(0)
  await expect(ccana.getByText('Meta de la hoja', { exact: true })).toHaveCount(0)
  await ccana.getByRole('button').click()
  const perfil = page.getByRole('dialog', { name: 'Joseph Ccana', exact: true })
  await expect(perfil.getByText('Hobby de la hoja', { exact: true })).toBeVisible()
  await expect(perfil.getByText('Meta de la hoja', { exact: true })).toBeVisible()
  await expect(perfil.getByRole('img')).toHaveAttribute('src', 'https://lh3.googleusercontent.com/pruebaFotoCcana')
  const correo = perfil.getByRole('link')
  await correo.focus()
  registros = registros.map(persona => persona.apellidos === 'Ccana' ? {
    ...persona, foto: 'https://lh3.googleusercontent.com/pruebaFotoNueva', hobbies: 'Hobby nuevo', metas: 'Meta nueva',
  } : persona)
  await page.clock.fastForward(60000)
  await expect(perfil.getByRole('img')).toHaveAttribute('src', 'https://lh3.googleusercontent.com/pruebaFotoNueva')
  await expect(perfil.getByText('Hobby nuevo', { exact: true })).toBeVisible()
  await expect(perfil.getByText('Meta nueva', { exact: true })).toBeVisible()
  await expect(correo).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(ccana.getByText('Hobby nuevo', { exact: true })).toHaveCount(0)
  await expect(ccana.getByText('Meta nueva', { exact: true })).toHaveCount(0)

  registros = registros.map(persona => persona.apellidos === 'Ccana' ? { ...persona, foto: 'https://lh3.googleusercontent.com/pruebaFotoRota' } : persona)
  await page.clock.fastForward(60000)
  await expect(ccana.getByRole('img')).toHaveCount(0)
  await expect(ccana.locator('.retratoDePersona')).toHaveText('JC')
  registros = registros.map(persona => persona.apellidos === 'Ccana' ? { ...persona, foto: 'https://lh3.googleusercontent.com/pruebaFotoRecuperada' } : persona)
  await page.clock.fastForward(60000)
  await expect.poll(() => ccana.getByRole('img').evaluate(image => (image as HTMLImageElement).naturalWidth)).toBe(1)
  registros = registros.map(persona => persona.apellidos === 'Ccana' ? { ...persona, foto: '', hobbies: '', metas: '' } : persona)
  await page.clock.fastForward(60000)
  await expect(ccana.getByRole('img')).toHaveCount(0)
  await expect(ccana.locator('.retratoDePersona')).toHaveText('JC')
  await expect(search).toHaveValue('Joseph')
  falloDeFoto = false
  registros = registros.map(persona => persona.apellidos === 'Ccana' ? { ...persona, foto: 'https://lh3.googleusercontent.com/pruebaFotoRota' } : persona)
  await page.clock.fastForward(60000)
  await expect.poll(() => ccana.getByRole('img').evaluate(image => (image as HTMLImageElement).naturalWidth)).toBe(1)
})

test('local profile photos work below the Pages path and invalid protocols keep initials', async ({ page }) => {
  const registros = personas.map(persona => persona.nombres === 'Andre' ? {
    ...persona, foto: 'images/fondo-textura.png',
  } : persona.nombres === 'Celeste' ? { ...persona, foto: 'javascript:alert(1)' } : persona)
  await page.route(rutaDeHoja, route => route.fulfill({ contentType: 'application/javascript', body: respuestaDeHoja(registros) }))
  await page.goto('/prueba-pages/')
  const andre = page.getByRole('article', { name: 'Presentación de Andre Mestanza', exact: true })
  await andre.scrollIntoViewIfNeeded()
  await expect(andre.getByRole('img')).toHaveAttribute('src', './images/fondo-textura.png')
  await expect.poll(() => andre.getByRole('img').evaluate(image => (image as HTMLImageElement).naturalWidth)).toBe(1536)
  const celeste = page.getByRole('article', { name: 'Presentación de Celeste Ygnacio Díaz', exact: true })
  await expect(celeste.getByRole('img')).toHaveCount(0)
  await expect(celeste.locator('.retratoDePersona')).toHaveText('CY')
})

test('public Drive file links load for the correct person and folder links keep initials', async ({ page }) => {
  await page.clock.install()
  let registros = personas.map(persona => persona.apellidos === 'Ccana' ? {
    ...persona, foto: 'https://drive.google.com/file/d/fotoDeCcanaPruebaA/view?usp=sharing&resourcekey=0-claveDePrueba',
  } : persona.apellidos === 'Quispe' ? {
    ...persona, foto: 'https://drive.google.com/drive/folders/carpetaDeQuispePrueba',
  } : persona)
  await page.route(rutaDeHoja, route => route.fulfill({ contentType: 'application/javascript', body: respuestaDeHoja(registros) }))
  await page.route('https://drive.google.com/thumbnail?*', route => route.fulfill({ contentType: 'image/png', body: imagen }))
  await page.goto('/prueba-pages/')
  await page.getByRole('searchbox', { name: 'Encuentra a alguien' }).fill('Joseph')
  const ccana = page.getByRole('article', { name: 'Presentación de Joseph Ccana', exact: true })
  const quispe = page.getByRole('article', { name: 'Presentación de Joseph Quispe', exact: true })
  const fotoInicial = 'https://drive.google.com/thumbnail?id=fotoDeCcanaPruebaA&sz=w800&resourcekey=0-claveDePrueba'
  await expect(ccana.getByRole('img')).toHaveAttribute('src', fotoInicial)
  await expect.poll(() => ccana.getByRole('img').evaluate(foto => (foto as HTMLImageElement).naturalWidth)).toBe(1)
  await expect(quispe.getByRole('img')).toHaveCount(0)
  await ccana.getByRole('button').click()
  const perfil = page.getByRole('dialog', { name: 'Joseph Ccana', exact: true })
  await expect(perfil.getByRole('img')).toHaveAttribute('src', fotoInicial)
  const correo = perfil.getByRole('link')
  await correo.focus()
  registros = registros.map(persona => persona.apellidos === 'Ccana' ? {
    ...persona, foto: 'https://drive.google.com/uc?export=view&id=fotoDeCcanaPruebaB',
  } : persona.apellidos === 'Quispe' ? {
    ...persona, foto: 'https://drive.google.com/open?id=fotoDeQuispePrueba',
  } : persona)
  await page.clock.fastForward(60000)
  const fotoNueva = 'https://drive.google.com/thumbnail?id=fotoDeCcanaPruebaB&sz=w800'
  await expect(perfil.getByRole('img')).toHaveAttribute('src', fotoNueva)
  await expect(ccana.getByRole('img')).toHaveAttribute('src', fotoNueva)
  await expect(quispe.getByRole('img')).toHaveAttribute('src', 'https://drive.google.com/thumbnail?id=fotoDeQuispePrueba&sz=w800')
  await expect(correo).toBeFocused()
  await page.keyboard.press('Escape')
  registros = registros.map(persona => persona.apellidos === 'Ccana' ? { ...persona, foto: '' } : persona)
  await page.clock.fastForward(60000)
  await expect(ccana.getByRole('img')).toHaveCount(0)
  await expect(ccana.locator('.retratoDePersona')).toHaveText('JC')
  await expect.poll(() => quispe.getByRole('img').evaluate(foto => (foto as HTMLImageElement).naturalWidth)).toBe(1)
})
