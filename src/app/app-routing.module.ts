import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AirportListComponent } from './components/airport-list/airport-list.component';
import { FlightSchedulesComponent } from './components/flight-schedules/flight-schedules.component';
import { AllSchedulesComponent } from './components/flight-schedules/all-schedules/all-schedules.component';

const routes: Routes = [
  { path: '', redirectTo: '/airports', pathMatch: 'full' },
  { path: 'airports', component: AirportListComponent },
  { path: 'airports/:airport_iata', component: FlightSchedulesComponent },
  {
    path: 'all-schedules/:airport_iata',
    component: AllSchedulesComponent,
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
