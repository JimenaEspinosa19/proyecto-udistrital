import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProximosaVencerComponent } from './proximosa-vencer.component';

describe('ProximosaVencerComponent', () => {
  let component: ProximosaVencerComponent;
  let fixture: ComponentFixture<ProximosaVencerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProximosaVencerComponent]
    });
    fixture = TestBed.createComponent(ProximosaVencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
