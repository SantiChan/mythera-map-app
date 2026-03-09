import {  Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PlacesDetailsComponent } from './pages/places-details/places-details.component';
import { TimeLineComponent } from './pages/time-line/time-line.component';
import { MapComponent } from './pages/map/map.component';
import { WikiComponent } from './pages/wiki/wiki.component';
import { WikiPageComponent } from './pages/wiki/pages/wiki-page.component';
import { NarrativeArcsListComponent } from './pages/wiki/pages/narrative-arcs/narrative-arcs-list.component';
import { NarrativeArcDetailComponent } from './pages/wiki/pages/narrative-arcs/narrative-arc-detail.component';

export const routes: Routes = [
    { path: '', component: MapComponent },
    { path: 'place-details/:id', component: PlacesDetailsComponent},
    { path: 'timeline', component: TimeLineComponent},
    { 
        path: 'wiki', 
        component: WikiComponent,
        children: [
            { path: '', redirectTo: 'arcos-narrativos', pathMatch: 'full' },
            { path: 'arcos-narrativos', component: NarrativeArcsListComponent },
            { path: 'arcos-narrativos/:id', component: NarrativeArcDetailComponent },
            { path: 'linea-temporal', component: WikiPageComponent, data: { title: 'Línea Temporal' } },
            { path: 'dioses', component: WikiPageComponent, data: { title: 'Dioses' } },
            { path: 'eternos', component: WikiPageComponent, data: { title: 'Eternos' } },
            { path: 'humanos', component: WikiPageComponent, data: { title: 'Humanos' } },
            { path: 'elfos', component: WikiPageComponent, data: { title: 'Elfos' } },
            { path: 'enanos', component: WikiPageComponent, data: { title: 'Enanos' } },
            { path: 'gnomos', component: WikiPageComponent, data: { title: 'Gnomos' } },
            { path: 'medianos', component: WikiPageComponent, data: { title: 'Medianos' } },
            { path: 'orcos', component: WikiPageComponent, data: { title: 'Orcos' } },
            { path: 'razas-unicas', component: WikiPageComponent, data: { title: 'Razas Únicas' } },
            { path: 'personajes', component: WikiPageComponent, data: { title: 'Personajes' } },
            { path: 'organizaciones', component: WikiPageComponent, data: { title: 'Organizaciones' } },
            { path: 'normas-mesa', component: WikiPageComponent, data: { title: 'Normas de la Mesa' } },
            { path: 'eventos-historicos', component: WikiPageComponent, data: { title: 'Eventos Históricos' } },
        ]
    },
    { path: '**', component: NotFoundComponent } 
];

