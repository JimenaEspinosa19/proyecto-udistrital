import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificacioncorreoComponent } from './verificacioncorreo.component';

describe('VerificacioncorreoComponent', () => {
  let component: VerificacioncorreoComponent;
  let fixture: ComponentFixture<VerificacioncorreoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerificacioncorreoComponent]
    });
    fixture = TestBed.createComponent(VerificacioncorreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
