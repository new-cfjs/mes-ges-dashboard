import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GeoCodingService} from '../../services/geo-coding.service';
import {debounceTime, Observable, take} from 'rxjs';
import {Place} from '../../models/place.model';
import {CarService} from '../../services/car.service';
import {MatSelectChange} from '@angular/material/select';
import {GesCalculatorService} from '../../services/ges-calculator.service';
import {GesCalculatorQuery} from '../../models/ges-calculator-query.model';
import {Router} from '@angular/router';
import {CarModel} from '../../models/car-model.model';

@Component({
  selector: 'app-calculateur-form',
  templateUrl: './calculateur-form.component.html',
  styleUrls: ['./calculateur-form.component.scss']
})
export class CalculateurFormComponent implements OnInit {

  public gesForm!: FormGroup;
  public originAddressResults!: Place[];
  public destinationAddressResults!: Place[];
  public transportationModes = ['Voiture', 'Covoiturage', 'Transport en commun', 'Vélo', 'Marche'];
  public carMakes$!: Observable<string[]>;
  public carModels$!: Observable<CarModel[]>;

  constructor(private fb: FormBuilder,
              private geoCodingService: GeoCodingService,
              public carService: CarService,
              private gesCalculatorService: GesCalculatorService,
              private router: Router) { }

  ngOnInit(): void {
    this.gesForm = this.fb.group({
      originAddressCtrl: [''],
      destinationAddressCtrl: [''],
      transportationModeCtrl: [''],
      carFormGroup: this.fb.group({
        yearCtrl: [''],
        makeCtrl: [''],
        modelCtrl: ['']
      }),
      publicTransitGroup: this.fb.group({
        departTimeCtrl: [''],
        maximumTimeCtrl: [''],
        maximumTransfersCtrl: ['']
      })
    });

    this.initAutocomplete();
    this.initCarMakes();
  }

  private initAutocomplete() {
    this.gesForm.get('originAddressCtrl')?.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(address => {
      if (address.length > 3) {
        this.geoCodingService.geoCode(address).pipe(take(1)).subscribe(results => {
          this.originAddressResults = results;
        });
      } else {
        this.originAddressResults = [];
      }
    });

    this.gesForm.get('destinationAddressCtrl')?.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(address => {
      if (address.length > 3) {
        this.geoCodingService.geoCode(address).pipe(take(1)).subscribe(results => {
          this.destinationAddressResults = results;
        });
      } else {
        this.destinationAddressResults = [];
      }
    });
  }

  public addressDisplayFn(address: Place): string {
    return address ? address.name : '';
  }

  public loadCarModels(): void {
    this.carModels$ = this.carService.retrieveCarModels(this.gesForm.get('carFormGroup.yearCtrl')!.value, this.gesForm.get('carFormGroup.makeCtrl')!.value);
  }

  public calculateGES(): void {
    const request = {
      originAddress: JSON.stringify(this.gesForm.get('originAddressCtrl')!.value),
      destinationAddress: JSON.stringify(this.gesForm.get('destinationAddressCtrl')!.value),
      transportationMode: this.gesForm.get('transportationModeCtrl')!.value,
      carModel: JSON.stringify(this.gesForm.get('carFormGroup.modelCtrl')!.value),
      publicTransitDepartTime: this.gesForm.get('publicTransitGroup.departTimeCtrl')!.value,
      publicTransitMaximumTime: this.gesForm.get('publicTransitGroup.maximumTimeCtrl')!.value,
      publicTransitMaximumTransfers: this.gesForm.get('publicTransitGroup.maximumTransfersCtrl')!.value
    } as GesCalculatorQuery;

    this.gesCalculatorService.calculateGES(request).subscribe(_ => {
      this.router.navigate(['/results'], { queryParams: {...request} });
    });
  }

  private initCarMakes() {
    this.carMakes$ = this.carService.retrieveCarMakes();
  }
}
