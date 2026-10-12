# Fotos de perfil con Drive

La carpeta elegida es [Fotos para la pagina](https://drive.google.com/drive/folders/1v7VDKo9V07IS5b6L9JYMrk-4V2fQPzyq). Cada persona puede organizar sus fotos en una subcarpeta con su nombre. La asociación en la web la determina la fila de la hoja, no el nombre del archivo ni de la carpeta.

## Subir o cambiar una foto

1. Abrir la carpeta con una cuenta de Google que tenga permiso para subir archivos.
2. Subir una foto JPG, PNG o WebP dentro de la subcarpeta correspondiente.
3. Abrir **Compartir** en el archivo de imagen y comprobar que pueda leerse con **Cualquier persona con el enlace → Lector**. La web no inicia sesión en Google.
4. Copiar el enlace del **archivo**, por ejemplo `https://drive.google.com/file/d/IDENTIFICADOR/view`, y pegarlo como texto en **Foto (P)** de la fila de esa persona. La columna está configurada como **Texto**. No convertir el enlace en una ficha de archivo: la consulta pública recibe el nombre de esas fichas en lugar de su URL. No pegar la dirección de la carpeta ni insertar la imagen en la celda.
5. Abrir la web: la misma foto aparecerá en la galería y en «Ver perfil». La hoja se consulta al entrar y cada 60 segundos mientras la página está visible. Google puede añadir una demora a su respuesta.

Para cambiar de foto y mantener un archivo de las anteriores, subir otra imagen sin borrar la anterior y reemplazar la URL de la celda. Vaciar Foto retira el retrato y muestra las iniciales. Un cambio en el contenido de un mismo archivo de Drive puede tardar en verse por la caché de Google; usar otro archivo y otra URL evita esa ambigüedad.

## Preparación de la web

`src/datos/Foto de persona.ts` convierte los enlaces públicos de archivos de Drive a su dirección de imagen con un ancho de hasta 800 píxeles. Conserva `resourcekey` cuando el enlace lo incluye. Admite enlaces `/file/d/...`, `/open?id=...` y `/uc?id=...`; rechaza las direcciones de carpetas. Las URLs HTTPS de imágenes y las rutas locales `images/` siguen disponibles.

La vista pública de imagen de Drive se comprobó en un navegador sin sesión con la foto existente dentro de Juan Coronado. Es una integración con la vista pública de Drive, no una garantía de disponibilidad de un servicio dedicado a imágenes: si el archivo se vuelve privado, se elimina o deja de responder como imagen, el retrato conserva las iniciales. No se almacenan enlaces temporales de `thumbnailLink` de la API.

En esta rama los enlaces de Foto se obtienen de la API del backend. Requiere completar la activación descrita en [Mover la conexión al backend](<Mover la conexion al backend.md>), pendiente de acceso de Google. No recorre carpetas ni elige una foto entre varias. El responsable de la fila elige la imagen al pegar su enlace; la migración no cambia cómo se suben las fotos ni los permisos de Drive.

## Estado verificado el 11 de octubre de 2026

- La carpeta contiene una subcarpeta **Juan Coronado** con una imagen JPG.
- [Enlace de ese archivo](https://drive.google.com/file/d/19BhBHDCgtPDL22lLDewt43QGU1sh-Obi/view?usp=drivesdk), listo para copiar en Foto de Juan Coronado.
- Con autorización del usuario, se vinculó el enlace de la imagen de Juan Coronado en **P10** de `Hoja_de_Tarjetas`. Las otras 16 celdas Foto siguen vacías.
- La columna Foto tenía tipo **Ficha de archivo**. La consulta pública exportaba el nombre del archivo, sin su URL; se cambió únicamente ese tipo a **Texto** para que la web reciba el enlace. Se conservaron las propiedades de las otras columnas y el rango de la tabla.
- La imagen real de Juan cargó a 800 × 800 píxeles en la página normal del navegador del usuario, con la galería y el perfil usando los datos reales de la hoja. No depende de una respuesta temporal de prueba.
- La carpeta tiene permiso de edición para cualquiera con el enlace. Por decisión del usuario, se conservan esos permisos para que los integrantes puedan subir sus fotos mediante el enlace del grupo.

No se modificó la autorización ni la implementación de Apps Script que quedó pendiente.
