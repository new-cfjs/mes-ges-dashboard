import {CarModel} from './car-model.model';
import {Place} from './place.model';

export interface GesCalculatorQuery {
  originAddress: Place;
  destinationAddress: Place;
  transportationMode: string;
  carModel: CarModel;
  publicTransitDepartTime: string;
  publicTransitMaximumTime: string;
  publicTransitMaximumTransfers: string;
}
