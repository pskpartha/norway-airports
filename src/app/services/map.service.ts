import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { Geometry, Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import GeoJSON from 'ol/format/GeoJSON';
import { IAirport } from '../models/airport.model';
import Feature from 'ol/Feature';
import { fromLonLat } from 'ol/proj';
import { Overlay } from 'ol';
import { environment } from '../../environments/environment';
import { BingMaps } from 'ol/source';

interface PointFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties?: any;
}

interface Layers {
  [key: string]: TileLayer<OSM | BingMaps>;
  osm: TileLayer<OSM>;
  transport: TileLayer<OSM>;
  road: TileLayer<BingMaps>;
  aerialwithlabels: TileLayer<BingMaps>;
  darkview: TileLayer<BingMaps>;
  lightview: TileLayer<BingMaps>;
}

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private bingMapKey = environment.bingMapKey;
  private map!: Map;
  private popupOverlay!: Overlay;
  private pointsSource!: VectorSource<Feature<Geometry>>;
  private pointsLayer: VectorLayer<Feature<Geometry>> = new VectorLayer({});

  layers: Layers = {
    osm: new TileLayer({
      source: new OSM(),
      properties: { id: 'baseLayer' },
    }),
    transport: new TileLayer({
      source: new OSM({
        url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
      }),
    }),
    road: new TileLayer({
      preload: Infinity,
      source: new BingMaps({
        key: this.bingMapKey,
        imagerySet: 'Road',
      }),
    }),
    aerialwithlabels: new TileLayer({
      preload: Infinity,
      source: new BingMaps({
        key: this.bingMapKey,
        imagerySet: 'AerialWithLabels',
      }),
    }),
    darkview: new TileLayer({
      preload: Infinity,
      source: new BingMaps({
        key: this.bingMapKey,
        imagerySet: 'CanvasDark',
      }),
    }),
    lightview: new TileLayer({
      preload: Infinity,
      source: new BingMaps({
        key: this.bingMapKey,
        imagerySet: 'CanvasLight',
      }),
    }),
  };

  initMapView(targetId: string): void {
    this.map = new Map({
      target: targetId,
      layers: [this.layers.osm, this.pointsLayer],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    this.initPopup();
  }

  createJSONFeature(airport: IAirport): PointFeature {
    const coordinates = [airport.lng, airport.lat];
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: coordinates,
      },
      properties: {
        airportId: airport.iata_code,
        title: airport.name,
      },
    };
  }

  createVectorSource(
    locationData: PointFeature | PointFeature[]
  ): VectorSource {
    const features = Array.isArray(locationData)
      ? locationData
      : [locationData];

    const geojsonObject = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: {
          name: 'EPSG:3857',
        },
      },
      features: features,
    };
    return new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObject, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      }),
    });
  }

  addMarkerMapView(locationData: PointFeature | PointFeature[]): void {
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: './assets/icons/airport.png',
        scale: 0.2,
      }),
    });

    this.pointsSource = this.createVectorSource(locationData);
    this.pointsSource
      .getFeatures()
      .forEach((feature) => feature.setStyle(iconStyle));

    this.pointsLayer.setSource(this.pointsSource);
    Array.isArray(locationData)
      ? this.resetFullMapView()
      : this.setLocationZoom(fromLonLat(locationData.geometry.coordinates));
  }

  resetFullMapView() {
    this.map.getView().fit(this.pointsSource.getExtent(), {
      padding: [50, 50, 50, 50],
      duration: 1000,
    });
  }

  focusLocationOnMap(locationId: string, locationInfo?: IAirport): void {
    let feature;
    if (!this.pointsSource && locationInfo) {
      this.addMarkerMapView(this.createJSONFeature(locationInfo));
    } else {
      feature = this.pointsSource
        .getFeatures()
        .find((f) => f.get('airportId') === locationId);
    }

    if (feature) {
      const geometry = feature.getGeometry();
      if (geometry instanceof Point) {
        const coordinates = geometry.getCoordinates();
        this.setLocationZoom(coordinates);
      } else {
        console.warn(
          `Geometry type for feature '${locationId}' is not supported.`
        );
      }
    } else {
      console.warn(`Feature with name '${locationId}' not found.`);
    }
  }

  setLocationZoom(coordinates: number[]) {
    this.map.getView().animate({
      center: coordinates,
      zoom: 10,
      duration: 1000,
    });
  }

  private initPopup(): void {
    const container = document.getElementById('popup');
    const content = document.getElementById('popup-content');
    const closer = document.getElementById('popup-closer');

    this.popupOverlay = new Overlay({
      element: container!,
      autoPan: true,
    });
    this.map.addOverlay(this.popupOverlay);

    closer!.onclick = () => {
      this.popupOverlay.setPosition(undefined);
      closer?.blur();
      return false;
    };

    this.map.on('singleclick', (evt) => {
      const feature = this.map.forEachFeatureAtPixel(
        evt.pixel,
        function (feature) {
          return feature;
        }
      );

      if (feature) {
        const geometry = feature.getGeometry();
        if (geometry instanceof Point) {
          const coordinates = geometry.getCoordinates();
          content!.innerHTML =
            '<h6 class="f-title fw-med">' +
            feature.get('title') +
            '</h6> <p>' +
            feature.get('airportId') +
            '</p>'; // Assuming title is stored in feature properties
          this.popupOverlay.setPosition(coordinates);
        }
      }
    });
  }

  selectLayer(layerKey: string): void {
    const newLayer = this.layers[layerKey];
    const baseLayer = this.map
      .getLayers()
      .getArray()
      .find((layer) => layer.get('id') === 'baseLayer');

    if (newLayer && baseLayer) {
      this.map.removeLayer(baseLayer);
      newLayer.set('id', 'baseLayer'); // Ensure the new base layer gets the ID
      this.map.getLayers().insertAt(0, newLayer);
    } else {
      console.error(
        'Layer with key',
        layerKey,
        'does not exist or base layer not found'
      );
    }
  }

  clearMapView(): void {
    this.pointsSource?.clear();
    this.map.removeLayer(this.pointsLayer);
    if (this.map) {
      this.map.setTarget(undefined);
    }
  }
}
