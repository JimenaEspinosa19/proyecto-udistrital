import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeolocalizacionPuntosComponent } from './geolocalizacion-puntos.component';

describe('GeolocalizacionPuntosComponent', () => {
  let component: GeolocalizacionPuntosComponent;
  let fixture: ComponentFixture<GeolocalizacionPuntosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeolocalizacionPuntosComponent]
    });
    fixture = TestBed.createComponent(GeolocalizacionPuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
