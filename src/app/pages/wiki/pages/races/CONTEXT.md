# Races & Subraces - App Context

## 📖 Estructura de Interfaz y Navegación
Este feature de la Wiki se encarga de mostrar la galería de clanes/razas de Mythera, separando estructuralmente las Razas (Contenedores) de las Subrazas (Entidades con stats específicos).

- **Página Principal (Races Gallery)**: `races-gallery.component`.
  - Lista lateral o grilla de **Razas Principales**.
  - Se puede crear/editar/eliminar mediante modales (`RaceModalComponent`).
  - Al hacer click o visualizar una Raza (botón "Ver Subrazas" o `goToSubraces()`), se navega a las subrazas vinculadas (`/wiki/razas/:raceId`).
  
- **Página de Subrazas (Subraces List)**: `subraces-list.component`.
  - Filtra subrazas mediante el `raceId` obtenido por URL.
  - Al igual que la raza, tiene un CRUD completo mediante `SubraceModalComponent`.
  - Muestra detalles mucho más técnicos: Atributos (`str`, `dex`, etc.), velocidad, tamaño, e idiomas.

## ⚙️ Técnicas y Funcionalidad Destacada
- **Manejo de Formularios con Imágenes**: 
  - Usamos el objeto nativo `FormData` de JavaScript en los componentes al llamar a los servicios. Esto es necesario porque pasamos una imagen (`file`) junto con datos en texto.
  - Ojo: Los arrays y objetos anidados (`passiveTraits`, `stats`) se añaden al `FormData` con `JSON.stringify()`.
  
- **Delete Warning**:
  - Antes de eliminar una Raza Principal, salta un `ConfirmModalComponent` advirtiendo que "Se perderán todas sus subrazas". (La lógica debe estar alineada con el backend).

## 🎨 Componentes y UI
- Totalmente Standalone Components.
- Angular Material: Modales (`MatDialog`), Iconos (`MatIcon`), Snackbar para notificaciones (`SnackbarService`).

---
> ⚠️ **Estado Actual**: Work In Progress. Asegurarse de mantener las relaciones consistentes entre Race y Subrace al modificar visualmente las tarjetas.
