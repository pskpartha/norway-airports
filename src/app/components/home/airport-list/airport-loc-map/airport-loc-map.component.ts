import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, effect, inject, input } from '@angular/core';
import { MapService } from '../../../../services/map.service';
import { Airport } from '../../../../models/airport';

@Component({
  selector: 'app-airport-loc-map',
  templateUrl: './airport-loc-map.component.html',
  styleUrl: './airport-loc-map.component.scss'
})
export class AirportLocMapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainerElement!: ElementRef;
  airportData = input.required<Airport[]>();

  private mapService = inject(MapService);

  constructor() {
    effect(() => {
      console.log('effect:', this.airportData());
      console.log('Effect called');
      if (this.airportData()) {
        this.markAirportLocOnMap(this.airportData());
      }

    });

  }
  ngOnInit(): void {
    console.log(this.airportData());

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

  ngAfterViewInit(): void {
    console.log(this.airportData());
    this.mapService.initMapView(this.mapContainerElement.nativeElement);
  }

  ngOnDestroy(): void {
    this.mapService.clearMapView();
  }

}
