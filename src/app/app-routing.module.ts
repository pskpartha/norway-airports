import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { FlightDetailsComponent } from './components/flight-details/flight-details.component';
import { AllFlightsComponent } from './components/all-flights/all-flights.component';
import { NotFoundComponent } from './components/not-found/not-found.component';


const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'flight-details', component: FlightDetailsComponent },
    { path: 'all-flights', component: AllFlightsComponent },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
