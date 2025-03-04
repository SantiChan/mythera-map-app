import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ToolboxComponent } from '../../shared/components/toolbox/toolbox.component';
import { MatDialog } from '@angular/material/dialog';
import { CityDialogComponent } from '../../shared/components/city-dialog/city-dialog.component';
import { CastlePopupComponent } from '../../shared/components/castle-popup/castle-popup.component';
import  mapboxgl from '../../shared/mapbox/mapbox-init';
import { RouterModule } from '@angular/router';

type GeoJsonFeature = GeoJSON.Feature<GeoJSON.Point, { id: string; name: string; description: string }>;

@Component({
  selector: 'app-mapbox',
  standalone: true,
  imports: [
  ],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapBoxComponent implements OnInit, AfterViewInit {
  map!: mapboxgl.Map;
  selectedElement: string | null = null;

  castlesGeoJson: GeoJSON.FeatureCollection<GeoJSON.Point, { id: string; name: string; description: string }> = {
    type: 'FeatureCollection',
    features: [],
  };

  private _coordinates: [[number, number], [number, number], [number, number], [number, number]] = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: {
        version: 8,
        sources: {},
        layers: [],
      },
      center: [0, 0],
      zoom: 1,
      maxZoom: 10,
      renderWorldCopies: false
    });

    /*
    // Define unos límites para el mapa (ejemplo)
    const bounds: mapboxgl.LngLatBoundsLike = [
      [-53.86, -39.82],
      [53.86, 39.82],
    ];
    this.map.setMaxBounds(bounds);

    // Cuando se redimensiona la ventana, recalculamos el layout de la imagen
    this.map.on('resize', () => {
      this.loadCustomMap();
    });

    this.map.on('load', () => {
      this.registerCastleIcon();
      this.loadCustomMap();

      // Agregar fuente y capa para los castillos
      this.map.addSource('castles', {
        type: 'geojson',
        data: this.castlesGeoJson,
      });

      this.map.addLayer({
        id: 'castles-layer',
        type: 'symbol',
        source: 'castles',
        layout: {
          'icon-image': 'castle-icon',
          'icon-size': 0.25,
        },
      });

      // Clic en un castillo para mostrar popup
      this.map.on('click', 'castles-layer', (e: any) => {
        const feature = e.features[0];
        const { name, description } = feature.properties;
        this.dialog.open(CastlePopupComponent, {
          width: '300px',
          data: { name, description },
          panelClass: 'custom-dialog-container',
          hasBackdrop: false,
          position: {
            top: `${e.point.y}px`,
            left: `${e.point.x}px`,
          },
        });
      });

      window.addEventListener('resize', () => this.map.resize());
    });

    // Manejador para agregar un castillo al hacer clic en el mapa
    this.map.on('click', (event) => {
      if (this.selectedElement === 'castle') {
        this.addCastle(event.lngLat);
        this.selectedElement = null;
        const floatingImage = document.getElementById('floating-castle');
        if (floatingImage) {
          floatingImage.remove();
        }
        document.removeEventListener('mousemove', this.updateFloatingImagePosition);
      }
    });*/
  }
  ngAfterViewInit(): void {
    this.map.on('load', () => {
      this.map.addSource('mapBackground', {
        type: 'image',
        url: 'assets/imgs/map/mythera-map.png',
        coordinates: [
          [-180, 85],  
          [180, 85],   
          [180, -85],  
          [-180, -85]
        ]
      });

      this.map.addLayer({
        id: 'mapBackgroundLayer',
        source: 'mapBackground',
        type: 'raster',
        paint: {
          'raster-opacity': 1
        }
      });

      this.map.fitBounds([
        [-180, -85],
        [180, 85]
      ], { padding: 0 });
    });

    setTimeout(() => {
      this.map.resize();
    }, 100);
  }
/*
  registerCastleIcon(): void {
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext('2d');
      context?.drawImage(img, 0, 0);
      const imageBitmap = await createImageBitmap(canvas);
      this.map.addImage('castle-icon', imageBitmap);
    };
    img.src = 'assets/imgs/castle-icon.svg';
  }

  handleElementSelection(element: string): void {
    this.selectedElement = element;
    document.body.style.cursor = 'url(assets/imgs/castle-icon.svg), auto';

    const floatingImage = document.createElement('img');
    floatingImage.src = 'assets/imgs/castle-icon.svg';
    floatingImage.style.position = 'absolute';
    floatingImage.style.pointerEvents = 'none';
    floatingImage.style.zIndex = '1000';
    floatingImage.style.width = '40px';
    floatingImage.style.height = '40px';
    floatingImage.id = 'floating-castle';
    document.body.appendChild(floatingImage);

    document.addEventListener('mousemove', this.updateFloatingImagePosition);
  }

  // Utilizamos una arrow function para mantener el contexto de 'this'
  updateFloatingImagePosition = (event: MouseEvent): void => {
    const floatingImage = document.getElementById('floating-castle');
    if (floatingImage) {
      floatingImage.style.left = `${event.pageX + 10}px`;
      floatingImage.style.top = `${event.pageY + 10}px`;
    }
  };

  addCastle(coordinates: mapboxgl.LngLat): void {
    const castleId = `castle-${Date.now()}`;
    const dialogRef = this.dialog.open(CityDialogComponent, {
      width: '400px',
      data: { lat: coordinates.lat, lng: coordinates.lng },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      const newFeature: GeoJsonFeature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [coordinates.lng, coordinates.lat],
        },
        properties: {
          id: castleId,
          name: result.name,
          description: result.description,
        },
      };

      this.castlesGeoJson.features.push(newFeature);
      const source = this.map.getSource('castles') as mapboxgl.GeoJSONSource;
      source.setData(this.castlesGeoJson);
    });
  }

  loadCustomMap(): void {
    const img = new Image();
    img.src = 'assets/imgs/mytheraMap.png';
    img.onload = () => {
      // Obtener el aspect ratio de la imagen
      const imgAspect = img.naturalWidth / img.naturalHeight;
      // Obtener dimensiones del contenedor del mapa
      const container = this.map.getContainer();
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const containerAspect = containerWidth / containerHeight;

      // Calcular dimensiones virtuales para ajustar la imagen al contenedor
      let virtualWidth: number, virtualHeight: number;
      if (containerAspect >= imgAspect) {
        // Si el contenedor es más ancha, ajustamos al ancho
        virtualWidth = containerWidth;
        virtualHeight = containerWidth / imgAspect;
      } else {
        // Si el contenedor es más alto, ajustamos al alto
        virtualHeight = containerHeight;
        virtualWidth = containerHeight * imgAspect;
      }

      // Definir las 4 esquinas de la imagen (sistema virtual, (0,0) en la esquina inferior izquierda)
      const coordinates: [[number, number], [number, number], [number, number], [number, number]] = [
        [0, virtualHeight],             // esquina superior izquierda
        [virtualWidth, virtualHeight],    // esquina superior derecha
        [virtualWidth, 0],                // esquina inferior derecha
        [0, 0]                          // esquina inferior izquierda
      ];
      this._coordinates = coordinates;

      // Si la fuente ya existe, la removemos para actualizar
      if (this.map.getSource('custom-image')) {
        if (this.map.getLayer('custom-image-layer')) {
          this.map.removeLayer('custom-image-layer');
        }
        this.map.removeSource('custom-image');
      }

      // Agregar el source de la imagen con las coordenadas virtuales
      this.map.addSource('custom-image', {
        type: 'image',
        url: 'assets/imgs/mytheraMap.png',
        coordinates: coordinates,
      });

      // Agregar la capa raster para mostrar la imagen
      if (!this.map.getLayer('custom-image-layer')) {
        this.map.addLayer({
          id: 'custom-image-layer',
          type: 'raster',
          source: 'custom-image',
          paint: { 'raster-opacity': 1 },
        });
      }

      // Ajustar la vista para que la imagen se muestre completa
      const bounds: mapboxgl.LngLatBoundsLike = [coordinates[3], coordinates[1]];
      this.map.fitBounds(bounds, { padding: 0 });
    };
  }*/
}
