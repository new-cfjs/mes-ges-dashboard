import { Component, OnInit } from '@angular/core';
import {Form, FormBuilder, FormGroup} from '@angular/forms';
import {GeoCodingService} from '../../services/geo-coding.service';
import {debounceTime, take} from 'rxjs';
import {Place} from '../../models/place.model';

@Component({
  selector: 'app-calculateur-form',
  templateUrl: './calculateur-form.component.html',
  styleUrls: ['./calculateur-form.component.scss']
})
export class CalculateurFormComponent implements OnInit {

  public gesForm!: FormGroup;
  public startAddressResults!: Place[];
  public endAddressResults!: Place[];

  constructor(private fb: FormBuilder,
              private geoCodingService: GeoCodingService) { }

  ngOnInit(): void {
    this.gesForm = this.fb.group({
      startAddressCtrl: [''],
      endAddressCtrl: ['']
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
}
