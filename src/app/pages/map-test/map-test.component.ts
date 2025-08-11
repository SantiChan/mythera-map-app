import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { PlaceService } from '../../shared/services/places.service';
import { CityDialogComponent } from '../../shared/components/city-dialog/city-dialog.component';
import { MarkerIconsSize } from '../../shared/enums/icons/marker-icons.enum';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MarkerIconInterface } from '../../shared/interfaces/icons/marker-icon.interface';
import { ToolboxComponent } from '../../shared/components/toolbox/toolbox.component';
import { MarkerService } from '../../shared/services/marker.service';
import { CreateMarkerToolbarComponent } from '../../shared/components/create-marker-toolbar/create-marker-toolbar.component';

@Component({
    selector: 'app-map-test',
    templateUrl: './map-test.component.html',
    styleUrls: ['./map-test.component.scss'],
    imports: [
        CommonModule,
        ToolboxComponent,
        CreateMarkerToolbarComponent
    ]
})
export class MapTestComponent implements AfterViewInit, OnInit {
    selectedPlacement: MarkerIconInterface | null = null;
    isCreating: boolean = false;

    private _map!: L.Map;
    private readonly _imageWidth = 10204;
    private readonly _imageHeight = 7544;
    private _continentLayer = L.layerGroup();
    private _regionLayer = L.layerGroup();
    private _cityLayer = L.layerGroup();
    private _placeLayer = L.layerGroup();

    constructor(
        private _dialog: MatDialog,
        private _placesService: PlaceService,
        private _markerService: MarkerService,
    ) {

    }


    ngOnInit(): void {
        this._markerService.selectedMarker$.subscribe(marker => {
            if (marker) {
                this._startPlacementMode(marker)
            };
        });

        this._markerService.saveMarker$.subscribe(marker => {
            if (marker) this._addMarkerToMap(marker);
        });
    }

    ngAfterViewInit(): void {
        const bounds: L.LatLngBoundsExpression = [[0, 0], [this._imageHeight, this._imageWidth]];

        this._map = L.map('map', {
            crs: L.CRS.Simple,
            minZoom: -5,
            maxZoom: 3.5,
            zoomSnap: 0.1,
            zoomDelta: 0.5,
        });

        const imageUrl = 'assets/imgs/map/mythera-map-new.png';
        L.imageOverlay(imageUrl, bounds).addTo(this._map);

        setTimeout(() => {
            this._map.fitBounds(bounds, { animate: false });

            const minZoom = this._map.getBoundsZoom(bounds, true);
            this._map.setMinZoom(minZoom);
            this._map.setMaxBounds(bounds);
            this._map.panInsideBounds(bounds, { animate: false });

            this._placesService.getPlaces().subscribe({
                next: (places) => {
                    places.forEach((place: any) => this._addMarkerToMap(place));
                    this._updateVisibleLayers();
                },
                error: (error) => {
                    console.error('Error al obtener los lugares', error);
                }
            });
        }, 50);

        this._addPlacesByzoom();
    }

    private  _addPlacesByzoom()  {
        this._map.on('zoomend', () => {
            this._updateVisibleLayers();
        });
    }

    private _updateVisibleLayers() {
        const zoom = this._map.getZoom();
        if (zoom < -2.3) {
            this._map.addLayer(this._continentLayer);
            this._map.removeLayer(this._regionLayer);
            this._map.removeLayer(this._cityLayer);
            this._map.removeLayer(this._placeLayer);
        } else if (zoom >= -2.3 && zoom < -0.3) {
            this._map.addLayer(this._continentLayer);
            this._map.addLayer(this._regionLayer);
            this._map.removeLayer(this._cityLayer);
            this._map.removeLayer(this._placeLayer);
        } else if (zoom >= -0.3) {
            this._map.removeLayer(this._continentLayer);
            this._map.removeLayer(this._regionLayer);
            this._map.addLayer(this._cityLayer);
            this._map.addLayer(this._placeLayer);
        }
    }

    private _addMarkerToMap(place: any): void {
        const { y, x, name, iconSize: size } = place;

        const iconClass = this._getIconCssClassBySize(size);

        const markerHTML = document.createElement('div');
        markerHTML.className = `icon ${iconClass}`;

        const inner = document.createElement('div');
        inner.className = 'inner';
        markerHTML.appendChild(inner);

        const label = document.createElement('div');
        label.className = 'label';
        label.innerText = name;
        markerHTML.appendChild(label);

        const icon = L.divIcon({
            html: markerHTML,
            className: '',
            iconSize: [40, 50],
            iconAnchor: [20, 50]
        });

        const marker = L.marker([y, x], { icon });

        switch (place.type) {
            case 'continent':
                marker.addTo(this._continentLayer);
                break;
            case 'region':
                marker.addTo(this._regionLayer);
                break;
            case 'city':
                marker.addTo(this._cityLayer);
                break;
            case 'place':
            default:
                marker.addTo(this._placeLayer);
                break;
        }

        const openDialog = (e: MouseEvent) => {
            e.stopPropagation();
            this._dialog.open(CityDialogComponent, {
                data: { placeData: place, viewMode: true }
            });
        };

        markerHTML.addEventListener('click', openDialog);
    }

    private _getIconCssClassBySize(size: MarkerIconsSize): string {
        switch (size) {
            case MarkerIconsSize.Small: return 'common';
            case MarkerIconsSize.Medium: return 'elite';
            case MarkerIconsSize.Big:
            default: return 'epic';
        }
    }

    private _handleMapClick = (e: L.LeafletMouseEvent): void => {
        const { lat: y, lng: x } = e.latlng;

        this._dialog.open(CityDialogComponent, {
            width: '400px',
            data: {
                x,
                y,
                icon: {
                    size: this.selectedPlacement?.size
                }
            }
        });

        this._map.getContainer().style.cursor = '';
        this.isCreating = false;
        this.selectedPlacement = null;

        //clean listenner
        this._map.off('click', this._handleMapClick); 
    }

    private _startPlacementMode(marker: MarkerIconInterface) {
        if (!marker) return;

        this.selectedPlacement = marker;

        this.isCreating = true;
    }

    onAddPlacementMode(): void {
        if (!this.selectedPlacement) return;

        this._map.on('click', this._handleMapClick);
    }

    onCancelPlacementMode() {
        this.isCreating = false;
        this.selectedPlacement = null;
    }
}
