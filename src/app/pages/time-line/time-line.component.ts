import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-time-line',
  imports: [
    CommonModule
  ],
  templateUrl: './time-line.component.html',
  styleUrl: './time-line.component.scss'
})
export class TimeLineComponent implements AfterViewInit {
  @ViewChildren('timelineItem') timelineItems!: QueryList<ElementRef>;

  timelineEvents = [
    { title: 'Crónica de Mythera', description: 'La historia de Mythera se despliega a través de diversas edades, marcadas por eventos cruciales.', isAge: true, visible: true },
    { title: 'Edad de los Mitos (EM) (0 - 6000)', description: 'Marcada por la creación y los fundamentos del mundo.', isAge: true, visible: false },
    { title: 'Edad de las Razas (ER) (0 - 1500)', description: 'Surgimiento e interacción de diversas civilizaciones y seres míticos.', isAge: true, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false },
    { title: 'Mythera', description: 'La Comunión (500 ER): Establecimiento de la armonía entre las razas mediante los Árboles Primigenios.\nEl Encierro (1500 ER): Cierre de los pasajes de los Árboles Primigenios debido a la amenaza de Bel`qazor.', isAge: false, visible: false }
  ];

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = this.timelineItems.toArray().findIndex(item => item.nativeElement === entry.target);
            if (index !== -1) {
              this.timelineEvents[index].visible = true;
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    this.timelineItems.forEach((item) => {
      observer.observe(item.nativeElement);
    });
  }
}
