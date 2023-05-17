import { ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';

export class RegisterValidators {
  static match(controlName: string, matchingControlName: string): ValidatorFn {
    return (group: AbstractControl) : ValidationErrors | null => {
      const control = group.get('password');
      const matchingContorl = group.get('confirm_password');

      if (!control || !matchingContorl) {
        console.error('form controls cannot be found in the form group')
        return { controlNotFound: false };
      }

      const error =
        control.value === matchingContorl.value ? null : { noMatch: true };

        matchingContorl.setErrors(error)

      return error;
    };
  }
}
