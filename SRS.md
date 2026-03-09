# Software Requirements Specification (SRS) - Mythera Map App

## 1. Introducción
**Propósito:** Este documento especifica los requisitos de software para la aplicación frontend **Mythera Map App**, desarrollada en Angular 19.
**Alcance:** La aplicación proporciona una interfaz interactiva de un mapa de fantasía personalizado, permitiendo a los usuarios visualizar, crear y editar marcadores geográficos, así como consultar una enciclopedia (Wiki) detallada del mundo (Lore).

## 2. Descripción General
**Perspectiva del Producto:** Mythera Map App es el cliente web que interactuye con la API RESTful (Mythera Map API) para gestionar los datos. Emplea la librería Leaflet para la renderización interactiva del mapa sobre una imagen estática personalizada de gran resolución.
**Funciones del Producto:**
- Visualización interactiva del mundo (Zoom y arrastre).
- Visualización de lugares dependiente del nivel de zoom.
- Creación, visualización y gestión de puntos de interés en el mapa.
- Wiki navegable con información de lore (rasas, arcos narrativos, etc.).

## 3. Requisitos Funcionales

### 3.1. Módulo de Mapa Interactivo
- **FR1.1 Renderizado del Mapa:** El sistema debe cargar una imagen en alta resolución del mapa de Mythera usando Leaflet con soporte para zoom (min: -5, max: 3.5).
- **FR1.2 Gestión de Capas por Zoom:** El sistema debe mostrar diferentes categorías de lugares dependiendo del nivel de zoom:
  - Continentes (< -1.3 zoom)
  - Regiones (-1.3 a -0.3 zoom)
  - Ciudades y Lugares Específicos (>= -0.3 zoom)
- **FR1.3 Iconografía Distintiva:** Los marcadores deben usar íconos diferentes basados en el tipo de lugar y su relevancia (Small/Medium/Big - Common/Elite/Epic).

### 3.2. Gestión de Lugares (Places)
- **FR2.1 Creación de Marcadores:** El usuario debe poder seleccionar el tipo y tamaño del marcador y hacer clic en el mapa para crearlo.
- **FR2.2 Visualización de Detalles (City Dialog):** Al hacer clic en un marcador, el sistema debe abrir un modal (`CityDialogComponent`) con la información detallada del lugar.
- **FR2.3 Gestión de Contenido del Lugar:** El usuario puede visualizar y editar la información específica de un lugar, la cual incluye:
  - Descripción y HTML personalizado de la historia.
  - Criaturas y criaturas legendarias que habitan la zona.
  - Objetos destacados.
  - Composición de ejércitos / tropas.
  - Lugares de interés internos.
  - NPCs asociados (incluyendo sus imágenes, personalidad y descripciones).

### 3.3. Módulo de Wiki (Lore)
- **FR3.1 Navegación:** El sistema debe proveer de un sistema de navegación / sidebar para acceder al lore.
- **FR3.2 Arcos Narrativos:** Debe listar y detallar los arcos narrativos incluyendo sesiones (Campaña, Quest, Oneshot, Bishot), jugadores y resúmenes.
- **FR3.3 Enciclopedia:** Secciones estáticas/dinámicas para: Línea Temporal, Dioses, Eternos, Humanos, Elfos, Enanos, Gnomos, Medianos, Orcos, Razas Únicas, Personajes, Organizaciones y Eventos Históricos.

## 4. Requisitos No Funcionales (Atributos de Calidad)
- **NFR.1 Desempeño:** La carga inicial del mapa y los marcadores no debe bloquear la interfaz de usuario.
- **NFR.2 Usabilidad:** Las transiciones de apertura de diálogos y filtrado de capas deben ser suaves y responsivas.
- **NFR.3 Tecnologías:** Angular 19, Leaflet, Angular Material, RxJS, SASS.

## 5. Interfaces de Usuario
- Pantalla principal: Lienzo ocupando todo el ancho y alto con el mapa interactivo y barra de herramientas emergente para creación.
- Modales: Diálogos de Material (`MatDialog`) para detalles del lugar ("City Dialog").
- Pantalla de Wiki: Layout con sidebar y área de contenido.
