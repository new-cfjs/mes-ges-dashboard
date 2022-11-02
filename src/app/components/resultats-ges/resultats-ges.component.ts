import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GesCalculatorQuery} from '../../models/ges-calculator-query.model';
import {MapService} from '../../services/map.service';
import {map, take, tap} from 'rxjs';
import TravelMode = google.maps.TravelMode;
import {MapRoute} from '../../models/map-route.model';
import {Scenario} from '../../models/scenario.model';
import {CarModel} from '../../models/car-model.model';

@Component({
  selector: 'app-resultats-ges',
  templateUrl: './resultats-ges.component.html',
  styleUrls: ['./resultats-ges.component.scss']
})
export class ResultatsGESComponent implements OnInit {
  private readonly NUMBER_STAT_HOLIDAYS = 11;
  private readonly NUMBER_HOLIDAYS = 10;
  public readonly NUMBER_WORKING_DAYS = 52 * 5 - this.NUMBER_STAT_HOLIDAYS - this.NUMBER_HOLIDAYS;
  private readonly TWICE_PER_DAY = 2;

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
      distanceInMeters: firstRoute.distance!.value,
      durationText: firstRoute.duration!.text,
      durationInSeconds: firstRoute.duration!.value
    } as MapRoute;
  }

  public calculateGESInGrams(route: MapRoute): number {
    const carModel: CarModel = JSON.parse(this.gesCalculatorQuery.carModel);

    return Math.round(route.distanceInMeters / 1000 * carModel.co2GramsPerKm * 100) / 100;
  }

  public annualize(routeValue: number): number {
    return routeValue * this.TWICE_PER_DAY * this.NUMBER_WORKING_DAYS;
  }
}
