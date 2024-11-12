import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasComponentComponent } from './ventas-component.component';

describe('VentasComponentComponent', () => {
  let component: VentasComponentComponent;
  let fixture: ComponentFixture<VentasComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
