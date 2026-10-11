# Escuadrón Nooblife

Web de presentación para 17 amigos, con la textura original elegida por el usuario. La cabecera integra la marca sobre el fondo continuo. La galería destaca el nombre primero, seguido del apodo, la institución y la carrera; cada botón «Ver perfil» abre la presentación completa. Las iniciales reales ocupan el lugar de las fotos pendientes o que no puedan cargar.

La estructura se describe en [Arquitectura del proyecto](<Arquitectura del proyecto.md>) y las decisiones visuales en [Dirección de diseño](DESIGN.md). Los nombres propios de archivos con varias palabras usan espacios, sin guiones bajos.

## Datos de las presentaciones

La web consulta la pestaña `Hoja_de_Tarjetas` de Google Sheets al abrirse, cada 60 segundos mientras está visible, al regresar a la pestaña y al recuperar la conexión. Lee únicamente los once campos elegidos por el usuario: nombres, apellidos, apodos, correo, institución, carreras, habilidades, hobbies, metas, foto y LinkedIn. Los textos y campos vacíos se conservan como aparecen en la hoja.

La consulta es de solo lectura y no necesita claves ni iniciar sesión porque la hoja proporcionada ya permite lectura pública. La URL y las columnas se configuran en `src/datos/Consulta de personas.ts`. Se comprueban los encabezados antes de aceptar los datos; si cambian las columnas, se debe revisar ese mapa. No se ejecuta el JavaScript devuelto por Google: se extrae y valida su contenido JSON.

`src/datos/Personas.ts` conserva la copia original como respaldo. Ante un fallo de conexión o una respuesta inválida, se mantiene la última lectura válida de la sesión y se muestra un aviso. Al recargar sin acceso a la hoja se utiliza la copia incluida en la compilación. Google puede introducir una demora adicional; la consulta periódica no es una notificación instantánea de cada edición.

La identidad de cada registro en la sesión se obtiene del nombre, apellido y correo, con un sufijo para duplicados. Así, cambiar hobbies, metas, foto o LinkedIn no cambia su identidad ni cierra su perfil. Cambiar un campo de identidad crea una entrada nueva. La foto, LinkedIn y la descripción corta son opcionales. La columna Foto de la hoja tiene prioridad sobre el respaldo; dejarla vacía retira el retrato y muestra iniciales.

Hobbies y metas se muestran completos dentro de «Ver perfil». La galería muestra únicamente la identidad, el apodo y los estudios.

La columna **Link de linkedin** (Q) alimenta el campo LinkedIn del perfil completo. Una dirección HTTPS de perfil en `linkedin.com` se muestra como «Ver perfil en LinkedIn» y abre otra pestaña; los valores que no son enlaces de perfil válidos permanecen como texto. Las celdas vacías se omiten. Se utiliza la misma actualización automática de la hoja y no se añaden enlaces a la galería.

## Fotos mediante enlaces de Drive

La carpeta elegida es [Fotos para la pagina](https://drive.google.com/drive/folders/1v7VDKo9V07IS5b6L9JYMrk-4V2fQPzyq). Cada integrante sube su imagen a su subcarpeta, copia el enlace del archivo y lo pega como texto en **Foto (P)** de su fila. La web convierte los enlaces públicos de archivos de Drive a una dirección de imagen de hasta 800 píxeles y conserva `resourcekey` cuando existe. No usa el enlace de la carpeta para elegir una foto automáticamente.

La guía [Fotos de perfil con Drive](<integraciones/Google Sheets/Fotos de perfil con Drive.md>) describe el proceso y los formatos aceptados. Las fotos deben poder leerse sin iniciar sesión. Este flujo funciona con la consulta pública actual; no requiere activar Apps Script. La misma foto aparece en la galería y el perfil, se renueva cuando cambia su URL y muestra iniciales si el archivo no puede cargar. Las URLs HTTPS directas y las rutas locales `images/Nombre de la persona.jpg` también funcionan.

Foto utiliza el tipo **Texto** en la tabla de Google Sheets. Pegar el enlace como URL literal, sin convertirlo en ficha de archivo: la consulta pública exporta el nombre de las fichas y pierde su dirección. La foto de Juan Coronado está vinculada en P10 y se comprobó en la vista normal con los datos reales.

La dirección pública de imagen de Drive se comprobó sin sesión con el archivo disponible de Juan Coronado. No es un servicio dedicado al alojamiento de imágenes; cambios en la disponibilidad o permisos del archivo pueden interrumpir su carga. La carpeta conserva los permisos elegidos por el usuario.

## Alternativa: fotos insertadas en las celdas

La consulta pública de texto no entrega las imágenes insertadas en celdas. El servicio `integraciones/Google Sheets/Fotos y presentaciones.gs` utiliza `CellImage.getContentUrl()` para obtener cada retrato de Foto (P), en la misma fila que su persona. Lee solo las columnas autorizadas y no modifica la hoja. Las URLs temporales se vuelven a obtener en cada consulta; no se guardan en la copia de respaldo.

La integración necesita activar una aplicación web de Apps Script una vez. La guía está en [Activar fotos de perfil](<integraciones/Google Sheets/Activar fotos de perfil.md>). Su URL `/exec` se introduce en `public/Configuracion de datos.json`, campo `servicioDeFotos`. No se incluye un secreto en ese archivo. Mientras está vacío, la página sigue usando la consulta pública de texto. Una dirección configurada incorrectamente o un servicio que falla conserva la última información válida y muestra el aviso de conexión.

Para esta alternativa se debe elegir **Insertar → Imagen → Imagen en la celda**, en Foto de la fila correspondiente, después de activar el servicio. Las imágenes flotantes sobre las celdas no se leen como retratos. Su activación continúa pendiente y no es necesaria para las fotos por URL de Drive.

Las presentaciones se ordenan alfabéticamente por nombre completo con las reglas del español, también después de cada actualización. La búsqueda filtra por nombre, apellido, apodo, universidad o instituto y carrera, sin exigir tildes ni mayúsculas. Si no hay coincidencias, ofrece limpiar la búsqueda para volver al grupo completo. Si no existen registros, muestra un estado vacío.

El perfil completo muestra los campos disponibles y conserva los textos largos. Solo los correos con formato de dirección tienen un enlace `mailto:`; las otras respuestas se muestran como texto. El diálogo permite cerrar con el botón, Escape o un clic fuera; mantiene el foco dentro y lo devuelve al botón de apertura.

## Desarrollo local

Requiere Node.js 24 y npm.

```sh
npm ci --ignore-scripts
npm run dev
```

Vista local: `http://127.0.0.1:5173/`.

## Verificación y compilación

```sh
npm run check
```

Ejecuta lint, TypeScript, compilación, dos pruebas del servicio de Apps Script con un entorno simulado y 30 pruebas de navegador en escritorio, tablet y móvil. Comprueba perfiles, recursos y fotos locales desde una subcarpeta equivalente a GitHub Pages, búsqueda, navegación, textos originales, enlaces de correo, foco y cierre. Simula actualizaciones, altas y bajas, orden alfabético, fallo y recuperación de la hoja; también asociación, renovación, error y retirada de fotos, hobbies, metas y LinkedIn con el perfil abierto. Verifica enlaces de archivos de Drive, su clave de acceso, cambios de URL y el rechazo de direcciones de carpetas. Comprueba que la galería conserve solo los datos de presentación solicitados y que los enlaces de LinkedIn correspondan a la persona correcta. Las pruebas usan respuestas controladas; no sustituyen la comprobación real del servicio después de autorizarlo. Si faltan los navegadores, ejecutar `npx playwright install chromium`.

`npm run build` genera `dist/`. `npm run preview` sirve esa compilación localmente.

## Recursos visuales

`public/images/fondo-textura.png`: PNG original de 1536 × 1024 píxeles, sin compresión adicional. `object-fit: cover` conserva las proporciones y recorta el encuadre según la pantalla. Una capa CSS ayuda a leer sobre la textura; el archivo permanece intacto.

`public/images/Portada Escuadron Nooblife.png`: portada original de 2170 × 725 píxeles entregada por el usuario. Se conserva como fuente original y no se utiliza como fondo de la cabecera.

`public/images/Marca Escuadron Nooblife.png`: edición de 2169 × 725 píxeles con transparencia real, realizada con el generador integrado. La cabecera coloca estas letras sobre el fondo original continuo, sin incorporar otra placa de piedra. El título también existe como texto accesible.

Bricolage Grotesque se sirve desde `public/fonts/`, con su licencia SIL Open Font License incluida. Los iconos de Phosphor se importan individualmente, con peso regular. No se utilizan servicios de fuentes en la página.

## GitHub Pages

Vite usa rutas relativas (`base: './'`). El flujo `.github/workflows/pages.yml` está preparado para compilar y desplegar al publicar la rama `main` en un repositorio con Pages configurado para GitHub Actions. La página todavía no está publicada.
