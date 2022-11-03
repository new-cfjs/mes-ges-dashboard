import {Injectable} from '@angular/core';
import {GesCalculatorQuery} from '../models/ges-calculator-query.model';
import {forkJoin, map, Observable, tap} from 'rxjs';
import {MapService} from './map.service';
import {Trip} from '../models/trip.model';
import TravelMode = google.maps.TravelMode;

@Injectable({
  providedIn: 'root'
})
export class GesCalculatorService {

  constructor(private mapService: MapService) { }

  calculateGES(request: GesCalculatorQuery): Observable<Trip> {
    const trip = {
      email: 'todo',
      startLon: request.originAddress.lon,
      startLat: request.originAddress.lat,
      destLon: request.destinationAddress.lon,
      destLat: request.destinationAddress.lat,
      marqueVehicule: request.carModel.make,
      modeleVehicule: request.carModel.model,
      anneeVehicule: +request.carModel.year
    } as Trip;

    return forkJoin(
      this.mapService.getDirections({
        origin: request.originAddress,
        destination: request.destinationAddress,
        travelMode: TravelMode.DRIVING
      }).pipe(
        tap(result => {
          const firstRoute = result.routes[0]!.legs[0]!;

          trip.tempsAuto = firstRoute.duration!.value;
          trip.distanceAuto = firstRoute.distance!.value;
        })
      ),
      this.mapService.getDirections({
        origin: request.originAddress,
        destination: request.destinationAddress,
        travelMode: TravelMode.TRANSIT
      }).pipe(
        tap(result => {
          const firstRoute = result.routes[0]!.legs[0]!;

          trip.tempsTransportCommun = firstRoute.duration!.value;
          trip.distanceTransportCommun = firstRoute.distance!.value;
        })
      ),
      this.mapService.getDirections({
        origin: request.originAddress,
        destination: request.destinationAddress,
        travelMode: TravelMode.BICYCLING
      }).pipe(
        tap(result => {
          const firstRoute = result.routes[0]!.legs[0]!;

          trip.tempsVelo = firstRoute.duration!.value;
          trip.distanceVelo = firstRoute.distance!.value;
        })
      ),
      this.mapService.getDirections({
        origin: request.originAddress,
        destination: request.destinationAddress,
        travelMode: TravelMode.WALKING
      }).pipe(
        tap(result => {
          const firstRoute = result.routes[0]!.legs[0]!;

          trip.tempsMarche = firstRoute.duration!.value;
          trip.distanceMarche = firstRoute.distance!.value;
        })
      )
    ).pipe(
      map(_ => trip)
    );
  }
}
