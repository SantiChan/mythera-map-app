import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMarkerToolbarComponent } from './create-marker-toolbar.component';

describe('CreateMarkerToolbarComponent', () => {
  let component: CreateMarkerToolbarComponent;
  let fixture: ComponentFixture<CreateMarkerToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMarkerToolbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMarkerToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
