import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GesCalculatorQuery} from '../../models/ges-calculator-query.model';
import {MapService} from '../../services/map.service';
import {map, take, tap} from 'rxjs';
import TravelMode = google.maps.TravelMode;
import {MapRoute} from '../../models/map-route.model';
import {Scenario} from '../../models/scenario.model';

@Component({
  selector: 'app-resultats-ges',
  templateUrl: './resultats-ges.component.html',
  styleUrls: ['./resultats-ges.component.scss']
})
export class ResultatsGESComponent implements OnInit {
  private gesCalculatorQuery!: GesCalculatorQuery;
  public scenarios: Scenario[] = [];

  constructor(private route: ActivatedRoute,
              private mapService: MapService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.gesCalculatorQuery = params as GesCalculatorQuery;

      console.log(this.gesCalculatorQuery);

      if (!!this.gesCalculatorQuery.originAddress && !!this.gesCalculatorQuery.destinationAddress &&
        JSON.parse(this.gesCalculatorQuery.originAddress) && JSON.parse(this.gesCalculatorQuery.destinationAddress)) {
        this.mapService.getDirections(
          JSON.parse(this.gesCalculatorQuery.originAddress),
          JSON.parse(this.gesCalculatorQuery.destinationAddress),
          TravelMode.DRIVING
        ).pipe(
          take(1),
          tap(x => console.log(x)),
          map(result => this.mapToMapRoute(result)),
          tap(x => console.log(x))
        ).subscribe(result => this.scenarios.push({
          travelMode: 'Voiture',
          travelIcon: 'directions_car',
          route: result
        }));
      }
    });
  }

  private mapToMapRoute(result: google.maps.DirectionsResult): MapRoute {
    const firstRoute = result.routes[0]!.legs[0]!;
    return {
      // TODO
      travelMode: TravelMode.DRIVING,
      distanceText: firstRoute.distance!.text,
      distanceValueInMeters: firstRoute.distance!.value,
      durationText: firstRoute.duration!.text,
      durationInSeconds: firstRoute.duration!.value
    } as MapRoute;
  }
}
