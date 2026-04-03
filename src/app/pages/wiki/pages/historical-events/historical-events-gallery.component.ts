import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AngularEditorModule, AngularEditorConfig } from '@kolkov/angular-editor';
import { HistoricalEvent, HistoricalEventsService } from '../../../../core/services/wiki/historical-events.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-historical-events-gallery',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatTooltipModule,
    AngularEditorModule
  ],
  templateUrl: './historical-events-gallery.component.html',
  styleUrls: ['./historical-events-gallery.component.scss']
})
export class HistoricalEventsGalleryComponent implements OnInit {
  events: HistoricalEvent[] = [];
  selectedEvent: HistoricalEvent | null = null;
  
  form: FormGroup;
  imageFile: File | null = null;
  imagePreview: string | null = null;
  isEditing = false;
  isNew = false;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '250px',
    placeholder: 'Redacta los acontecimientos del evento histórico...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    toolbarHiddenButtons: [['insertImage', 'insertVideo', 'backgroundColor']]
  };

  constructor(
    private eventsService: HistoricalEventsService,
    private fb: FormBuilder,
    private snackbar: SnackbarService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      descriptionHtml: ['']
    });
  }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.eventsService.getEvents().subscribe({
      next: (data) => this.events = data,
      error: () => this.snackbar.error('Error al cargar eventos históricos')
    });
  }

  selectEvent(event: HistoricalEvent) {
    if (this.isEditing) return;
    this.selectedEvent = event;
    this.isEditing = false;
    this.isNew = false;
  }

  addNew() {
    this.selectedEvent = { name: '' };
    this.isNew = true;
    this.isEditing = true;
    this.imageFile = null;
    this.imagePreview = null;
    this.form.reset();
  }

  editEvent() {
    if (!this.selectedEvent) return;
    this.isEditing = true;
    this.isNew = false;
    this.form.patchValue({
      name: this.selectedEvent.name,
      descriptionHtml: this.selectedEvent.descriptionHtml
    });
    this.imagePreview = this.selectedEvent.imageUrl || null;
    this.imageFile = null;
  }

  cancelEdit() {
    this.isEditing = false;
    if (this.isNew) {
      this.selectedEvent = null;
    }
    this.imageFile = null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  save() {
    if (this.form.invalid) return;

    const formData = new FormData();
    formData.append('name', this.form.value.name);
    if (this.form.value.descriptionHtml) {
        formData.append('descriptionHtml', this.form.value.descriptionHtml);
    }
    if (this.imageFile) {
        formData.append('file', this.imageFile);
    }

    if (this.isNew) {
      this.eventsService.createEvent(formData).subscribe({
        next: (created) => {
          this.events.push(created);
          this.selectedEvent = created;
          this.isEditing = false;
          this.snackbar.success('Evento histórico creado');
        },
        error: () => this.snackbar.error('Error al crear el evento histórico')
      });
    } else if (this.selectedEvent && this.selectedEvent._id) {
      this.eventsService.updateEvent(this.selectedEvent._id, formData).subscribe({
        next: (updated) => {
          const index = this.events.findIndex(e => e._id === updated._id);
          if (index !== -1) {
             this.events[index] = updated;
             this.selectedEvent = updated;
          }
          this.isEditing = false;
          this.snackbar.success('Evento histórico actualizado');
        },
        error: () => this.snackbar.error('Error al actualizar el evento histórico')
      });
    }
  }

  deleteEvent(event: HistoricalEvent) {
    if (!event._id) return;
    if (confirm('¿Estás seguro de que quieres borrar este evento histórico de los anales?')) {
      this.eventsService.deleteEvent(event._id).subscribe({
        next: () => {
          this.events = this.events.filter(e => e._id !== event._id);
          this.selectedEvent = null;
          this.isEditing = false;
          this.snackbar.success('Evento histórico eliminado');
        },
        error: () => this.snackbar.error('Error al eliminar evento')
      });
    }
  }
}
