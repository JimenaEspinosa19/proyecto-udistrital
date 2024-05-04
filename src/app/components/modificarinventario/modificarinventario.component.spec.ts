import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarinventarioComponent } from './modificarinventario.component';

describe('ModificarinventarioComponent', () => {
  let component: ModificarinventarioComponent;
  let fixture: ComponentFixture<ModificarinventarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificarinventarioComponent]
    });
    fixture = TestBed.createComponent(ModificarinventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
