import {Place} from './place.model';

export interface DirectionsRequest {
  origin: Place;
  destination: Place;
  travelMode: google.maps.TravelMode;
  transitOptions?: google.maps.TransitOptions;
}
