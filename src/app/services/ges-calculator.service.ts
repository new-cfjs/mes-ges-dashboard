import { Injectable } from '@angular/core';
import {GesCalculatorQuery} from '../models/ges-calculator-query.model';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GesCalculatorService {

  constructor() { }

  calculateGES(request: GesCalculatorQuery): Observable<boolean> {
    // TODO
    // console.log(request);

    return of(true);
  }
}
