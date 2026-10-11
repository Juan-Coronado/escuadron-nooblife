/** Resuelve fotos públicas de Drive, imágenes HTTPS y rutas locales de public. */
export function direccionDeFoto(foto: string | undefined): string | undefined {
  const direccion = foto?.trim()
  if (!direccion) return undefined
  if (/^https:\/\//i.test(direccion)) {
    try {
      const url = new URL(direccion)
      if (url.username || url.password) return undefined
      if (url.hostname === 'drive.google.com') return fotoPublicaDeDrive(url)
      if (url.hostname === 'drive.usercontent.google.com' && url.pathname === '/download'
        || url.hostname === 'docs.google.com' && url.pathname === '/uc') {
        return fotoPublicaDeDrive(url)
      }
      return url.href
    } catch {
      return undefined
    }
  }
  if (!direccion.startsWith('images/') || direccion.includes('..') || direccion.includes('\\')) return undefined
  return `${import.meta.env.BASE_URL}${direccion}`
}

function fotoPublicaDeDrive(url: URL): string | undefined {
  if (url.port) return undefined
  const archivoDeLaRuta = url.pathname.match(/^\/file\/(?:u\/\d+\/)?d\/([A-Za-z0-9_-]+)(?:\/view|\/preview)?\/?$/)?.[1]
  const archivoDeLaConsulta = ['/open', '/uc', '/thumbnail', '/download'].includes(url.pathname)
    ? url.searchParams.get('id') : undefined
  const archivo = archivoDeLaRuta ?? archivoDeLaConsulta
  if (!archivo || !/^[A-Za-z0-9_-]{10,}$/.test(archivo)) return undefined

  const parametros = new URLSearchParams({ id: archivo, sz: 'w800' })
  const claveDeAcceso = url.searchParams.get('resourcekey')
  if (claveDeAcceso) parametros.set('resourcekey', claveDeAcceso)
  // La dirección pública se resuelve al cargar; no se almacena una URL temporal de Google.
  return `https://drive.google.com/thumbnail?${parametros}`
}
