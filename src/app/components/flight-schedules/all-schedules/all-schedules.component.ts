import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IAirportSchedule } from '../../../models/schedule.model';
import { IAirport } from '../../../models/airport.model';

@Component({
  selector: 'app-all-schedules',
  templateUrl: './all-schedules.component.html',
  styleUrl: './all-schedules.component.scss',
})
export class AllSchedulesComponent {
  @Input() scheduleData!: {
    airport: IAirport;
    schedules: IAirportSchedule[];
  };
  public activeModal = inject(NgbActiveModal);
}
