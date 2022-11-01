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

@Component({
  selector: 'app-calculateur-form',
  templateUrl: './calculateur-form.component.html',
  styleUrls: ['./calculateur-form.component.scss']
})
export class CalculateurFormComponent implements OnInit {

  public gesForm!: FormGroup;
  public startAddressResults!: Place[];
  public endAddressResults!: Place[];
  public transportationModes = ['Voiture', 'Covoiturage', 'Transport en commun', 'Vélo', 'Marche'];
  public carModels$!: Observable<string[]>;

  constructor(private fb: FormBuilder,
              private geoCodingService: GeoCodingService,
              public carService: CarService,
              private gesCalculatorService: GesCalculatorService,
              private router: Router) { }

  ngOnInit(): void {
    this.gesForm = this.fb.group({
      startAddressCtrl: [''],
      endAddressCtrl: [''],
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
  }

  private initAutocomplete() {
    this.gesForm.get('startAddressCtrl')?.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(address => {
      if (address.length > 3) {
        this.geoCodingService.geoCode(address).pipe(take(1)).subscribe(results => {
          this.startAddressResults = results;
        });
      } else {
        this.startAddressResults = [];
      }
    });

    this.gesForm.get('endAddressCtrl')?.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(address => {
      if (address.length > 3) {
        this.geoCodingService.geoCode(address).pipe(take(1)).subscribe(results => {
          this.endAddressResults = results;
        });
      } else {
        this.endAddressResults = [];
      }
    });
  }

  public addressDisplayFn(address: Place): string {
    return address ? address.name : '';
  }

  public loadCarModels(selectedMake: MatSelectChange): void {
    this.carModels$ = this.carService.retrieveCarModels(selectedMake.value);
  }

  public calculateGES(): void {
    const request = {
      startAddress: this.gesForm.get('startAddressCtrl')!.value,
      endAddress: this.gesForm.get('endAddressCtrl')!.value,
      transportationMode: this.gesForm.get('transportationModeCtrl')!.value,
      carYear: this.gesForm.get('carFormGroup.yearCtrl')!.value,
      carMake: this.gesForm.get('carFormGroup.makeCtrl')!.value,
      carModel: this.gesForm.get('carFormGroup.modelCtrl')!.value,
      publicTransitDepartTime: this.gesForm.get('publicTransitGroup.departTimeCtrl')!.value,
      publicTransitMaximumTime: this.gesForm.get('publicTransitGroup.maximumTimeCtrl')!.value,
      publicTransitMaximumTransfers: this.gesForm.get('publicTransitGroup.maximumTransfersCtrl')!.value
    } as GesCalculatorQuery;

    this.gesCalculatorService.calculateGES(request).subscribe(_ => {
      this.router.navigate(['/results'], { queryParams: {...request} });
    });
  }
}
