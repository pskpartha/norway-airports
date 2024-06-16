import { Component, DoCheck, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Airport } from '../../../models/airport';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MapService } from '../../../services/map.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-airport-list',
  templateUrl: './airport-list.component.html',
  styleUrl: './airport-list.component.scss',
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ height: 0, opacity: 0 }),
            animate('1s ease-out',
              style({ height: 300, opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ height: 300, opacity: 1 }),
            animate('1s ease-in',
              style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class AirportListComponent implements OnInit, OnDestroy {

  airportList!: Airport[];
  filteredAirports: Airport[] = [];
  selectedAirport!: Airport;


  showFlightList = false;
  searchForm!: FormGroup;
  private subscription?: Subscription;

  private apiService = inject(ApiService);
  private mapService = inject(MapService);

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadAirportList();
    // TODO separate form
    this.searchForm = this.fb.group({
      searchTerm: ['', Validators.required]
    });

    // TODO: UNsubscription
    this.searchForm.get('searchTerm')?.valueChanges
      .pipe(
        debounceTime(300), // Wait 300ms after each keystroke before filtering
        distinctUntilChanged(), // Filter only if the value actually changes
        tap(searchTerm => this.filterAirports(searchTerm))
      )
      .subscribe();
  }

  loadAirportList() {
    this.subscription = this.apiService.getAirportList().subscribe({
      next: data => {
        this.airportList = data;
        this.filteredAirports = this.airportList;
        this.markAirportLocOnMap(this.airportList);
        this.selectedAirport = this.airportList[0];
        console.log('>>>>>>>>', this.selectedAirport);

      },
      error: error => {
        console.error(error);
      }
    });
  }



  markAirportLocOnMap(airportData: Airport[]): void {
    const locationFeatures = airportData.map((airport: Airport) => {
      const coordinates = [airport.lng, airport.lat];
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates
        },
        properties: {
          airportId: airport.iata_code,
          title: airport.name,
          description: airport.city
        }
      };
    });
    this.mapService.addMarkerMapView(locationFeatures);
  }

  closeFlightList(): void {
    this.showFlightList = false;
    // this.showAirportList = !this.showAirportList;
    this.mapService.resetMapView();
  }

  filterAirports(searchTerm: string) {
    const searchTermLower = searchTerm.toLowerCase();
    this.filteredAirports = this.airportList.filter(airport =>
      airport.name.toLowerCase().includes(searchTermLower) ||
      airport.city.toLowerCase().includes(searchTermLower)
    );
  }


  updateAirportInfo(airport: Airport,) {
    // this.showAirportList = false;
    this.selectedAirport = airport;
    this.mapService.focusLocationOnMap(airport.iata_code);
    this.showFlightList = true;
  }


  clearSearchInput(): void {
    this.searchForm.get('searchTerm')?.setValue('');
  }

  ngOnDestroy(): void {
    this.showFlightList = false;
    this.subscription?.unsubscribe();
  }

}

