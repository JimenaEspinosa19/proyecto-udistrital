import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentosvencerComponent } from './medicamentosvencer.component';

describe('MedicamentosvencerComponent', () => {
  let component: MedicamentosvencerComponent;
  let fixture: ComponentFixture<MedicamentosvencerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicamentosvencerComponent]
    });
    fixture = TestBed.createComponent(MedicamentosvencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
