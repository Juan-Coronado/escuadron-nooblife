# Mover la conexión al backend

Esta rama está preparada y probada, pero no está desplegada. El acceso para implementar y autorizar Apps Script sigue pendiente, según confirmó el usuario el 12 de octubre de 2026. No incorporar la rama mientras `servicioDeFotos` esté vacío: la web conservaría el respaldo inicial, pero no actualizaría datos ni fotos.

## Responsabilidades

La web en GitHub Pages consulta una API pública de solo lectura. Apps Script accede a la hoja con la cuenta que implementa el servicio y devuelve los once campos aprobados. Los identificadores de la hoja se configuran en el servidor. La API y los perfiles destinados a mostrarse siguen siendo públicos; la protección de las otras columnas depende de restringir la hoja original.

El servicio no acepta parámetros de consulta, no escribe en la hoja y no permite escoger archivos ni columnas. Los encabezados se validan en el servidor. Un error devuelve únicamente `version: 1, estado: "error"`, sin mensajes internos ni datos de configuración. Un fallo de la API nunca hace que el frontend vuelva a consultar directamente la hoja.

## Activación por una persona con acceso

1. Abrir el proyecto de Apps Script pendiente o un proyecto controlado por el responsable que pueda leer la hoja. Copiar la versión de `Fotos y presentaciones.gs` de esta rama.
2. En **Configuración del proyecto → Propiedades del script**, crear `idDeLaHoja` con el identificador de la hoja de presentaciones y `idDeLaPestana` con `709021814`. No introducir contraseñas ni tokens en el código ni en el repositorio.
3. Implementar como **Aplicación web**, ejecutada con la cuenta del responsable y accesible a **Cualquier usuario**. El responsable completa personalmente la autorización de Google.
4. Abrir la URL `/exec` sin iniciar sesión y verificar `version: 1`, `estado: "ok"`, 17 registros actuales y únicamente nombres, apellidos, apodos, correo, institución, carreras, habilidades, hobbies, metas, foto y LinkedIn. Verificar la foto real de Juan Coronado. No basta con que las pruebas simuladas pasen.
5. El responsable restringe el acceso público de la hoja original, conservando acceso individual de los integrantes que la editan. Si la hoja está publicada en la Web, detener también esa publicación. Este paso afecta a la hoja, no a la carpeta de fotos de Drive, cuyos permisos se conservan.
6. Comprobar que la hoja ya no admite consultas sin autenticación y que la API sigue devolviendo los datos aprobados. No cerrar el acceso antes de comprobar que el responsable del backend puede leerla.
7. Colocar la URL real `/exec` en `public/Configuracion de datos.json`, campo `servicioDeFotos`. Ejecutar `npm run check` y verificar la API real desde el navegador.
8. Incorporar la rama a `main` y comprobar el despliegue en GitHub Pages. Verificar búsqueda, perfiles, LinkedIn y fotos. Cambiar un dato en una fila y comprobar la siguiente actualización; no hace falta desplegar por cada edición de la hoja.

## Qué se ha verificado

La compilación de esta rama no contiene el identificador de Google Sheets ni una dirección gviz. Las pruebas comprueban configuración vacía o inválida, fallo y recuperación de la API sin acceso directo a la hoja, lectura exclusiva de columnas permitidas, configuración privada obligatoria, rechazo de parámetros, renovación de fotos y actualización cada 60 segundos sin perder la búsqueda o el perfil abierto.

La copia original de los campos seleccionados permanece como respaldo inicial en la web. Es contenido público de presentación, no una copia de las columnas privadas de la hoja. Las autorizaciones, los permisos reales y el servicio remoto están pendientes; todavía no se afirma que la hoja esté protegida.

Referencias: [aplicaciones web de Apps Script](https://developers.google.com/apps-script/guides/web), [propiedades del script](https://developers.google.com/apps-script/guides/properties), [publicar o detener la publicación de un archivo](https://support.google.com/docs/answer/183965?hl=es).
