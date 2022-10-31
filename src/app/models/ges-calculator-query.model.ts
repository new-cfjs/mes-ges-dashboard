import {Place} from './place.model';

export interface GesCalculatorQuery {
  startAddress: Place;
  endAddress: Place;
  transportationMode: string;
  carYear: number;
  carMake: string;
  carModel: string;
  // TODO moment ?
  publicTransitDepartTime: string;
  publicTransitMaximumTime: string;
  publicTransitMaximumTransfers: string;
}
