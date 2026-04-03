import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PlacesDetailsComponent } from './pages/places-details/places-details.component';
import { TimeLineComponent } from './pages/time-line/time-line.component';
import { MapComponent } from './pages/map/map.component';
import { WikiComponent } from './pages/wiki/wiki.component';
import { WikiPageComponent } from './pages/wiki/pages/wiki-page.component';
import { NarrativeArcsListComponent } from './pages/wiki/pages/narrative-arcs/narrative-arcs-list.component';
import { NarrativeArcDetailComponent } from './pages/wiki/pages/narrative-arcs/narrative-arc-detail.component';
import { WikiTimelineComponent } from './pages/wiki/pages/timeline/wiki-timeline.component';
import { GodsListComponent } from './pages/wiki/pages/gods/gods-list.component';
import { EternalsListComponent } from './pages/wiki/pages/eternals/eternals-list.component';
import { RacesGalleryComponent } from './pages/wiki/pages/races/races-gallery.component';
import { SubracesListComponent } from './pages/wiki/pages/races/subraces/subraces-list.component';
import { CharactersListComponent } from './pages/wiki/pages/characters/characters-list.component';
import { FactionsListComponent } from './pages/wiki/pages/factions/factions-list.component';
import { RulesGalleryComponent } from './pages/wiki/pages/rules/rules-gallery.component';
import { HistoricalEventsGalleryComponent } from './pages/wiki/pages/historical-events/historical-events-gallery.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', component: MapComponent, canActivate: [authGuard] },
    { path: 'place-details/:id', component: PlacesDetailsComponent, canActivate: [authGuard] },
    { path: 'timeline', component: TimeLineComponent, canActivate: [authGuard] },
    {
        path: 'wiki',
        component: WikiComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'arcos-narrativos', pathMatch: 'full' },
            { path: 'arcos-narrativos', component: NarrativeArcsListComponent },
            { path: 'arcos-narrativos/:id', component: NarrativeArcDetailComponent },
            { path: 'linea-temporal', component: WikiTimelineComponent },
            { path: 'dioses', component: GodsListComponent },
            { path: 'eternos', component: EternalsListComponent },
            { path: 'razas', component: RacesGalleryComponent },
            { path: 'razas/:id', component: SubracesListComponent },
            { path: 'humanos', redirectTo: 'razas' },
            { path: 'elfos', redirectTo: 'razas' },
            { path: 'enanos', redirectTo: 'razas' },
            { path: 'gnomos', redirectTo: 'razas' },
            { path: 'medianos', redirectTo: 'razas' },
            { path: 'orcos', redirectTo: 'razas' },
            { path: 'razas-unicas', redirectTo: 'razas' },
            { path: 'personajes', component: CharactersListComponent },
            { path: 'organizaciones', component: FactionsListComponent },
            { path: 'normas-mesa', component: RulesGalleryComponent },
            { path: 'eventos-historicos', component: HistoricalEventsGalleryComponent },
        ]
    },
    { path: '**', component: NotFoundComponent }
];

