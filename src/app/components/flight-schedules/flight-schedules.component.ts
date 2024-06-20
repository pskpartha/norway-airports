import { Component, OnInit, effect, inject, input } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { IAirportSchedule } from '../../models/schedule.model';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { IAirport } from '../../models/airport.model';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-flight-schedules',
  templateUrl: './flight-schedules.component.html',
  styleUrl: './flight-schedules.component.scss',
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('1s ease-out', style({ height: 300, opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: 300, opacity: 1 }),
        animate('1s ease-in', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class FlightSchedulesComponent implements OnInit {
  schedules: IAirportSchedule[] = [];
  airport!: IAirport;

  private apiService = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private mapService = inject(MapService);

  ngOnInit(): void {
    // TODO unsubscribe
    this.activatedRoute.params.subscribe((p) => {
      const airportIATA = p['airport_iata'] as string;
      if (airportIATA) {
        this.loadAirportInfo(airportIATA);
        this.loadFlightDetils(airportIATA);
      }
    });
  }

  loadAirportInfo(airportIATA: string) {
    if (airportIATA) {
      this.apiService.getAirportInfo(airportIATA).subscribe({
        next: (data) => {
          this.airport = data;
          console.log(this.airport);
        },
        error: (error) => {
          console.error(error);
        },
      });

      this.mapService.focusLocationOnMap(airportIATA);
    }
  }

  loadFlightDetils(airportIATA?: string): void {
    if (airportIATA) {
      this.apiService.getFlightSchedules(airportIATA).subscribe({
        next: (data) => {
          this.schedules = this.groupFlightsByCodeSharing(data);
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }

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

    return result.slice(0, 5);
  }
}
