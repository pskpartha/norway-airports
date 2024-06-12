import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AirportLocMapComponent } from './components/home/airport-list/airport-loc-map/airport-loc-map.component';
import { AirportListComponent } from './components/home/airport-list/airport-list.component';
import { HomeComponent } from './components/home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FlightsComponent } from './components/home/flights/flights.component';
import { LanguageSwitcherComponent } from './components/header/language-switcher/language-switcher.component';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
    declarations: [AppComponent, HomeComponent, HeaderComponent, LanguageSwitcherComponent, FooterComponent, AirportLocMapComponent, AirportListComponent, FlightsComponent],
    imports: [BrowserModule, ReactiveFormsModule, HttpClientModule, NgbModule, TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }), AppRoutingModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
