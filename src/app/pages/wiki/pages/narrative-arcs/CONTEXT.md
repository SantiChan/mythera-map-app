# Narrative Arcs - App Context

## 📖 Estructura de Interfaz
Almacena y permite leer los "logs" o historias de las partidas de rol jugadas en Mythera.

- **Paginación/Listado**: `narrative-arcs-list.component`.
- **Detalle Activo**: `narrative-arc-detail.component`.
- **Modales (CRUD)**: Esta es una de las pantallas de formulario más complejas del proyecto. El modal debe permitir añadir dinámicamente *Sesiones*, y dentro de las sesiones, *Jugadores* y *Contenidos*, usando form arrays de Angular (`FormArray`).

## ⚙️ Notas Técnicas
- El componente `narrative-arc-detail` maneja vistas ricas en texto enriquecido dado que la API emite el HTML generado (`descriptionHtml`).
- Asegurarse de mantener la reactividad Angular limpia al manipular arrays y objetos tan profundos en la interfaz (Signals son ideales aquí).
