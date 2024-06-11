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

  constructor(private http: HttpClient) { }

  getAirportList(): Observable<Airport[]> {
    return this.http.get<Airport[]>(this.airportsAPIurl).pipe(
      catchError(error => {
        console.error('An error occurred:', error);
        return throwError(() => error);
      })
    );
  }

}
