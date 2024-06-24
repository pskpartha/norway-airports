import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { IAirport } from '../../models/airport.model';
import { MapService } from '../../services/map.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-airport-list',
  templateUrl: './airport-list.component.html',
  styleUrl: './airport-list.component.scss',
})
export class AirportListComponent implements OnInit, OnDestroy {
  airportList!: IAirport[];
  filteredAirports: IAirport[] = [];
  selectedAirport!: IAirport;
  searchForm!: FormGroup;

  private subscriptions: Subscription[] = [];

  private apiService = inject(ApiService);
  private mapService = inject(MapService);

  public dataLoading = false;
  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
    });
  }

  ngOnInit(): void {
    this.loadAirportList();
    this.initializeSearch();
  }

  initializeSearch() {
    this.subscriptions.push(
      this.searchForm
        .get('searchTerm')!
        .valueChanges.pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((term) => {
          this.filterAirports(term);
        })
    );
  }

  loadAirportList() {
    this.dataLoading = true;
    this.subscriptions.push(
      this.apiService.getAirportList().subscribe({
        next: (data: IAirport[]) => {
          this.dataLoading = false;
          this.airportList = data;
          this.filteredAirports = this.airportList;
          this.markAirportLocOnMap(this.airportList);
          this.selectedAirport = this.airportList[0];
        },
        error: (error: Error) => {
          this.dataLoading = false;
          console.error(error);
        },
      })
    );
  }

  markAirportLocOnMap(airportData: IAirport[]): void {
    const locationFeatures = airportData.map((airport: IAirport) =>
      this.mapService.createJSONFeature(airport)
    );
    this.mapService.addMarkerMapView(locationFeatures);
  }

  filterAirports(searchTerm: string) {
    if (!searchTerm) {
      this.filteredAirports = this.airportList;
    } else {
      const searchTermLower = searchTerm.toLowerCase();
      this.filteredAirports = this.airportList.filter((airport) =>
        airport.name.toLowerCase().includes(searchTermLower)
      );
    }
  }

  updateAirportInfo(airport: IAirport) {
    this.selectedAirport = airport;
  }

  clearSearchInput(): void {
    this.searchForm.get('searchTerm')?.setValue('');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
