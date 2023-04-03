import {Directive} from '@angular/core';
import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";


@Directive({
  selector: '[appPaswordMatch]'
})
export class PasswordMatchDirective {

  constructor() {
  }

  static passwordMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): Promise<ValidationErrors | null> => {
      return new Promise((resolve, reject) => {
        const control = formGroup.parent?.get(controlName);
        const matchingControl = formGroup.parent?.get(matchingControlName);

        if (control?.value !== matchingControl?.value) {
          matchingControl?.setErrors({equalValidator: true});
          resolve({equalValidator: true});
        } else {
          matchingControl?.setErrors(null);
          resolve(null);
        }
      });
    }
  }
}
