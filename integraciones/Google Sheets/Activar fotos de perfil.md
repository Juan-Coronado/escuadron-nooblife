# Activar las fotos de las celdas

La web ya contiene la conexión y el servicio está guardado en el proyecto [Escuadrón Nooblife Fotos](https://script.google.com/u/0/home/projects/1qcMLTBK5YgwUd5ticX-01fd-vbkVbj1q9Go18JAWmpCKnrjyHvo3_1PR/edit). Falta completar la autorización y obtener la URL de la implementación.

## Activación inicial

Para esta rama, seguir primero [Mover la conexión al backend](<Mover la conexion al backend.md>): configurar `idDeLaHoja` e `idDeLaPestana` en las propiedades privadas del script, activar el servicio y restringir la hoja original. Las imágenes insertadas son opcionales; el mismo backend sirve los enlaces HTTPS de Drive.

1. Abrir el proyecto indicado, vinculado a la hoja de presentaciones. Antes de implementarlo, reemplazar el contenido de Código.gs con la versión actual de `Fotos y presentaciones.gs` de esta carpeta; incluye la columna Link de linkedin (Q).
2. En **Implementar → Nueva implementación**, elegir **Aplicación web**.
3. Configurar **Ejecutar como: Yo** y **Quién tiene acceso: Cualquier usuario**, para permitir la lectura desde localhost y GitHub Pages.
4. Implementar y revisar la autorización de Google. El servicio utiliza SpreadsheetApp para leer la hoja y obtener imágenes de celdas; Google determina los permisos solicitados. El código no escribe en la hoja ni usa otros documentos. No se deben añadir servicios o permisos adicionales.
5. Copiar la URL de aplicación web que termina en `/exec`.
6. Introducirla como `servicioDeFotos` en `public/Configuracion de datos.json` y recargar localhost. Para la publicación futura, este archivo debe incluirse en la compilación de Pages.

La dirección no contiene una contraseña ni un token de cuenta. El servicio devuelve solo los once campos elegidos para la web, incluido LinkedIn. No hay parámetros que permitan seleccionar otro archivo o exportar otras columnas. La activación permanece pendiente hasta que el responsable tenga el acceso y complete la autorización.

## Cómo poner cada retrato

En la columna **Foto** (P), seleccionar la celda de la persona y usar **Insertar → Imagen → Imagen en la celda**. Cada fila une nombre, datos e imagen en una sola respuesta. Una foto flotante sobre las celdas no es un valor `CellImage` y no se recoge.

La web consulta al entrar, cada minuto mientras está visible y al volver a la pestaña. Los enlaces de las imágenes caducan; el servicio obtiene uno nuevo en cada consulta, sin guardarlos permanentemente. Reemplazar una imagen cambia el retrato de la misma persona; borrar la celda devuelve las iniciales. Un fallo de carga también muestra iniciales.

## Comprobación después de activar

Abrir la URL `/exec` y comprobar que aparece `version: 1`, `estado: "ok"` y los registros. Después, insertar una foto real en la fila correspondiente y comprobar su retrato en la galería y al abrir «Ver perfil». Cambiar la foto y esperar a la siguiente consulta. Si falla la conexión, la web conserva la última información válida y muestra el aviso.

Las pruebas locales verifican el contrato y la carga con respuestas simuladas; la autorización, redirecciones y fotos reales se deben verificar después de implementar el servicio en Google.

Documentación: [CellImage y enlaces temporales](https://developers.google.com/apps-script/reference/spreadsheet/cell-image), [implementar aplicaciones web](https://developers.google.com/apps-script/guides/web) y [autorización de Apps Script](https://developers.google.com/apps-script/guides/services/authorization).
