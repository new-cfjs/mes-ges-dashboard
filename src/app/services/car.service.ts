import {Injectable} from '@angular/core';
import {Observable, of, take} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CarModel} from '../models/car-model.model';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private readonly SERVER_URL = 'api';

  constructor(private httpClient: HttpClient) { }

  public retrieveCarMakes(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.SERVER_URL}/make`).pipe(take(1));
  }

  public retrieveCarModels(year: string, make: string): Observable<CarModel[]> {
    return this.httpClient.get<CarModel[]>(`${this.SERVER_URL}/model?year=${year}&make=${make}`).pipe(take(1));
  }

  public retrieveCarYears(): Observable<number[]> {
    return of(Array.from({length: (2023 - 1995)}, (v, k) => k + 1995).sort((a, b) => b - a));
  }
}
