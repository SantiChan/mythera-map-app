import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ToolboxComponent } from '../../shared/components/toolbox/toolbox.component';
import { MatDialog } from '@angular/material/dialog';
import mapboxgl from '../../shared/mapbox/mapbox-init';
import { CityDialogComponent } from '../../shared/components/city-dialog/city-dialog.component';
import { MarkerIconInterface } from '../../shared/interfaces/icons/marker-icon.interface';
import { MarkerIconsSize } from '../../shared/enums/icons/marker-icons.enum';
import { CreateMarkerToolbarComponent } from '../../shared/components/create-marker-toolbar/create-marker-toolbar.component';
import { CommonModule } from '@angular/common';
import { MarkerService } from '../../shared/services/marker.service';
import { PlaceService } from '../../shared/services/places.service';
import { ICON_SIZE } from '../../shared/components/constants/icon-size.constants';

const imgWidth = 10204;
const imgHeight = 7544;

const virtualHeight = 170; // latitud total
const aspectRatio = imgWidth / imgHeight;
const virtualWidth = virtualHeight * aspectRatio;

const minLat = -85;
const maxLat = 85;
const minLng = -virtualWidth / 2;
const maxLng = virtualWidth / 2;

const lngPerPixel = (maxLng - minLng) / imgWidth;
const latPerPixel = (maxLat - minLat) / imgHeight;

@Component({
  selector: 'app-mapbox',
  standalone: true,
  imports: [CommonModule, ToolboxComponent, CreateMarkerToolbarComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapBoxComponent implements OnInit, AfterViewInit {
  map!: mapboxgl.Map;
  markers: mapboxgl.Marker[] = [];
  selectedPlacement: MarkerIconInterface | null = null;
  isCreating: boolean = false;

  constructor(
    private dialog: MatDialog,
    private markerService: MarkerService,
    private _placesService: PlaceService
  ) { }

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: {
        version: 8,
        sources: {},
        layers: []
      },
      center: [0, 0],
      zoom: 0,
      minZoom: 0,
      maxZoom: 5,
      renderWorldCopies: false,
      maxBounds: [[minLng, minLat], [maxLng, maxLat]]
    });

    this.markerService.selectedMarker$.subscribe(marker => {
      if (marker) this._startPlacementMode(marker);
    });

    this.markerService.saveMarker$.subscribe(marker => {
      if (marker) this._addMarkerToMap(marker);
    });

    this._placesService.getPlaces().subscribe({
      next: (places) => {
        places.forEach((place: any) => this._addMarkerToMap(place));
      },
      error: (error) => {
        console.error('Error al obtener los lugares', error);
      }
    });
  }

  ngAfterViewInit(): void {
    const imgWidth = 10204;
    const imgHeight = 7544;

    // Proyección totalmente ficticia, coordenadas planas simuladas en Mapbox
    const top = 0;
    const bottom = imgHeight;
    const left = 0;
    const right = imgWidth;

    this.map = new mapboxgl.Map({
      container: 'map',
      style: {
        version: 8,
        sources: {},
        layers: []
      },
      center: [(left + right) / 2, (top + bottom) / 2], // centro exacto
      zoom: 0,
      minZoom: 0,
      maxZoom: 5,
      renderWorldCopies: false,
      maxBounds: [[left, top], [right, bottom]]
    });

    this.map.on('load', () => {
      this.map.addSource('mapBackground', {
        type: 'image',
        url: 'assets/imgs/map/mythera-map-new.png',
        coordinates: [
          [left, top],         // top-left
          [right, top],        // top-right
          [right, bottom],     // bottom-right
          [left, bottom]       // bottom-left
        ]
      });

      this.map.addLayer({
        id: 'mapBackgroundLayer',
        source: 'mapBackground',
        type: 'raster',
        paint: { 'raster-opacity': 1 }
      });

      this.map.setCenter([(left + right) / 2, (top + bottom) / 2]);
      this.map.setZoom(2.84); // ⬅️ Ajusta para lograr escala "real"
      this.map.dragRotate.disable();
      this.map.touchZoomRotate.disable();
    });

    setTimeout(() => this.map.resize(), 100);
  }

  private _addMarkerToMap(place: any): void {
    const { x, y, name, iconName } = place;
    const [lng, lat] = this.imageXYToLngLat(x, y);

    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';

    const iconImg = document.createElement('img');
    iconImg.src = iconName;

    const size = this._resolveIconSize();
    iconImg.style.width = `${size}px`;
    iconImg.style.height = `${size}px`;
    iconImg.style.objectFit = 'contain';

    const nameLabel = document.createElement('div');
    nameLabel.innerText = name;
    nameLabel.className = 'marker-label';

    markerElement.appendChild(iconImg);
    markerElement.appendChild(nameLabel);

    markerElement.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dialog.open(CityDialogComponent, {
        data: { placeData: place, viewMode: true }
      });
    });

    const marker = new mapboxgl.Marker({
      element: markerElement,
      anchor: 'bottom'
    }).setLngLat([lng, lat])
      .addTo(this.map);

    this.markers.push(marker);
  }

  private _placeIconOnMap(lngLat: mapboxgl.LngLat) {
    if (!this.selectedPlacement) return;

    const markerElement = document.createElement('img');
    markerElement.src = this.selectedPlacement.icon;

    const size = this._resolveIconSize();
    markerElement.style.width = `${size}px`;
    markerElement.style.height = `${size}px`;
    markerElement.style.objectFit = 'contain';

    const [x, y] = this.lngLatToImageXY(lngLat.lng, lngLat.lat);

    this.dialog.open(CityDialogComponent, {
      width: '400px',
      data: {
        x,
        y,
        marker: markerElement,
        icon: {
          name: this.selectedPlacement.icon,
          size: this.selectedPlacement.size
        }
      }
    });

    this.isCreating = false;
    this.selectedPlacement = null;
  }

  private _resolveIconSize(): number {
    switch (this.selectedPlacement?.size) {
      case MarkerIconsSize.Small: return ICON_SIZE.small;
      case MarkerIconsSize.Medium: return ICON_SIZE.medium;
      case MarkerIconsSize.Big:
      default: return ICON_SIZE.big;
    }
  }

  private _startPlacementMode(marker: MarkerIconInterface) {
    if (!marker) return;
    this.selectedPlacement = marker;
    this.isCreating = true;
    this.map.setZoom(4);
  }

  handlePlacementSelected(data: MarkerIconInterface) {
    this.selectedPlacement = data;
  }

  onAddPlacementMode(): void {
    this.map.getCanvas().style.cursor = `url(${this.selectedPlacement?.icon}) 25 25, auto`;
    this.map.once('click', (event) => {
      this._placeIconOnMap(event.lngLat);
      this.map.getCanvas().style.cursor = '';
      this.isCreating = false;
      this.markerService.clearSelectedMarker();
    });
  }

  onCancelPlacementMode() {
    this.isCreating = false;
    this.selectedPlacement = null;
  }

  private imageXYToLngLat(x: number, y: number): [number, number] {
    const lng = minLng + x * lngPerPixel;
    const lat = maxLat - y * latPerPixel;
    return [lng, lat];
  }

  private lngLatToImageXY(lng: number, lat: number): [number, number] {
    const x = (lng - minLng) / lngPerPixel;
    const y = (maxLat - lat) / latPerPixel;
    return [x, y];
  }
}
