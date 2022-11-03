import {Injectable} from '@angular/core';
import {map, Observable, of, take} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CarModel} from '../models/car-model.model';
import {Trip} from '../models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private readonly SERVER_URL = 'api';

  constructor(private httpClient: HttpClient) { }

  public retrieveCarMakes(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.SERVER_URL}/make`).pipe(take(1), map(makes => makes.sort()));
  }

  public retrieveCarModels(year: string, make: string): Observable<CarModel[]> {
    let url = `${this.SERVER_URL}/model?make=${make}`;
    if (year) {
      url += `&year=${year}`;
    }
    return this.httpClient.get<CarModel[]>(url).pipe(take(1), map(makes => makes.sort()));
  }

  public retrieveCarYears(): Observable<number[]> {
    return of(Array.from({length: (2023 - 1995)}, (v, k) => k + 1995).sort((a, b) => b - a));
  }

  public saveTrip(trip: Trip): Observable<void> {
    const formData = new FormData();
    formData.append('email', trip.email);
    formData.append('startLongitude', trip.startLon+'');
    formData.append('startLatitude', trip.startLat+'');
    formData.append('destinationLongitude', trip.destLon+'');
    formData.append('destinationLatitude', trip.destLat+'');
    formData.append('make', trip.marqueVehicule);
    formData.append('model', trip.modeleVehicule);
    formData.append('year', trip.anneeVehicule+'');
    formData.append('timeCar', trip.tempsAuto+'');
    formData.append('timePublicTransit', trip.tempsTransportCommun+'');
    formData.append('timeBike', trip.tempsVelo+'');
    formData.append('timeWalking', trip.tempsMarche+'');
    formData.append('distanceCar', trip.distanceAuto+'');
    formData.append('distancePublicTransit', trip.distanceTransportCommun+'');
    formData.append('distanceBike', trip.distanceVelo+'');
    formData.append('distanceWalking', trip.distanceMarche+'');

    return this.httpClient.post<void>(`${this.SERVER_URL}/trip/`, formData);
  }
}
