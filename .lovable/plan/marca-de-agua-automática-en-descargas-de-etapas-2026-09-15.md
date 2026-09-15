# Marca de agua automática en descargas de etapas

## Objetivo
Proteger los archivos descargables de ALPHA, BETA y DELTA con el aviso obligatorio solicitado, sin cambiar la experiencia de acceso a las etapas.

## Cambios
- Reemplazar los enlaces directos a almacenamiento por una descarga controlada que valide nuevamente la clave de la etapa.
- Para casos en PDF, insertar en cada página el texto completo en diagonal, repetido para cubrir la hoja, con 1/3 de opacidad.
- Para bases de datos en formatos de hoja de cálculo compatibles, añadir el mismo aviso visible en diagonal o como marca destacada en cada hoja sin borrar los datos.
- Mantener el nombre y formato original al descargar; si un formato no admite edición segura, entregar una copia acompañada por una página PDF con el aviso, sin modificar el archivo fuente.
- Mostrar un error claro si no se puede preparar la descarga, evitando exponer enlaces públicos directos desde la página.

## Detalles técnicos
- La transformación ocurrirá en el servidor al momento de descargar; los originales del panel administrativo permanecerán intactos.
- La descarga solo aceptará una etapa y tipo de archivo válidos, y verificará la contraseña de esa etapa.
- Se usará una biblioteca compatible con el entorno publicado para modificar PDFs y hojas de cálculo.
- Se comprobarán descargas de ejemplo y el estado de compilación antes de cerrar.
