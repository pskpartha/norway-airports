import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AirportLocMapComponent } from './components/airport-loc-map/airport-loc-map.component';
import { AirportListComponent } from './components/airport-list/airport-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FlightSchedulesComponent } from './components/flight-schedules/flight-schedules.component';
import { LanguageSwitcherComponent } from './components/header/language-switcher/language-switcher.component';
import { AllSchedulesComponent } from './components/flight-schedules/all-schedules/all-schedules.component';
import { ScheduleComponent } from './components/flight-schedules/schedule/schedule.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LanguageSwitcherComponent,
    FooterComponent,
    AirportLocMapComponent,
    AirportListComponent,
    FlightSchedulesComponent,
    AllSchedulesComponent,
    ScheduleComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
