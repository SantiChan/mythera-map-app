import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TimelineService } from '../../../../shared/services/wiki/timeline.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { EraModalComponent } from './modals/era-modal.component';
import { EventModalComponent } from './modals/event-modal.component';
import { ConfirmModalComponent } from '../narrative-arcs/modals/confirm-modal.component';

@Component({
    selector: 'app-wiki-timeline',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
    templateUrl: './wiki-timeline.component.html',
    styleUrls: ['./wiki-timeline.component.scss']
})
export class WikiTimelineComponent implements OnInit {
    eras: any[] = [];
    events: any[] = [];

    constructor(
        private timelineService: TimelineService,
        private dialog: MatDialog,
        private snackbar: SnackbarService
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.timelineService.getEras().subscribe({
            next: (eras) => {
                this.eras = eras;
                this.timelineService.getEvents().subscribe({
                    next: (events) => {
                        this.events = events;
                    },
                    error: (err) => console.error(err)
                });
            },
            error: (err) => console.error(err)
        });
    }

    getEventsForEra(eraId: string) {
        return this.events
            .filter(e => e.eraId?._id === eraId || e.eraId === eraId)
            .sort((a, b) => a.year - b.year);
    }

    addEra() {
        const dialogRef = this.dialog.open(EraModalComponent, { width: '400px' });
        dialogRef.afterClosed().subscribe(data => {
            if (data) {
                this.timelineService.createEra(data).subscribe({
                    next: () => {
                        this.snackbar.success('Era creada con éxito');
                        this.loadData();
                    },
                    error: (err) => this.snackbar.error('Error al crear la Era')
                });
            }
        });
    }

    editEra(era: any) {
        const dialogRef = this.dialog.open(EraModalComponent, {
            width: '400px',
            data: { era }
        });
        dialogRef.afterClosed().subscribe(data => {
            if (data) {
                this.timelineService.updateEra(era._id, data).subscribe({
                    next: () => {
                        this.snackbar.success('Era actualizada con éxito');
                        this.loadData();
                    },
                    error: (err) => this.snackbar.error('Error al actualizar la Era')
                });
            }
        });
    }

    deleteEra(id: string) {
        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '400px',
            data: {
                title: 'Confirmar Eliminación',
                message: '¿Estás seguro de que quieres eliminar esta Era? Esta acción borrará todos los eventos asociados.'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.timelineService.deleteEra(id).subscribe({
                    next: () => {
                        this.snackbar.success('Era eliminada');
                        this.loadData();
                    },
                    error: (err) => this.snackbar.error('Error al eliminar la Era')
                });
            }
        });
    }

    addEvent() {
        const dialogRef = this.dialog.open(EventModalComponent, {
            width: '500px',
            data: { eras: this.eras }
        });
        dialogRef.afterClosed().subscribe(data => {
            if (data) {
                this.timelineService.createEvent(data).subscribe({
                    next: () => {
                        this.snackbar.success('Evento creado con éxito');
                        this.loadData();
                    },
                    error: (err) => this.snackbar.error('Error al crear el evento')
                });
            }
        });
    }

    editEvent(event: any) {
        const dialogRef = this.dialog.open(EventModalComponent, {
            width: '500px',
            data: { eras: this.eras, event }
        });
        dialogRef.afterClosed().subscribe(data => {
            if (data) {
                this.timelineService.updateEvent(event._id, data).subscribe({
                    next: () => {
                        this.snackbar.success('Evento actualizado con éxito');
                        this.loadData();
                    },
                    error: (err) => this.snackbar.error('Error al actualizar el evento')
                });
            }
        });
    }

    deleteEvent(id: string) {
        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '400px',
            data: {
                title: 'Confirmar Eliminación',
                message: '¿Estás seguro de que quieres eliminar este Evento?'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.timelineService.deleteEvent(id).subscribe({
                    next: () => {
                        this.snackbar.success('Evento eliminado');
                        this.loadData();
                    },
                    error: (err) => this.snackbar.error('Error al eliminar el Evento')
                });
            }
        });
    }
}
