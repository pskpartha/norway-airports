import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { IAirport } from '../models/airport.model';
import { IAirportSchedule } from '../models/schedule.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiBaseUrl;
  private airlabsApiKey = environment.airlabApiKey;
  private countryCode = 'NO';

  constructor(private http: HttpClient) {}

  getAirportList(): Observable<IAirport[]> {
    return this.http
      .get<{ response: IAirport[] }>(
        `${this.apiUrl}airports?country_code=${this.countryCode}&api_key=${this.airlabsApiKey}`
      )
      .pipe(
        map((data) =>
          data.response.filter((airport) => airport.iata_code !== null)
        ),
        catchError((error: HttpErrorResponse) => {
          console.error(
            'An error occurred: IN getAirportList: ',
            error.message
          );
          return throwError(() => error.message);
        })
      );
  }

  getFlightSchedules(departureIATA: string): Observable<IAirportSchedule[]> {
    const code = departureIATA.toUpperCase();
    return this.http
      .get<{ response: IAirportSchedule[] }>(
        `${this.apiUrl}schedules?dep_iata=${code}&api_key=${this.airlabsApiKey}`
      )
      .pipe(
        map((data) => data.response),
        catchError((error: HttpErrorResponse) => {
          console.error(
            'An error occurred: IN getFlightSchedules',
            error.message
          );
          return throwError(() => error.message);
        })
      );
  }

  getAirportInfo(airportIATACode: string): Observable<IAirport> {
    return this.http
      .get<{ response: IAirport[] }>(
        `${this.apiUrl}airports?iata_code=${airportIATACode}&api_key=${this.airlabsApiKey}`
      )
      .pipe(
        map((data) => data.response[0]),
        catchError((error: HttpErrorResponse) => {
          console.error(
            'An error occurred: IN getAirportInfo: ',
            error.message
          );
          return throwError(() => error.message);
        })
      );
  }
}
