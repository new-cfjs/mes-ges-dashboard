import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {filter, map, Observable, tap} from 'rxjs';
import {Place} from '../models/place.model';
import {NominatimResponse} from '../models/nominatim-response.model';

@Injectable({
  providedIn: 'root'
})
export class GeoCodingService {
  private readonly COUNTRY_CODES = 'ca';
  private readonly STATES = 'Quebec';

  constructor(private httpClient: HttpClient) { }

  public geoCode(address: string): Observable<Place[]> {
    return this.httpClient.get<NominatimResponse[]>(`https://nominatim.openstreetmap.org/search?q=${address}&format=jsonv2&countrycodes=${this.COUNTRY_CODES}&state=${this.STATES}&limit=5`).pipe(
      tap(response => console.log(response)),
      filter(response => !!(response as any).length),
      map(responses => responses.map(response => {
          return {
            lat: response.lat,
            lon: response.lon,
            name: response.display_name
          };
        })
      )
    );
  }
}
