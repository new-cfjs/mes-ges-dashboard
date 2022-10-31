import { Injectable } from '@angular/core';
import {GesCalculatorQuery} from '../models/ges-calculator-query.model';

@Injectable({
  providedIn: 'root'
})
export class GesCalculatorService {

  constructor() { }

  calculateGES(request: GesCalculatorQuery) {
    // TODO
    console.log(request);
  }
}
