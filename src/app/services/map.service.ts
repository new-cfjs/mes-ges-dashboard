import {Injectable} from '@angular/core';
import {MapDirectionsService} from '@angular/google-maps';
import {map, Observable, tap} from 'rxjs';
import {DirectionsRequest} from '../models/directions-request.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor(private mapDirectionsService: MapDirectionsService) { }

  public getDirections(request: DirectionsRequest): Observable<google.maps.DirectionsResult> {
    const mapDirectionRequest: google.maps.DirectionsRequest = {
      destination: {lat: +request.destination.lat, lng: +request.destination.lon},
      origin: {lat: +request.origin.lat, lng: +request.origin.lon},
      travelMode: request.travelMode,
      region: 'ca'
    };

    if (mapDirectionRequest.transitOptions) {
      mapDirectionRequest.transitOptions = request.transitOptions;
    }

    return this.mapDirectionsService.route(mapDirectionRequest).pipe(
      map(response => response.result!),
      tap(result => {
        if (!result.routes.length) {
          console.log(`Directions from ${request.travelMode} are empty`);
        }
      })
    );
  }
}
