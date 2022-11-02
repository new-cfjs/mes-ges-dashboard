import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GesCalculatorQuery} from '../../models/ges-calculator-query.model';
import {MapService} from '../../services/map.service';
import {concat, map, Observable, take} from 'rxjs';
import {MapRoute} from '../../models/map-route.model';
import {Scenario} from '../../models/scenario.model';
import {CarModel} from '../../models/car-model.model';
import TravelMode = google.maps.TravelMode;

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
  // https://www.carbonindependent.org/20.html#:~:text=The%20typical%20bus%20produces%20about,kg%20CO2%20per%20km%20travelled%3F
  private readonly BUS_AVERAGE_CO2_GRAMS_PER_KM = 60;

  private gesCalculatorQuery!: GesCalculatorQuery;
  public scenarios: Scenario[] = [];

  constructor(private route: ActivatedRoute,
              private mapService: MapService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.gesCalculatorQuery = params as GesCalculatorQuery;

      console.log(this.gesCalculatorQuery);

      this.initScenarios();
    });
  }

  private initScenarios() {
    if (!!this.gesCalculatorQuery.originAddress && !!this.gesCalculatorQuery.destinationAddress &&
      JSON.parse(this.gesCalculatorQuery.originAddress) && JSON.parse(this.gesCalculatorQuery.destinationAddress)) {
      // TODO Enum
      if (this.gesCalculatorQuery.transportationMode === 'Voiture' || this.gesCalculatorQuery.transportationMode === 'Covoiturage') {
        concat(
          this.initDrivingScenario(),
          this.initTransitScenario(),
          this.initBikeScenario(),
          this.initWalkingScenario()
        ).subscribe(scenario => this.scenarios.push(scenario))
      }
    }
  }

  public calculateGESInGrams(scenario: Scenario): number {
    let gesInGrams = 0;

    switch (scenario.travelMode) {
      case 'Voiture':
      case 'Covoiturage':
        const carModel: CarModel = JSON.parse(this.gesCalculatorQuery.carModel);

        gesInGrams = Math.round(scenario.route.distanceInMeters / 1000 * carModel.co2GramsPerKm * 100) / 100;
        break;
      case 'Transport en commun':
        // TODO Avoir une moyenne pour le transport en commun global
        gesInGrams = Math.round(scenario.route.distanceInMeters / 1000 * this.BUS_AVERAGE_CO2_GRAMS_PER_KM * 100) / 100;
        break;
      case 'Vélo':
        gesInGrams = 0;
        break;
      case 'Marche':
        gesInGrams = 0;
        break;
    }

    return gesInGrams;
  }

  public annualize(routeValue: number): number {
    return routeValue * this.TWICE_PER_DAY * this.NUMBER_WORKING_DAYS;
  }

  private initDrivingScenario(): Observable<Scenario> {
    return this.mapService.getDirections(
      JSON.parse(this.gesCalculatorQuery.originAddress),
      JSON.parse(this.gesCalculatorQuery.destinationAddress),
      TravelMode.DRIVING
    ).pipe(
      take(1),
      map(result => this.mapToMapRoute(result)),
      map(route => {
        return {
          travelMode: 'Voiture',
          travelIcon: 'directions_car',
          route
        };
      })
    );
  }

  private initTransitScenario(): Observable<Scenario> {
    return this.mapService.getDirections(
      JSON.parse(this.gesCalculatorQuery.originAddress),
      JSON.parse(this.gesCalculatorQuery.destinationAddress),
      TravelMode.TRANSIT
    ).pipe(
      take(1),
      map(result => this.mapToMapRoute(result)),
      map(route => {
        return {
          travelMode: 'Transport en commun',
          travelIcon: 'directions_bus',
          route
        };
      })
    );
  }

  private initBikeScenario(): Observable<Scenario> {
    return this.mapService.getDirections(
      JSON.parse(this.gesCalculatorQuery.originAddress),
      JSON.parse(this.gesCalculatorQuery.destinationAddress),
      TravelMode.BICYCLING
    ).pipe(
      take(1),
      map(result => this.mapToMapRoute(result)),
      map(route => {
        return {
          travelMode: 'Vélo',
          travelIcon: 'directions_bike',
          route
        };
      })
    );
  }

  private initWalkingScenario(): Observable<Scenario> {
    return this.mapService.getDirections(
      JSON.parse(this.gesCalculatorQuery.originAddress),
      JSON.parse(this.gesCalculatorQuery.destinationAddress),
      TravelMode.WALKING
    ).pipe(
      take(1),
      map(result => this.mapToMapRoute(result)),
      map(route => {
        return {
          travelMode: 'Marche',
          travelIcon: 'directions_walk',
          route
        };
      }),
    );
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
}
