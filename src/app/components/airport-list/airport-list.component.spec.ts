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

  const airportListMock: IAirport[] = [
    {
      name: 'JFK International',
      iata_code: 'JFK',
      lat: 40.6413,
      lng: -73.7781,
    },
    { name: 'Los Angeles', iata_code: 'LAX', lat: 34.0522, lng: -118.2437 },
    { name: 'Heathrow', iata_code: 'HTW', lat: 51.47, lng: -0.4543 },
  ];

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

  describe('Airport list initialization', () => {
    it('should load airport list on creation', () => {
      apiService.getAirportList.and.returnValue(of(airportListMock));
      fixture.detectChanges();
      expect(apiService.getAirportList).toHaveBeenCalled();
      expect(component.airportList).toEqual(airportListMock);
    });

    it('should handle errors when loading airport list fails', () => {
      const error = new Error('API error');
      apiService.getAirportList.and.returnValue(throwError(() => error));
      fixture.detectChanges();
      expect(component.dataLoading).toBeFalse();
      expect(component.airportList).toBeUndefined();
    });
  });

  describe('List filter search functionality', () => {
    beforeEach(() => {
      apiService.getAirportList.and.returnValue(of(airportListMock));
      fixture.detectChanges();
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should filter airports correctly when a matching search term is entered', () => {
      component.searchForm.controls['searchTerm'].setValue('JFK International');
      fixture.detectChanges();
      component.filterAirports(
        component.searchForm.controls['searchTerm'].value
      );
      expect(component.filteredAirports.length).toBe(1);
      expect(component.filteredAirports[0].name).toBe('JFK International');
    });

    it('should return all airports when the search term is empty', () => {
      component.searchForm.controls['searchTerm'].setValue('');
      expect(component.filteredAirports.length).toBe(3);
    });

    it('should handle case-insensitive search correctly', () => {
      component.searchForm.controls['searchTerm'].setValue('heathrow');
      fixture.detectChanges();
      component.filterAirports(
        component.searchForm.controls['searchTerm'].value
      );
      expect(component.filteredAirports.length).toBe(1);
      expect(component.filteredAirports[0].name).toBe('Heathrow');
    });

    it('should return no airports when there is no match', () => {
      component.searchForm.controls['searchTerm'].setValue('Paris');
      component.filterAirports(
        component.searchForm.controls['searchTerm'].value
      );
      expect(component.filteredAirports.length).toBe(0);
    });
  });
});
