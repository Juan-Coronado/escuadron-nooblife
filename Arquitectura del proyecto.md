# Arquitectura del proyecto

Web estática de presentación con React, TypeScript y Vite, destinada a GitHub Pages. Los módulos responden a funciones de la página: composición, galería, presentación completa, retrato y datos.

## Estructura actual

| Archivo o carpeta | Responsabilidad |
| --- | --- |
| `src/main.tsx` | Iniciar React y cargar estilos globales. |
| `src/App.tsx` | Componer el fondo, portada, galería y pie de página. |
| `src/componentes/Fondo de pagina.tsx` | Imagen decorativa original y su encuadre. |
| `src/componentes/Portada del grupo.tsx` | Marca transparente, título accesible, introducción y acceso al grupo. |
| `src/componentes/Galeria de personas.tsx` | Búsqueda, resultados y persona seleccionada. |
| `src/componentes/Perfil de persona.tsx` | Nombre, apodo, institución, carrera y acceso a la presentación completa. |
| `src/componentes/Detalle de persona.tsx` | Diálogo nativo, campos completos, cierre y manejo del foco. |
| `src/componentes/Retrato de persona.tsx` | Foto opcional, recuperación ante errores e iniciales, compartidas por galería y diálogo. |
| `src/datos/Foto de persona.ts` | Resolver enlaces públicos de archivos de Drive, validar imágenes HTTPS y rutas locales compatibles con Pages. |
| `src/datos/Personas.ts` | Modelo y lista de los 17 registros originales seleccionados. |
| `src/datos/Presentacion de persona.ts` | Nombre, iniciales, orden español, validación de correo y LinkedIn y normalización de búsqueda. |
| `src/datos/Consulta de personas.ts` | Elegir la fuente configurada, consultar los once campos, validar respuestas e identificar personas. |
| `public/Configuracion de datos.json` | URL pública del servicio de Apps Script; vacía hasta activar la integración. |
| `integraciones/Google Sheets/` | Servicio para leer imágenes en celdas, instrucciones y pruebas de su contrato. |
| `src/hooks/Usar personas actualizadas.ts` | Consulta al entrar y cada minuto, reanudación, cancelación, respaldo y conservación de datos válidos. |
| `src/estilos/` | Fuente, colores compartidos, accesibilidad y composición de página. |
| `public/images/` | Fondo original, portada de referencia, marca transparente y futuras fotos. |
| `public/fonts/` | Fuente local y su licencia. |
| `tests/` | Pruebas funcionales de la compilación desde una subcarpeta. |
| `.github/workflows/` | Comprobaciones, compilación y publicación automática con GitHub Actions. |

Cada componente visual tiene su CSS asociado. La entrada no contiene presentación ni reglas de diseño. Los estados de búsqueda y selección pertenecen a la galería; no requieren una dependencia de estado global ni un servicio.

La composición de página usa un contenedor adaptable de hasta 1920 píxeles y márgenes proporcionales. La galería define una, dos, tres o cuatro columnas según el ancho; la portada controla su propia altura y encuadre sin aumentar el ancho de los textos del perfil completo.

## Datos y presentación

Cada persona tiene nueve campos originales como texto: nombres, apellidos, apodos, correo, institución, carreras, habilidades, hobbies y metas. Esto conserva las respuestas originales, sus comas, signos y campos vacíos. La identidad de sesión deriva de nombre, apellido y correo, con un sufijo para duplicados; no depende de la posición de la fila. Una edición de los campos de identidad crea una entrada nueva. Los dos Joseph se distinguen por apellido. La foto, LinkedIn y la descripción corta son opcionales.

La recopilación completa de Google Sheets permanece fuera del proyecto. La consulta pública selecciona únicamente B, C, D, H, I, K, L, N, O, P y Q de la pestaña 709021814. No se usan credenciales en el navegador. La copia original de los nueve campos funciona como respaldo inicial. Las columnas Foto y Link de linkedin pueden tener celdas vacías, pero sus encabezados deben existir en la fuente.

Para las fotos insertadas en celdas, el servicio de Apps Script devuelve un objeto JSON versionado con los once campos por fila, incluido LinkedIn. Lee únicamente las columnas autorizadas, valida encabezados y convierte los valores `CellImage` con `getContentUrl()` en cada solicitud. No almacena enlaces temporales ni modifica el libro. Su activación permanece pendiente de acceso y autorización en Google. Antes de implementarlo, el responsable debe utilizar la versión local actualizada. El cliente solo acepta una URL de implementación HTTPS de `script.google.com` y valida el contrato antes de reemplazar los datos. No ejecuta código remoto.

El hook consulta cada 60 segundos si la página está visible y al volver a ella o recuperar la conexión. Evita consultas simultáneas, cancela al desmontar y limita cada petición a 15 segundos. Los errores conservan la última lista válida; los encabezados incorrectos se rechazan antes de cambiar la galería. Una hoja válida sin filas produce el estado vacío. No hay caché persistente de datos personales en el navegador.

La galería ordena por nombre completo con `Intl.Collator('es')`, conserva la búsqueda durante las actualizaciones y guarda la identidad seleccionada. El perfil obtiene el registro actual en cada render. El detalle usa `dialog.showModal()` para mostrar todos los textos, omite campos vacíos y utiliza `mailto:` solo para direcciones válidas. Su efecto de apertura depende de la identidad para no reiniciar el foco cuando cambia un texto. El cierre devuelve el foco al botón de apertura y restaura el desplazamiento de la página. Tab y Shift+Tab mantienen el foco entre los controles del perfil.

La búsqueda normaliza tildes y mayúsculas sin modificar las cadenas originales. El estado vacío permite limpiar la consulta y recuperar todas las personas. Habilidades, hobbies y metas aparecen completos únicamente en el diálogo. LinkedIn se presenta allí como enlace cuando la URL es HTTPS, pertenece a `linkedin.com` o un subdominio y tiene una ruta de perfil `/in/`. Los otros valores se conservan como texto. El retrato comparte el mismo tratamiento en ambos lugares; las iniciales se calculan a partir de los nombres reales. Un fallo de imagen muestra iniciales y una URL nueva vuelve a intentar la carga. El color de las iniciales deriva del nombre y no de la posición. No se inventan fotografías ni biografías.

## Recursos y crecimiento

El flujo elegido es subir archivos a la [carpeta de Drive](https://drive.google.com/drive/folders/1v7VDKo9V07IS5b6L9JYMrk-4V2fQPzyq) y pegar el enlace del archivo en Foto de su fila. No se recorre la carpeta desde el cliente ni se asocia por nombre de archivo. Los enlaces públicos de Drive se convierten a `/thumbnail?id=...&sz=w800`, conservando `resourcekey`; las direcciones de carpetas se rechazan. La imagen se resuelve al cargar, sin almacenar la URL temporal de `thumbnailLink` de la API. Este acceso público se comprobó con el archivo real de Juan Coronado sin sesión; si falla, el retrato usa iniciales. La carpeta conserva los permisos solicitados por el usuario.

También se aceptan enlaces HTTPS directos y rutas relativas `images/` para recursos locales. Las imágenes insertadas en celdas quedan como alternativa que requiere activar el servicio pendiente. Introducir navegación o estado compartido cuando las funciones lo requieran, manteniendo TypeScript estricto y HTML accesible.

La columna Foto tiene tipo Texto en la tabla de Sheets. Las fichas de archivo exportan su nombre a la consulta pública, sin la dirección necesaria para mostrar la imagen; por ello el enlace se conserva como texto literal. La imagen de Juan Coronado se vinculó en P10 con autorización y se verificó en el navegador del usuario con la fuente real. Las otras columnas y el rango de la tabla se conservaron.

La marca, el fondo, la configuración y las fotos locales utilizan `import.meta.env.BASE_URL`. Las fotos HTTPS conservan su dirección externa. Vite transforma las rutas de fuente y de la compilación para funcionar tanto en localhost como dentro de una subcarpeta de GitHub Pages.

## Nombres

Los nombres visibles y los nombres propios de archivos o carpetas con varias palabras usan espacios. Los identificadores usan camelCase o PascalCase. Los archivos y propiedades estándar de configuración conservan los nombres exigidos por las herramientas.

## Validación

`npm run check` ejecuta lint, tipos, compilación, dos pruebas del servicio con un entorno simulado y 30 pruebas de navegador: diez casos en cada tamaño de escritorio, tablet y móvil. Incluyen búsqueda, navegación, fidelidad de datos y recursos, control del diálogo, orden alfabético, altas y bajas, recuperación de la hoja y actualización del perfil sin perder el foco. También verifican hobbies y metas dentro del perfil, fotos por persona, renovación, error y eliminación del retrato, así como asociación, actualización, retirada y validación de LinkedIn. El caso de Drive comprueba archivos por fila, conservación de la clave de acceso, renovación en el perfil abierto y rechazo de carpetas. Las consultas se interceptan con respuestas controladas; la lectura pública y el servicio real se verifican aparte.

El servidor de desarrollo sigue en `http://127.0.0.1:5173/` y actualiza la vista al guardar. Los archivos de trabajo, capturas, informes y copias previas permanecen fuera de la publicación mediante `.gitignore`.

## Publicación

La web está publicada en [GitHub Pages](https://juan-coronado.github.io/escuadron-nooblife/) desde [Juan-Coronado/escuadron-nooblife](https://github.com/Juan-Coronado/escuadron-nooblife), rama `main`. El flujo utiliza Node.js 24, versiones fijadas de las acciones y permisos de escritura de Pages limitados al trabajo de despliegue. Publica únicamente `dist/` después de superar lint, tipos, compilación y las 32 pruebas. No necesita un servidor local ni claves en el navegador.

El 11 de octubre de 2026 se verificaron el despliegue, los 17 perfiles y la lectura real de Google Sheets desde el dominio público, incluida la foto de Juan Coronado a 800 × 800 píxeles. Las actualizaciones de datos conservan el intervalo de 60 segundos y no requieren commits. Los cambios del código se publican con push a `main`.
