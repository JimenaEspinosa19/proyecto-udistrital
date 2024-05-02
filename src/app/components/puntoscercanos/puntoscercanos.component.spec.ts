import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuntoscercanosComponent } from './puntoscercanos.component';

describe('PuntoscercanosComponent', () => {
  let component: PuntoscercanosComponent;
  let fixture: ComponentFixture<PuntoscercanosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PuntoscercanosComponent]
    });
    fixture = TestBed.createComponent(PuntoscercanosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
