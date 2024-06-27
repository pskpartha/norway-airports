import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { ApiService } from './api.service';
import { IAirport } from '../models/airport.model';
import { environment } from '../../environments/environment';
import { IAirportSchedule } from '../models/schedule.model';

describe('ApiService', () => {
  let apiService: ApiService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    TestBed.configureTestingModule({
      providers: [ApiService, { provide: HttpClient, useValue: httpClientSpy }],
    });

    apiService = TestBed.inject(ApiService);
  });

  it('should return a list of airports | getAirportList', () => {
    const mockAirportData: { response: IAirport[] } = {
      response: [
        { name: 'Test Airport 1', iata_code: 'TEST1', lat: 23, lng: 23 },
        { name: 'Test Airport 2', iata_code: 'TEST2', lat: 23, lng: 23 },
      ],
    };

    const expectedAirports: IAirport[] = mockAirportData.response.filter(
      (airport) => airport.iata_code !== null
    );

    httpClientSpy.get.and.returnValue(of(mockAirportData));

    apiService.getAirportList().subscribe((airports) => {
      expect(airports).toEqual(expectedAirports);
    });

    expect(httpClientSpy.get).toHaveBeenCalledWith(
      `${environment.apiBaseUrl}airports?country_code=NO&api_key=${environment.airlabApiKey}`
    );
  });

  it('if any iata code is missing then it should filtered | getAirportList', () => {
    const mockAirportData: { response: IAirport[] } = {
      response: [
        { name: 'Test Airport Null', iata_code: null, lat: 23, lng: 23 },
        { name: 'Test Airport 1', iata_code: 'TEST1', lat: 23, lng: 23 },
        { name: 'Test Airport 2', iata_code: 'TEST2', lat: 23, lng: 23 },
      ],
    };

    httpClientSpy.get.and.returnValue(of(mockAirportData));

    apiService.getAirportList().subscribe((airports) => {
      expect(airports.length).not.toEqual(mockAirportData.response.length);
    });

    expect(httpClientSpy.get).toHaveBeenCalledWith(
      `${environment.apiBaseUrl}airports?country_code=NO&api_key=${environment.airlabApiKey}`
    );
  });

  it('should return flight list | getFlightSchedules', () => {
    const mockFlightData: { response: IAirportSchedule[] } = {
      response: [
        {
          airline_iata: 'BA',
          airline_icao: 'BAW',
          flight_iata: 'BA2245',
          flight_icao: 'BAW2245',
          dep_iata: 'TLL',
          dep_time: '2024-06-18 15:55',
          dep_time_utc: '2024-06-18 12:55',
          dep_actual: '2024-06-18 16:26',
          dep_actual_utc: '2024-06-18 13:26',
          arr_iata: 'LGW',
          cs_airline_iata: 'BT',
          cs_flight_iata: 'BT871',
          status: 'active',
          duration: 185,
        },
      ],
    };

    const departureIATA = 'TLL';
    httpClientSpy.get.and.returnValue(of(mockFlightData));

    apiService.getFlightSchedules(departureIATA).subscribe((data) => {
      expect(data).toEqual(mockFlightData.response);
    });

    expect(httpClientSpy.get.calls.mostRecent().args[0]).toContain('schedules');
    expect(httpClientSpy.get.calls.mostRecent().args[0]).toContain(
      departureIATA.toUpperCase()
    );
  });
});
