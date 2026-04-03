# Eternals - App Context

## 📖 Estructura de Interfaz
Esta página muestra la galería de **Eternos (Eternals)** de la enciclopedia (Wiki). 

- **Página Principal**: `eternals-list.component` presenta todas estas entidades (probablemente en un grid o lista).
- **Gestión (CRUD)**: Los eternos se añaden o modifican a través de modales dentro de la carpeta `modals/`. Funciona mediante el paso de `FormData` para poder enviar imágenes (`file`) al backend.

## ⚙️ Notas Funcionales
- Se usa un servicio compartido (`EternalsService`) que hace peticiones HTTP directas a la ruta `/eternals` de la API.
- Todo formulario que suba datos debe construir su payload en un `FormData` y no mediante JSON clásico para soportar la subida del Portrait/Imagen.
