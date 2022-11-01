export interface GesCalculatorQuery {
  originAddress: string;
  destinationAddress: string;
  transportationMode: string;
  carYear: number;
  carMake: string;
  carModel: string;
  publicTransitDepartTime: string;
  publicTransitMaximumTime: string;
  publicTransitMaximumTransfers: string;
}
