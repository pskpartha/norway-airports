import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportLocMapComponent } from './airport-loc-map.component';

describe('AirportLocMapComponent', () => {
  let component: AirportLocMapComponent;
  let fixture: ComponentFixture<AirportLocMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirportLocMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AirportLocMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
