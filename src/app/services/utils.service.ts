import { Injectable } from '@angular/core';
import { IAirportSchedule } from '../models/schedule.model';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  groupFlightsByCodeSharing(flights: IAirportSchedule[]): any[] {
    const primaryFlights = new Map<string, IAirportSchedule>();
    const csAssociateFlights = new Map<string, IAirportSchedule[]>();
    const flightThatCS = new Set<string>();

    // Initialize primary flights and setup associations
    flights.forEach((flight) => {
      if (flight.cs_flight_iata) {
        // Mark flight as an associate
        flightThatCS.add(flight.flight_iata);

        // Add to associations under the code-share flight's IATA
        if (!csAssociateFlights.has(flight.cs_flight_iata)) {
          csAssociateFlights.set(flight.cs_flight_iata, []);
        }
        csAssociateFlights.get(flight.cs_flight_iata)?.push(flight);
      }

      // Always treat as a primary candidate until proven otherwise
      if (!flightThatCS.has(flight.flight_iata)) {
        // Check if not already marked as an associate
        primaryFlights.set(flight.flight_iata, flight);
        if (!csAssociateFlights.has(flight.flight_iata)) {
          csAssociateFlights.set(flight.flight_iata, []); // Initialize empty association
        }
      }
    });

    // Construct the output for flights with their associates
    const result = [];
    for (let [key, primaryFlight] of primaryFlights.entries()) {
      if (!flightThatCS.has(key)) {
        // Ensure this primary is not an associate of another flight
        const associates = csAssociateFlights.get(key);
        result.push({
          ...primaryFlight,
          associates: associates,
        });
      }
    }

    return result;
  }
}
