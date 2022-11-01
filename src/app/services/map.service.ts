import { Injectable } from '@angular/core';
import {MapDirectionsResponse, MapDirectionsService} from '@angular/google-maps';
import {map, Observable, take} from 'rxjs';
import {Place} from '../models/place.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor(private mapDirectionsService: MapDirectionsService) { }

  public getDirections(origin: Place, destination: Place, travelMode: google.maps.TravelMode): Observable<google.maps.DirectionsResult> {
    const request: google.maps.DirectionsRequest = {
      destination: {lat: +destination.lat, lng: +destination.lon},
      origin: {lat: +origin.lat, lng: +origin.lon},
      travelMode: google.maps.TravelMode.DRIVING
    };

    return this.mapDirectionsService.route(request).pipe(
      map(response => response.result!)
    );
  }
}
