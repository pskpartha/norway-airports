import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Airport } from '../../../models/airport';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MapService } from '../../../services/map.service';

@Component({
  selector: 'app-airport-list',
  templateUrl: './airport-list.component.html',
  styleUrl: './airport-list.component.scss'
})
export class AirportListComponent implements OnInit, OnDestroy {

  airportList!: Airport[];
  filteredAirports: Airport[] = [];
  selectedAirport!: Airport;
  showAirportList = false;
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

  toggleAirportList(): void {
    this.showAirportList = !this.showAirportList;
  }

  filterAirports(searchTerm: string) {
    const searchTermLower = searchTerm.toLowerCase();
    this.filteredAirports = this.airportList.filter(airport =>
      airport.name.toLowerCase().includes(searchTermLower) ||
      airport.city.toLowerCase().includes(searchTermLower)
    );
  }


  updateAirportInfo(airport: Airport) {
    this.showAirportList = false;
    this.selectedAirport = airport;
    this.mapService.focusLocationOnMap(airport.iata_code);
  }


  clearSearchInput(): void {

  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
