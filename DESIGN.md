# Dirección de diseño

## Contexto y decisión

Web de presentación para el usuario y sus amigos, destinada a GitHub Pages. Hay 17 perfiles con los once campos autorizados, incluidas las columnas Foto y Link de linkedin. LinkedIn se muestra dentro del perfil completo. El flujo de fotos elegido es subir imágenes a la carpeta de Drive del grupo y pegar el enlace del archivo en Foto de su fila. Las imágenes insertadas en celdas quedan como alternativa; la activación de Apps Script permanece pendiente de acceso y autorización en Google. Las descripciones cortas siguen pendientes.

El usuario observó que la portada parecía una imagen pegada sobre otro fondo. La revisión separa el lettering de la piedra mediante transparencia real y utiliza una única textura continua. La cabecera distribuye la marca y una introducción con acceso al grupo en dos columnas; en móvil se apilan. Por solicitud del usuario se retiró la barra superior y su línea divisoria. El acceso «Conoce al grupo» permanece en la introducción y «Volver arriba» en el pie.

Skill principal: `design-taste-frontend`, seleccionada mediante `professional-project-orchestrator`. Skill auxiliar: `imagegen`, con el generador integrado para la edición de la marca. La implementación mantiene CSS nativo.

## Identidad y fondo

La textura original, `public/images/fondo-textura.png`, conserva sus 1536 × 1024 píxeles y el SHA-256 `FF639A643B50564F87BF7B43D53182016E0412CBD542A30FB040D01A77625D80`. Se encuadra con `object-fit: cover`, sin deformaciones ni filtros sobre el archivo. Una capa CSS gradual permite leer sobre la piedra.

La portada proporcionada permanece intacta en `public/images/Portada Escuadron Nooblife.png`, 2170 × 725 píxeles, SHA-256 `E4DC06118AFA44BFA129CDE97B48A88BBF27528AED6EA26EC992A7995BFAE40B`. Ya no se precarga ni se presenta como placa de fondo.

La versión seleccionada, `public/images/Marca Escuadron Nooblife.png`, tiene 2169 × 725 píxeles y un canal alfa real. SHA-256 `B59C2814D3C97D4539F35F8C445D59C9B5E57EBE2EB02EB40F08E4D24810437C`. Solo las letras aportan el tratamiento de piedra. El contenedor reserva el espacio de la zona visible del lettering para evitar que sus márgenes transparentes alarguen la cabecera. El título también existe como texto accesible y la imagen decorativa tiene alt vacío.

## Sistema visual

- Tipografía: lettering de piedra para la marca y Bricolage Grotesque local para texto y controles. La licencia SIL Open Font License está en `public/fonts/`.
- Paleta: tierra `#080604`, superficie `#14110D`, detalle `#211A14`, marfil `#F4EEE4`, texto secundario `#CFC2B2` y arena `#E0BD90`.
- Formas: una superficie común de lectura con bordes suaves; perfiles abiertos, retratos circulares con contorno fino y controles en píldora.
- Jerarquía: nombre real primero, apodo secundario, institución y carrera. La galería sigue la referencia entregada por el usuario; hobbies y metas se reservan para el perfil completo. Los botones se alinean al final de cada fila en escritorio.
- Iconos: Phosphor, peso regular e importaciones individuales.
- Movimiento: solo respuestas breves al pasar el puntero o pulsar. Se respeta `prefers-reduced-motion`. No hay animaciones automáticas ni desplazamiento controlado.

## Galería e interacción

El contenedor aprovecha el ancho hasta 1920 píxeles, con márgenes proporcionales. La galería tiene tres columnas, cuatro desde 1400 píxeles, dos en tablet y una en móvil. En móvil cada retrato queda al lado de su identidad. Las personas se ordenan por nombre completo, siguiendo el alfabeto español.

El buscador tiene etiqueta visible y encuentra nombres, apellidos, apodos, institución y carrera sin exigir tildes ni mayúsculas. El contador anuncia los resultados. El estado sin coincidencias permite limpiar la búsqueda. Por solicitud del usuario se retiraron los botones Todos, Habilidades y Hobbies y su lógica; la cabecera de la galería pasa directamente a las presentaciones.

Los controles principales tienen al menos 44 píxeles de alto y foco visible. El perfil completo usa un diálogo nativo, conserva todos los textos y permite cerrar con Escape, el botón etiquetado o un clic fuera. El foco permanece dentro y vuelve al botón de apertura al cerrar; el contenido puede desplazarse en móvil.

Los campos vacíos se omiten. Solo las direcciones válidas tienen enlaces de correo. Las iniciales reales ocupan el lugar de las fotos pendientes o fallidas. Los retratos de la hoja se encuadran en el mismo círculo, con `object-fit: cover`. Hobbies y metas conservan su contenido completo dentro del diálogo y se retiran de la galería. LinkedIn tiene su etiqueta y acceso con el mismo tratamiento de arena y flecha que el correo; abre otra pestaña y lo anuncia en su nombre accesible. No se crean personas ni historias.

Los datos de la hoja se consultan al entrar y cada minuto mientras la página está visible. La búsqueda y el perfil abierto se conservan durante cambios de contenido. Si falla la lectura, un aviso breve comunica que se muestra la última información disponible. No se añaden botones de filtros ni controles de sincronización al diseño.

## Verificación — 11 de octubre de 2026

Verificación: lint, TypeScript, compilación, dos pruebas del servicio con un entorno simulado y 30 pruebas funcionales en escritorio, tablet y móvil, bajo una subcarpeta equivalente a GitHub Pages. Comprueban datos y recursos, búsqueda, navegación, correos, cierre y foco, orden alfabético, sincronización, hobbies y metas dentro del perfil, asociación y renovación de retratos, imágenes fallidas y eliminación de fotos. También verifican LinkedIn por persona, actualizaciones con el perfil abierto, valores vacíos e inválidos y foco con el nuevo enlace. Los enlaces públicos de Drive se comprueban por persona, con clave de acceso, renovación y rechazo de carpetas; el archivo real de Juan Coronado cargó sin sesión en el navegador. La activación real de Apps Script permanece pendiente.

También se revisaron capturas de 1854 × 929, 1440 × 1000, 2560 × 1440, 390 × 844 y 320 × 740. Se comprobaron la cabecera, la galería y perfiles completos, sin desbordamiento horizontal.

La foto de Juan Coronado se vinculó en Foto (P10) y se comprobó en la página normal del navegador del usuario, a 800 × 800 píxeles. Foto usa el tipo Texto, porque las fichas de archivo perdían su URL en la consulta pública. Esta corrección conserva la presentación visual y las propiedades de las otras columnas de la hoja.

Los registros originales del respaldo no se modificaron. El modelo añadió el campo opcional LinkedIn; el SHA-256 actual del archivo es `742FD186EC05FCEF8028EDC22768D172D1B45A4659343320580DD696A9749F5C`. El fondo original mantiene su hash.

Lighthouse de la revisión visual anterior: accesibilidad 100 y buenas prácticas 100 en escritorio y móvil; SEO 92 y navegación para agentes 67. Los dos avisos corresponden a `robots.txt` y `llms.txt`: el servidor de vista previa devuelve el HTML de la página para esas rutas ausentes. No se añaden archivos únicamente para alterar la puntuación local.

Traza de la revisión visual anterior: LCP observado de 117 ms y CLS 0, sin limitación de CPU ni red. Esta medición no representa visitas en GitHub Pages ni conexiones móviles. No hay datos de usuarios reales.

Vista de avance: `http://127.0.0.1:5173/`. La página todavía no está publicada.
