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
}
