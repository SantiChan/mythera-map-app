# Map - App Context

## 📖 Dominio y Funcionalidad
El **Mapa Interactivo (Map)** es el núcleo geográfico de la aplicación y sirve como el visor interactivo de Mythera. 

Permite renderizar un mapa personalizado, moverse por él (pan & zoom), y situar **Marcadores (Places)** que se dividen por capas de visibilidad según el nivel de zoom y por tipo de tamaño.

## ⚙️ Técnicas y Quirks principales (`map.component.ts`)

- **Leaflet (`L`)**: Motor principal del mapa.
- **LCRS Simple**: El mapa no usa coordenadas geográficas reales (Lat/Lng del mundo real), utiliza un `L.CRS.Simple` que mapea un sistema de coordenadas plano pixel a pixel basado en las dimensiones originarias de la imagen `mythera-map-new.png` (10204 x 7544 píxeles).
- **Gestión de Capas (Layers)**:
  Existen 4 `L.layerGroup` que se muestran u ocultan dependiendo del zoom usando el evento `zoomend`:
  - `_continentLayer` (se ve de lejos)
  - `_regionLayer`
  - `_cityLayer`
  - `_placeLayer` (se ve de cerca)
- **Creación de Marcadores (Placement Mode)**: 
  Suscrito a eventos reactivos (`MarkerService.selectedMarker$`). Al activarse `isCreating = true`, hace que el siguiente clic en el canvas del mapa (`_handleMapClick`) abra un `CityDialogComponent` pasándole las coordenadas `x, y` clicadas de forma precisa.
- **Sincronización de Datos**: Llama a `PlaceService.getPlaces()` para pintar automáticamente todos los iconos de base de datos nada más inicializar la vista del marco delimitado (`minZoom` automático calculado dinámicamente).
