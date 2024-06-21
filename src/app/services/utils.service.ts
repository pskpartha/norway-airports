import { Injectable } from '@angular/core';
import { IAirportSchedule } from '../models/schedule.model';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  // Flight-related utilities
  private primaryFlights = new Map<string, IAirportSchedule>();
  private csAssociateFlights = new Map<string, IAirportSchedule[]>();
  private flightThatCS = new Set<string>();

  constructor() {}

  // Flight grouping functionality
  groupFlightsByCodeSharing(flights: IAirportSchedule[]): any[] {
    this.initializeFlightMaps();
    flights.forEach((flight) => this.processFlightAssociations(flight));
    return this.buildFlightGroups();
  }

  private initializeFlightMaps() {
    this.primaryFlights.clear();
    this.csAssociateFlights.clear();
    this.flightThatCS.clear();
  }

  private processFlightAssociations(flight: IAirportSchedule) {
    if (flight.cs_flight_iata) {
      this.markAsCodeShare(flight);
    }
    if (!this.flightThatCS.has(flight.flight_iata)) {
      this.setAsPrimaryFlight(flight);
    }
  }

  private markAsCodeShare(flight: IAirportSchedule) {
    this.flightThatCS.add(flight.flight_iata);
    if (!this.csAssociateFlights.has(flight.cs_flight_iata)) {
      this.csAssociateFlights.set(flight.cs_flight_iata, []);
    }
    this.csAssociateFlights.get(flight.cs_flight_iata)?.push(flight);
  }

  private setAsPrimaryFlight(flight: IAirportSchedule) {
    this.primaryFlights.set(flight.flight_iata, flight);
    if (!this.csAssociateFlights.has(flight.flight_iata)) {
      this.csAssociateFlights.set(flight.flight_iata, []);
    }
  }

  private buildFlightGroups(): any[] {
    const result = [];
    for (let [key, primaryFlight] of this.primaryFlights.entries()) {
      if (!this.flightThatCS.has(key)) {
        const associates = this.csAssociateFlights.get(key);
        result.push({
          ...primaryFlight,
          associates: associates,
        });
      }
    }
    return result;
  }
}
