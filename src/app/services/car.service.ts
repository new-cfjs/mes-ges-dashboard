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
    return this.httpClient.get<CarModel[]>(`${this.SERVER_URL}/model?year=${year}&make=${make}`).pipe(take(1), map(makes => makes.sort()));
  }

  public retrieveCarYears(): Observable<number[]> {
    return of(Array.from({length: (2023 - 1995)}, (v, k) => k + 1995).sort((a, b) => b - a));
  }

  public saveTrip(trip: Trip): Observable<void> {
    const formData = new FormData();
    formData.append('email', trip.email);
    formData.append('startLon', trip.startLon+'');
    formData.append('startLat', trip.startLat+'');
    formData.append('destLon', trip.destLon+'');
    formData.append('destLat', trip.destLat+'');
    formData.append('marque_vehicule', trip.marqueVehicule);
    formData.append('modele_vehicule', trip.modeleVehicule);
    formData.append('annee_vehicule', trip.anneeVehicule+'');
    formData.append('temps_auto', trip.tempsAuto+'');
    formData.append('temps_transport_commun', trip.tempsTransportCommun+'');
    formData.append('temps_velo', trip.tempsVelo+'');
    formData.append('temps_marche', trip.tempsMarche+'');
    formData.append('distance_auto', trip.distanceAuto+'');
    formData.append('distance_transport_commun', trip.distanceTransportCommun+'');
    formData.append('distance_velo', trip.distanceVelo+'');
    formData.append('distance_marche', trip.distanceMarche+'');

    return this.httpClient.post<void>(`${this.SERVER_URL}/trip`, formData);
  }
}
