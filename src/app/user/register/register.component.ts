import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private auth: AngularFireAuth) {}

  inSubmission = false;

  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  age = new FormControl('', [
    Validators.required,
    Validators.min(18),
    Validators.max(80),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  ]);
  confirm_password = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(12),
    Validators.maxLength(12),
  ]);
  showAlert = false;
  alertMsg = 'Please wait, your account is being created.';
  alertColor = 'blue';

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phoneNumber: this.phoneNumber,
  });

  async register() {
    this.showAlert = true;
    this.alertMsg = 'Please wait, your account is being created.';
    this.alertColor = 'blue';
    this.inSubmission = true

    const { email, password } = this.registerForm.value;

    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(
        email as string,
        password as string
      );
      console.log(userCredential)
    } catch (error) {
      console.error(error);

      this.alertMsg = 'An unexpected error occured, please try again';
      this.alertColor = 'red';
      this.inSubmission = false;
      return
    }
    this.alertMsg = 'Success! Your Account has been created';
    this.alertColor = 'green';
  }
}
