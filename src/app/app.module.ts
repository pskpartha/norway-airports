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
import { AirportLocMapComponent } from './components/home/airport-loc-map/airport-loc-map.component';
import { AirportListComponent } from './components/home/airport-list/airport-list.component';
import { HomeComponent } from './components/home/home.component';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
@NgModule({
    declarations: [AppComponent, HomeComponent, HeaderComponent, FooterComponent, AirportLocMapComponent, AirportListComponent],
    imports: [BrowserModule, HttpClientModule, NgbModule, TranslateModule.forRoot({
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
