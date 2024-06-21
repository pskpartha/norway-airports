import { Injectable } from '@angular/core';
import { Feature } from 'ol';
import Map from 'ol/Map';
import View from 'ol/View';
import { Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import GeoJSON from 'ol/format/GeoJSON';
import { IAirport } from '../models/airport.model';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  map!: Map;
  vectorSource!: VectorSource;

  constructor() {}

  initMapView(targetId: string): void {
    this.map = new Map({
      target: targetId,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 0], // Adjust center coordinates if needed
        zoom: 2, // Set initial zoom level
      }),
    });
  }

  createJSONFeature(airport: IAirport): any {
    const coordinates = [airport.lng, airport.lat];
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates,
      },
      properties: {
        airportId: airport.iata_code,
        title: airport.name,
      },
    };
  }

  //  TODO add interface to replace any
  addMarkerMapView(locationData: any[]): void {
    console.log(locationData);

    const geojsonObject = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: {
          name: 'EPSG:3857',
        },
      },
      features: locationData,
    };
    this.vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObject, {
        dataProjection: 'EPSG:4326', // GeoJSON is typically in WGS 84
        featureProjection: 'EPSG:3857', // Map's projection
      }),
    });

    // Define a common style for all features
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1], // Anchors the icon so that its bottom-middle point is at the coordinate
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: './assets/icons/airport.png', // Replace with the path to your icon image
        scale: 0.2, // Adjust scale to suit your needs
      }),
    });

    // Apply the style to each feature
    this.vectorSource
      .getFeatures()
      .forEach((feature) => feature.setStyle(iconStyle));

    const vectorLayer = new VectorLayer({
      source: this.vectorSource,
    });

    this.map.addLayer(vectorLayer);

    this.resetMapView();
  }

  resetMapView() {
    // Focus the map's view to fit all the features
    this.map.getView().fit(this.vectorSource.getExtent(), {
      padding: [50, 50, 50, 50],
      duration: 1000,
    });
  }

  // TODO feature interface
  focusLocationOnMap(locationId: string, locationFeature?: any): void {
    let feature;

    console.log(this.vectorSource);
    if (!this.vectorSource) {
    } else {
      feature = this.vectorSource
        .getFeatures()
        .find((f) => f.get('airportId') === locationId);
    }

    if (feature) {
      const geometry = feature.getGeometry();

      if (geometry instanceof Point) {
        // Check for specific geometry type (recommended)
        const coordinates = geometry.getCoordinates();
        this.map.getView().animate({
          center: coordinates,
          zoom: 10, // Adjust zoom level as needed
          duration: 1000, // Smooth animation over 1 second
        });
      } else {
        console.warn(
          `Geometry type for feature '${locationId}' is not supported.`
        );
      }
    } else {
      console.warn(`Feature with name '${locationId}' not found.`);
    }
  }

  clearMapView(): void {
    this.map.setTarget(undefined);
  }
}
