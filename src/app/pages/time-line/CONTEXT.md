# Time-Line - App Context (Standalone Page)

## 📖 Dominio y Funcionalidad
Esta página (`time-line.component.ts`) es una vista dedicada e independiente de la cronología de Mythera. A diferencia de la versión de la Wiki, esta vista parece tener un enfoque de "Landing Page" narrativa o presentación épica.

## ⚙️ Notas Técnicas y Quirks
- **Datos Hardcodeados (Mock)**: Actualmente, la lista de eventos (`timelineEvents`) está completamente *hardcodeada* dentro del componente en lugar de provenir de la API. Tiene campos de visibilidad (`visible`) y booleanos clasificatorios (`isAge`).
- **Intersection Observer**: Utiliza una API nativa del navegador (`IntersectionObserver`) sobre elementos DOM (`@ViewChildren('timelineItem')`) para detectar cuándo un evento entra en la pantalla durante el *scroll*. Al entrar en la vista (`threshold: 0.3`), marca el evento correspondiente como `visible = true`, lo que probablemente desata una animación CSS (fade in/reveal).

## ⚠️ Estado de Desarrollo
- **WIP (Work In Progress)**: La cantidad de texto duplicado de prueba ("Mythera - La Comunión (500 ER)...") sugiere que es una plantilla o diseño en pruebas. Eventualmente, si se requiere unir a los esquemas de la API (`timeline-era` y `timeline-event`), su lógica de servicio tendría que reemplazar los mocks conservando la lógica del `IntersectionObserver`.
