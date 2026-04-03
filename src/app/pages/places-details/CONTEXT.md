# Places - App Context

## 📖 Estructura de Interfaz
Maneja la visualización de los detalles en profundidad de un punto geográfico de Mythera.

- **Frontend**: Se encuentra mayormente en `src/app/pages/places-details`.
- Funciona como una página completa o panel lateral expansivo cuando un usuario hace clic en un Pin/Marcador del mapa interactivo o viene redirigido desde la Wiki.
- Muestra de forma estructurada el lore anidado proveniente de `PlaceDetails` (Artefactos, NPCs que habitan la zona, Faunos legendarios, Ejércitos).

## ⚙️ Notas Técnicas
- Alta dependencia entre los datos que escupe el Backend y la renderización visual en formato tarjeta de este componente. 
- Debido a que tiene coordenadas (`x`, `y`), interactúa muy de cerca con la funcionalidad de los componentes de mapa (probablemente Leaflet o Mapbox).
