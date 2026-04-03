# Timeline - API & App Context

## 📖 Domain Logic & Lore
La **Línea Temporal (Timeline)** documenta la historia completa de Mythera dividida en **Eras (TimelineEra)** y **Eventos (TimelineEvent)**.

## 🗄️ Backend Esquemas (`timeline-era.schema.ts` & `timeline-event.schema.ts`)
- **Era**: Periodo de tiempo principal (`name`, `description`).
- **Evento**: Un hito histórico (`title`, `description`, `year`, `eraId`). Relación 1:N hacia la Era.

## 💻 Frontend UI
- `wiki-timeline.component`: El componente probablemente lee todas las Eras y dentro de cada una plotea sus Eventos, dibujando visualmente una línea de tiempo para el usuario.
- Operaciones CRUD sencillas, generalmente gestionadas mediante Modales y llamadas HTTP limpias.
