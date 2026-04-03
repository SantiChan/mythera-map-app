# Gods - App Context

## 📖 Estructura de Interfaz
La galería de **Dioses (Gods)** muestra información sobre las deidades de la campaña o el lore del juego.

- **Frontend**: Usa `gods-list.component`. Un diseño enfocado probablemente a tarjetas/cards donde se expone el Nombre, Apodo y su Dominio principal.
- **Creación / Edición**: Utiliza `GodModalComponent` (en `modals/`). Requiere el uso de un formulario que prepare un `FormData`.
- **Arrays en el Front**: El campo `prayers` son múltiples strings. El frontend debe asegurarse de enviar este `Array` correctamente serializado (o `JSON.stringify()`) o separado por tokens para que la API usando `multer` lo interprete bien.
