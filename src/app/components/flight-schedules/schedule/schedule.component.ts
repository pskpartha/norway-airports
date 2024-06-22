import { Component, effect, input } from '@angular/core';
import { IAirportSchedule } from '../../../models/schedule.model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent {
  schedule = input.required<IAirportSchedule>();
  airlabFlagUrl = 'https://airlabs.co/img/airline/s/';
  constructor() {
    effect(() => {
      // console.log(this.schedule());
      console.log(this.schedule().dep_actual);
      console.log(this.schedule().dep_time);
    });
  }
}
