import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSizeDialogComponent } from './select-size-dialog.component';

describe('SelectSizeDialogComponent', () => {
  let component: SelectSizeDialogComponent;
  let fixture: ComponentFixture<SelectSizeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectSizeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectSizeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
