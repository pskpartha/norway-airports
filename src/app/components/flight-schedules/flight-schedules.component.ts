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
import { UtilsService } from '../../services/utils.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AllSchedulesComponent } from './all-schedules/all-schedules.component';

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
  private utliService = inject(UtilsService);
  private modalService = inject(NgbModal);

  ngOnInit(): void {
    // TODO unsubscribe
    this.activatedRoute.params.subscribe((p) => {
      const airportIATA = p['airport_iata'] as string;
      if (airportIATA) {
        this.loadAirportInfo(airportIATA);
        this.loadFlightSchedules(airportIATA);
      }
    });
  }

  loadAirportInfo(airportIATA: string) {
    // TODO Unsubscribe
    if (airportIATA) {
      this.apiService.getAirportInfo(airportIATA).subscribe({
        next: (data) => {
          this.airport = data;
          console.log(this.airport);
          this.mapService.focusLocationOnMap(airportIATA, this.airport);
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }

  loadFlightSchedules(airportIATA?: string): void {
    if (airportIATA) {
      this.apiService.getFlightSchedules(airportIATA).subscribe({
        next: (data) => {
          this.schedules = this.utliService.groupFlightsByCodeSharing(data);
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }

  openAllSchedulesModal() {
    const modalRef = this.modalService.open(AllSchedulesComponent, {
      scrollable: true,
    });
    modalRef.componentInstance.scheduleData = {
      airport: this.airport,
      schedules: this.schedules,
    };
  }
}
