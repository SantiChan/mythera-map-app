import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CastleOverlayComponent } from './castle-overlay.component';

describe('CastleOverlayComponent', () => {
  let component: CastleOverlayComponent;
  let fixture: ComponentFixture<CastleOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CastleOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CastleOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
