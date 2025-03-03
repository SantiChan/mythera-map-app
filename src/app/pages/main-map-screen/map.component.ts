import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ToolboxComponent } from '../../shared/components/toolbox/toolbox.component';
import { MatDialog } from '@angular/material/dialog';
import  mapboxgl from '../../shared/mapbox/mapbox-init';
import { CityDialogComponent } from '../../shared/components/city-dialog/city-dialog.component';

type GeoJsonFeature = GeoJSON.Feature<GeoJSON.Point, { id: string; name: string; description: string }>;

@Component({
  selector: 'app-mapbox',
  standalone: true,
  imports: [ToolboxComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapBoxComponent implements OnInit, AfterViewInit {
  map!: mapboxgl.Map;
  selectedPlacement: { size: string; icon: string } | null = null;
  // Array para guardar los datos de los marcadores (imagenes)
  placedMarkers: Array<{ lng: number; lat: number; size: string; icon: string }> = [];

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

    //TODO: Revisar evento
    this.map.on('click', (event) => {
      if (this.selectedPlacement) {
        this.placeIconOnMap(event.lngLat);
      }
    });

    setTimeout(() => {
      this.map.resize();
    }, 100);
  }

  // Método que recibe el evento del toolbox
  handlePlacementSelected(data: { size: string; icon: string }) {
    console.log('Recibido en MapBox:', data);
    // Guardamos la selección para colocarla en el siguiente clic en el mapa
    this.selectedPlacement = data;
  }

  placeIconOnMap(lngLat: mapboxgl.LngLat) {
    if (!this.selectedPlacement) return;
    const markerElement = document.createElement('img');
    markerElement.src = this.selectedPlacement?.icon ?? '';
    // Ajustar el tamaño según selectedPlacement.size
    if (this.selectedPlacement?.size === 'pequeno') {
      markerElement.style.width = '50px';
      markerElement.style.height = '50px';
    } else if (this.selectedPlacement?.size === 'mediano') {
      markerElement.style.width = '75px';
      markerElement.style.height = '75px';
    } else {
      markerElement.style.width = '100px';
      markerElement.style.height = '100px';
    }

    // Crear Marker de Mapbox
    new mapboxgl.Marker({ element: markerElement })
      .setLngLat(lngLat)
      .addTo(this.map);

      // Abre el diálogo CityDialogComponent para ingresar la información del lugar.
      // Se le pasan las coordenadas para que se puedan guardar.
      const dialogRef = this.dialog.open(CityDialogComponent, {
        width: '400px',
        data: { lat: lngLat.lat, lng: lngLat.lng }
      });

      this.placedMarkers.push({
        lng: lngLat.lng,
        lat: lngLat.lat,
        size: this.selectedPlacement.size,
        icon: this.selectedPlacement.icon,
      });
      console.log('Marcadores colocados:', this.placedMarkers);

    // Si deseas permitir sólo un placement, puedes resetear selectedPlacement
    this.selectedPlacement = null;
  }
}
