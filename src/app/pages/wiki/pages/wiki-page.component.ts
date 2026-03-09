import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wiki-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wiki-page">
      <h1>{{ title }}</h1>
      <div class="wiki-page__content">
        <p class="placeholder-text">Esta sección está en construcción.</p>
        <p class="placeholder-text">Aquí se mostrará el contenido de {{ title }}.</p>
      </div>
    </div>
  `,
  styles: [`
    .wiki-page {
      max-width: 1200px;
      margin: 0 auto;

      h1 {
        color: var(--link-gold);
        font-size: 36px;
        margin-bottom: 24px;
        border-bottom: 2px solid var(--link-gold);
        padding-bottom: 12px;
      }

      &__content {
        line-height: 1.8;
        font-size: 16px;

        .placeholder-text {
          color: rgba(230, 224, 233, 0.7);
          font-style: italic;
          margin-bottom: 16px;
        }
      }
    }
  `]
})
export class WikiPageComponent implements OnInit {
  title: string = 'Wiki Page';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.title = this.route.snapshot.data['title'] || 'Wiki Page';
  }
}
