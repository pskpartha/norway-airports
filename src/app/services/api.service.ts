import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Airport } from '../models/airport';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  airportsAPIurl = './assets/demo-data/airports.json';
  flightAPIurl = './assets/demo-data/flights/';

  constructor(private http: HttpClient) { }

  getAirportList(): Observable<Airport[]> {
    return this.http.get<Airport[]>(this.airportsAPIurl).pipe(
      catchError(error => {
        console.error('An error occurred:', error);
        return throwError(() => error);
      })
    );
  }

  getFlights(airportCode: string): Observable<any[]> {
    let code = airportCode.toLowerCase();
    return this.http.get<any[]>(this.flightAPIurl + code + '.json').pipe(
      catchError(error => {
        console.error('An error occurred:', error);
        return throwError(() => error);
      })
    );
  }

}
