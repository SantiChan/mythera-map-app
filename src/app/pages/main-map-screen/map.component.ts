import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ToolboxComponent } from '../../shared/components/toolbox/toolbox.component';
import { MatDialog } from '@angular/material/dialog';
import  mapboxgl from '../../shared/mapbox/mapbox-init';
import { CityDialogComponent } from '../../shared/components/city-dialog/city-dialog.component';
import { MarkerIconInterface } from '../../shared/interfaces/icons/marker-icon.interface';
import { MarkerIconsSize } from '../../shared/enums/icons/marker-icons.enum';
import { PlaceMarker, SavePlaceMarket } from '../../shared/interfaces/places/places.interface';
import { CreateMarkerToolbarComponent } from '../../shared/components/create-marker-toolbar/create-marker-toolbar.component';
import { CommonModule } from '@angular/common';
import { MarkerService } from '../../shared/services/marker.service';

type GeoJsonFeature = GeoJSON.Feature<GeoJSON.Point, { id: string; name: string; description: string }>;

@Component({
  selector: 'app-mapbox',
  standalone: true,
  imports: [
    CommonModule,
    ToolboxComponent, 
    CreateMarkerToolbarComponent
  ],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapBoxComponent implements OnInit, AfterViewInit {
  map!: mapboxgl.Map;
  markers: mapboxgl.Marker[] = [];
  markerFeatures: GeoJsonFeature[] = [];
  selectedPlacement: MarkerIconInterface | null = null;
  castlesGeoJson: GeoJSON.FeatureCollection<GeoJSON.Point, { id: string; name: string; description: string }> = {
    type: 'FeatureCollection',
    features: [],
  };
  isCreating: boolean = false; 


  constructor(
    private dialog: MatDialog,
    private markerService: MarkerService) {}

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: {
        version: 8,
        sources: {},
        layers: [],
      },
      center: [0, 0],
      zoom: 0.1,
      maxZoom: 4,
      renderWorldCopies: false
    });

    this.markerService.selectedMarker$.subscribe((marker) => {
      if (marker) {
        this._startPlacementMode(marker);
      }
    });

    this.markerService.saveMarker$.subscribe((marker) => {
      if (marker) {
        this._saveMarket(marker);
      }
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
      
      this.map.setMaxBounds([
        [-180, -85],  
        [180, 85]     
      ]);

      // Disabled right click rotation map.
      this.map.dragRotate.disable();
      this.map.touchZoomRotate.disable(); 
    });

    this.map.on('zoom', () => {
      const currentZoom = this.map.getZoom();

      this.markers.forEach(marker => {
        if (currentZoom <= 3) {
          marker.getElement().style.display = 'none'; 
        } else {
          marker.getElement().style.display = 'block';
        }
      });
    });

    setTimeout(() => {
      this.map.resize();
    }, 100);
  }

  private _placeIconOnMap(lngLat: mapboxgl.LngLat) {
    if (!this.selectedPlacement) return;
    
    const markerElement = document.createElement('img');
    markerElement.src = this.selectedPlacement.icon;

    switch (this.selectedPlacement?.size) {
      case MarkerIconsSize.Small:
        markerElement.style.width = '50px';
        markerElement.style.height = '50px';
        break;
      case MarkerIconsSize.Medium:
        markerElement.style.width = '75px';
        markerElement.style.height = '75px';
        break;
      case MarkerIconsSize.Big:
      default:
        markerElement.style.width = '100px';
        markerElement.style.height = '100px';
        break;
    }

    this.dialog.open(CityDialogComponent, {
      width: '400px',
      data: { lat: lngLat.lat, lng: lngLat.lng, marker: markerElement, icon: { name: this.selectedPlacement.icon, size: this.selectedPlacement.size} }
    });

    this.isCreating = false;
    this.selectedPlacement = null;
  }
  
  private _startPlacementMode(marker: MarkerIconInterface) {
    if (!marker) return;
    
    this.selectedPlacement = marker;
    this.isCreating = true;
    this.map.setZoom(4);
    
  }

  private _saveMarket(marker: SavePlaceMarket): void {
    const lngLat= {
      lat: marker.lat,
      lng: marker.lng
    };

    const tmpMarker = new mapboxgl.Marker({ element: marker.marker })
      .setLngLat(lngLat)
      .addTo(this.map);  
    
    this.markers.push(tmpMarker);
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
}
