export interface Trip {
  email: string;
  startLon: number;
  startLat: number;
  destLon: number;
  destLat: number;
  marqueVehicule: string;
  modeleVehicule: string;
  anneeVehicule: number;
  tempsAuto: number;
  tempsTransportCommun: number;
  tempsVelo: number;
  tempsMarche: number;
  distanceAuto: number;
  distanceTransportCommun: number;
  distanceVelo: number;
  distanceMarche: number;
}
