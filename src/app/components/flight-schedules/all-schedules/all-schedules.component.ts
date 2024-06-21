import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-all-schedules',
  templateUrl: './all-schedules.component.html',
  styleUrl: './all-schedules.component.scss',
})
export class AllSchedulesComponent {
  @Input() scheduleData: any;
  public activeModal = inject(NgbActiveModal);
}
