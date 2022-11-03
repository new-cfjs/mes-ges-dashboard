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
      marqueVehicule: request.carModel.make || '',
      modeleVehicule: request.carModel.model || '',
      anneeVehicule: +request.carModel.year || -1,
      tempsAuto: -1,
      distanceAuto: -1,
      tempsTransportCommun: -1,
      distanceTransportCommun: -1,
      tempsVelo: -1,
      distanceVelo: -1,
      tempsMarche: -1,
      distanceMarche: -1
    } as Trip;

    const directionsQueries$ = [];

    if (request.carModel) {
      directionsQueries$.push(
        this.mapService.getDirections({
          origin: request.originAddress,
          destination: request.destinationAddress,
          travelMode: TravelMode.DRIVING
        }).pipe(
          tap(result => {
            if (result.routes.length) {
              const firstRoute = result.routes[0]!.legs[0]!;

              trip.tempsAuto = firstRoute.duration!.value;
              trip.distanceAuto = firstRoute.distance!.value;
            }
          })
        )
      );
    }

    directionsQueries$.push(
      this.mapService.getDirections({
        origin: request.originAddress,
        destination: request.destinationAddress,
        travelMode: TravelMode.TRANSIT
      }).pipe(
        tap(result => {
          if (result.routes.length) {
            const firstRoute = result.routes[0]!.legs[0]!;

            trip.tempsTransportCommun = firstRoute.duration!.value;
            trip.distanceTransportCommun = firstRoute.distance!.value;
          }
        })
      ),
      this.mapService.getDirections({
        origin: request.originAddress,
        destination: request.destinationAddress,
        travelMode: TravelMode.BICYCLING
      }).pipe(
        tap(result => {
          if (result.routes.length) {
            const firstRoute = result.routes[0]!.legs[0]!;

            trip.tempsVelo = firstRoute.duration!.value;
            trip.distanceVelo = firstRoute.distance!.value;
          }
        })
      ),
      this.mapService.getDirections({
        origin: request.originAddress,
        destination: request.destinationAddress,
        travelMode: TravelMode.WALKING
      }).pipe(
        tap(result => {
          if (result.routes.length) {
            const firstRoute = result.routes[0]!.legs[0]!;

            trip.tempsMarche = firstRoute.duration!.value;
            trip.distanceMarche = firstRoute.distance!.value;
          }
        })
      )
    );

    return forkJoin(
      ...directionsQueries$
    ).pipe(
      map(_ => trip)
    );
  }
}
