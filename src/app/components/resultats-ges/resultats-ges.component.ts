import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GesCalculatorQuery} from '../../models/ges-calculator-query.model';
import {MapService} from '../../services/map.service';
import {concat, map, Observable, take, tap} from 'rxjs';
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
  private readonly NUMBER_HOLIDAYS = 20;
  public readonly NUMBER_WORKING_DAYS = 52 * 5 - this.NUMBER_STAT_HOLIDAYS - this.NUMBER_HOLIDAYS;
  private readonly TWICE_PER_DAY = 2;
  // https://www.bikeradar.com/features/long-reads/cycling-environmental-impact/
  private readonly BUS_AVERAGE_CO2_GRAMS_PER_KM = 0; //101;
  // https://www.bikeradar.com/features/long-reads/cycling-environmental-impact/
  private readonly BIKE_AVERAGE_CO2_GRAMS_PER_KM = 0; //21;

  private gesCalculatorQuery!: GesCalculatorQuery;
  public scenarios: Scenario[] = [];

  constructor(private route: ActivatedRoute,
              private mapService: MapService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.gesCalculatorQuery = JSON.parse(params['request']) as GesCalculatorQuery;

      console.log(this.gesCalculatorQuery);

      this.initScenarios();
    });
  }

  private initScenarios() {
    if (!!this.gesCalculatorQuery.originAddress && !!this.gesCalculatorQuery.destinationAddress &&
      this.gesCalculatorQuery.originAddress && this.gesCalculatorQuery.destinationAddress) {
      // TODO Enum
      const scenarios$ = [];
      if (this.gesCalculatorQuery.transportationMode === 'Voiture' || this.gesCalculatorQuery.transportationMode === 'Covoiturage') {
        scenarios$.push(
          this.initDrivingScenario()
        )
      }
      scenarios$.push(
        this.initTransitScenario(),
        this.initBikeScenario(),
        this.initWalkingScenario()
      );
      concat(...scenarios$).subscribe(scenario => this.scenarios.push(scenario))
    }
  }

  public calculateGESInGrams(scenario: Scenario): number {
    let gesInGrams = 0;

    switch (scenario.travelMode) {
      case 'Voiture':
        // TODO Diviser par 2 pour Covoiturage ?
      case 'Covoiturage':
        const carModel: CarModel = this.gesCalculatorQuery.carModel;

        gesInGrams = Math.round(scenario.route.distanceInMeters / 1000 * carModel.co2GramsPerKm * 100) / 100;
        break;
      case 'Transport en commun':
        // TODO Extraire les différents types de routes et calculer le GES pour chacunes (ex: walking + transite + walking)
        // TODO Avoir une moyenne pour le transport en commun global
        gesInGrams = Math.round(scenario.route.distanceInMeters / 1000 * this.BUS_AVERAGE_CO2_GRAMS_PER_KM * 100) / 100;
        break;
      case 'Vélo':
        gesInGrams = Math.round(scenario.route.distanceInMeters / 1000 * this.BIKE_AVERAGE_CO2_GRAMS_PER_KM * 100) / 100;
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
    return this.mapService.getDirections({
      origin: this.gesCalculatorQuery.originAddress,
      destination: this.gesCalculatorQuery.destinationAddress,
      travelMode: TravelMode.DRIVING
    }).pipe(
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
    return this.mapService.getDirections({
      origin: this.gesCalculatorQuery.originAddress,
      destination: this.gesCalculatorQuery.destinationAddress,
      travelMode: TravelMode.TRANSIT,
      transitOptions: {
        departureTime: new Date(this.gesCalculatorQuery.publicTransitDepartTime)
      }
    }).pipe(
      take(1),
      tap(x => console.log(x)),
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
    return this.mapService.getDirections({
      origin: this.gesCalculatorQuery.originAddress,
      destination: this.gesCalculatorQuery.destinationAddress,
      travelMode: TravelMode.BICYCLING
    }).pipe(
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
    return this.mapService.getDirections({
      origin: this.gesCalculatorQuery.originAddress,
      destination: this.gesCalculatorQuery.destinationAddress,
      travelMode: TravelMode.WALKING
    }).pipe(
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
    const firstRoute = result.routes[0]?.legs[0];
    return {
      // TODO
      travelMode: TravelMode.DRIVING,
      distanceText: firstRoute ? firstRoute.distance!.text : 'N/A',
      distanceInMeters: firstRoute ? firstRoute.distance!.value : 0,
      durationText: firstRoute ? firstRoute.duration!.text : 'N/A',
      durationInSeconds: firstRoute ? firstRoute.duration!.value : 0
    } as MapRoute;
  }
}
