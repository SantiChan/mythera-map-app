import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityDialogComponent } from './city-dialog.component';

describe('CityDialogComponent', () => {
  let component: CityDialogComponent;
  let fixture: ComponentFixture<CityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
