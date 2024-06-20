import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  effect,
  inject,
  input,
} from '@angular/core';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-airport-loc-map',
  templateUrl: './airport-loc-map.component.html',
  styleUrl: './airport-loc-map.component.scss',
})
export class AirportLocMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainerElement!: ElementRef;

  private mapService = inject(MapService);

  ngAfterViewInit(): void {
    this.mapService.initMapView(this.mapContainerElement.nativeElement);
  }

  ngOnDestroy(): void {
    this.mapService.clearMapView();
  }
}
