import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { IAirportSchedule } from '../../models/schedule.model';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { IAirport } from '../../models/airport.model';
import { MapService } from '../../services/map.service';
import { UtilsService } from '../../services/utils.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AllSchedulesComponent } from './all-schedules/all-schedules.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-flight-schedules',
  templateUrl: './flight-schedules.component.html',
  styleUrl: './flight-schedules.component.scss',
})
export class FlightSchedulesComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  dataLoading = false;
  schedules: IAirportSchedule[] = [];
  airport!: IAirport;

  private apiService = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private mapService = inject(MapService);
  private utliService = inject(UtilsService);
  private modalService = inject(NgbModal);

  ngOnInit(): void {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe((param) => {
        const airportIATA = param['airport_iata'] as string;
        if (airportIATA) {
          this.loadAirportInfo(airportIATA);
          this.loadFlightSchedules(airportIATA);
        }
      })
    );
  }

  loadAirportInfo(airportIATA: string) {
    if (airportIATA) {
      this.subscriptions.push(
        this.apiService.getAirportInfo(airportIATA).subscribe({
          next: (data) => {
            this.airport = data;
            this.mapService.focusLocationOnMap(airportIATA, this.airport);
          },
          error: (error) => {
            console.error(error);
          },
        })
      );
    }
  }

  loadFlightSchedules(airportIATA?: string): void {
    this.dataLoading = true;
    if (airportIATA) {
      this.subscriptions.push(
        this.apiService.getFlightSchedules(airportIATA).subscribe({
          next: (data) => {
            this.dataLoading = false;
            if (data) {
              this.schedules = this.utliService.groupFlightsByCodeSharing(data);
            }
          },
          error: (error) => {
            this.dataLoading = false;
            console.error(error);
          },
        })
      );
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
