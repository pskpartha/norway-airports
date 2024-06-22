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
import { MAP_LAYERS } from '../../app.constants';

@Component({
  selector: 'app-airport-loc-map',
  templateUrl: './airport-loc-map.component.html',
  styleUrl: './airport-loc-map.component.scss',
})
export class AirportLocMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainerElement!: ElementRef;
  mapLayers = MAP_LAYERS;

  private mapService = inject(MapService);

  ngAfterViewInit(): void {
    this.mapService.initMapView(this.mapContainerElement.nativeElement);
  }

  selectLayer(layerKey: string) {
    this.mapService.selectLayer(layerKey);
  }

  resetZoom(): void {
    this.mapService.resetFullMapView();
  }
  ngOnDestroy(): void {
    this.mapService.clearMapView();
  }
}
