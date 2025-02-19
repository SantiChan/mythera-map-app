import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { ToolboxComponent } from '../../shared/components/toolbox/toolbox.component';
import { MatDialog } from '@angular/material/dialog';
import { CityDialogComponent } from '../../shared/components/city-dialog/city-dialog.component';
import { CastlePopupComponent } from '../../shared/components/castle-popup/castle-popup.component';

type GeoJsonFeature = GeoJSON.Feature<GeoJSON.Point, { id: string; name: string; description: string }>;

@Component({
  selector: 'app-mapbox',
  standalone: true,
  imports: [ToolboxComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapBoxComponent implements OnInit {
  map!: mapboxgl.Map;
  selectedElement: string | null = null;

  // Fuente GeoJSON para almacenar todos los castillos
  castlesGeoJson: GeoJSON.FeatureCollection<GeoJSON.Point, { id: string; name: string; description: string }> = {
    type: 'FeatureCollection',
    features: [],
  };

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      accessToken: 'pk.eyJ1IjoibXl0aGVyYSIsImEiOiJjbTVxazdsOWQwMHRyMnNzZ2x6ZGQzYjI4In0.SMa-cXCNebQPsyH46yEKJg',
      container: 'map',
      style: {
        version: 8,
        sources: {},
        layers: [],
      },
      center: [0, 0],
      zoom: 1,
      maxZoom: 20,
    });

    const bounds: mapboxgl.LngLatBoundsLike = [
      [-53.86, -39.82],
      [53.86, 39.82],
    ];
    this.map.setMaxBounds(bounds);

    this.map.on('load', () => {
      this.registerCastleIcon();
      this.loadCustomMap();

      // Crear una fuente y capa inicial para los castillos
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

      // Configurar clics en los castillos para mostrar el popup
      this.map.on('click', 'castles-layer', (e: any) => {
        console.log('Click en castillo detectado');

        const feature = e.features[0];
        const { name, description } = feature.properties;

        // Abrir un dialog de Angular Material con el componente `CastlePopupComponent`
        this.dialog.open(CastlePopupComponent, {
          width: '300px',
          data: { name, description },
          panelClass: 'custom-dialog-container', // Para aplicar estilos específicos
          hasBackdrop: false, // Sin fondo oscuro, para que no cubra el mapa
          position: {
            top: `${e.point.y}px`,
            left: `${e.point.x}px`,
          },
        });
      });

    });

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
    });
  }

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

  updateFloatingImagePosition(event: MouseEvent): void {
    const floatingImage = document.getElementById('floating-castle');
    if (floatingImage) {
      floatingImage.style.left = `${event.pageX + 10}px`;
      floatingImage.style.top = `${event.pageY + 10}px`;
    }
  }

  addCastle(coordinates: mapboxgl.LngLat): void {
    const castleId = `castle-${Date.now()}`;
    const dialogRef = this.dialog.open(CityDialogComponent, {
      width: '400px',
      data: {},
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
    const coordinates: any = [
      [-53.86, 39.82],
      [53.86, 39.82],
      [53.86, -39.82],
      [-53.86, -39.82],
    ];

    this.map.addSource('custom-image', {
      type: 'image',
      url: 'assets/imgs/mytheraMap.png',
      coordinates: coordinates,
    });

    this.map.addLayer({
      id: 'custom-image-layer',
      type: 'raster',
      source: 'custom-image',
    });

    const bounds: any = [coordinates[0], coordinates[2]];
    this.map.fitBounds(bounds, { padding: 0 });

    this.map.on('resize', () => {
      this.map.fitBounds(bounds, { padding: 0 });
    });
  }
}
