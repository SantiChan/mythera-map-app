import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapBoxComponent } from './map.component';

describe('MapComponent', () => {
  let component: MapBoxComponent;
  let fixture: ComponentFixture<MapBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MapBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
