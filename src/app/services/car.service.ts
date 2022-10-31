import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor() { }

  public retrieveCarMakes(): Observable<string[]> {
    return of(['Mazda', 'Honda', 'Toyota']);
  }

  public retrieveCarModels(make: string): Observable<string[]> {
    return make ? of(['Celica', 'Camry', 'Corolla']) : of([]);
  }

  public retrieveCarYears(): Observable<number[]> {
    return of(Array.from({length: (2023 - 1995)}, (v, k) => k + 1995).sort((a, b) => b - a));
  }
}
