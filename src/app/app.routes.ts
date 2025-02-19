import {  Routes } from '@angular/router';
import { MapBoxComponent } from './pages/main-map-screen/map.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
    { path: '', component: MapBoxComponent },  
    { path: '**', component: NotFoundComponent } 
];

