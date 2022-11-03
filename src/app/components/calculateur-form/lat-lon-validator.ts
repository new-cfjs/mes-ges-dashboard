import {AbstractControl, ValidationErrors} from '@angular/forms';

export function latlonValidator(control: AbstractControl): ValidationErrors | null {
  return control.value?.lat && control.value?.lon ? null : {missingLatLon: {value: control.value}};
}
