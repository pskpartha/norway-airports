import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import {
  TranslateModule,
  TranslateLoader,
  TranslateFakeLoader,
} from '@ngx-translate/core';
import { AirportListComponent } from './airport-list.component';
import { ApiService } from '../../services/api.service';
import { MapService } from '../../services/map.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IAirport } from '../../models/airport.model';
import { of, throwError } from 'rxjs';

describe('AirportListComponent', () => {
  let component: AirportListComponent;
  let fixture: ComponentFixture<AirportListComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let mapService: jasmine.SpyObj<MapService>;

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['getAirportList']);
    const mapSpy = jasmine.createSpyObj('MapService', [
      'addMarkerMapView',
      'createJSONFeature',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
      declarations: [AirportListComponent],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: MapService, useValue: mapSpy },
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AirportListComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    mapService = TestBed.inject(MapService) as jasmine.SpyObj<MapService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load airport list and initialize search on creation', () => {
    const mockAirports: IAirport[] = [
      { name: 'JFK', iata_code: 'JFK', lat: 40.6413, lng: -73.7781 },
    ];
    apiService.getAirportList.and.returnValue(of(mockAirports));
    fixture.detectChanges();
    expect(apiService.getAirportList).toHaveBeenCalled();
    expect(component.airportList).toEqual(mockAirports);
    expect(component.selectedAirport).toEqual(mockAirports[0]);
  });

  it('should handle errors when loading airport list fails', () => {
    const error = new Error('API error');
    apiService.getAirportList.and.returnValue(throwError(() => error));
    fixture.detectChanges();
    expect(component.dataLoading).toBeFalse();
    expect(component.airportList).toBeUndefined();
  });
});
