import {  Routes } from '@angular/router';
import { MapBoxComponent } from './pages/main-map-screen/map.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PlacesDetailsComponent } from './pages/places-details/places-details.component';

export const routes: Routes = [
    { path: '', component: MapBoxComponent },
    { path: 'place-details/:id', component: PlacesDetailsComponent},    
    { path: '**', component: NotFoundComponent } 
];

