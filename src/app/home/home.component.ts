import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { CrudService } from '../services/crud.service';
import { Router } from '@angular/router';
import { AlertsService } from 'angular-alert-module';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  closeResult: string;
  registerForm: FormGroup;
  submitted = false;
  message;
  msg;
  numbers = 1000100101;
  loginForm: FormGroup;
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
    private crudService: CrudService, private router: Router, private alerts: AlertsService,
    public spinner: NgxSpinnerService) { }

  ngOnInit() {
    console.log(1);

    /** spinner starts on init */
    this.spinner.show();
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);

    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      accountNumber: ['', Validators.required],
      hobby: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      address: ['', Validators.required],
      bankName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // confirmPassword: ['', Validators.required]
    }, {
        //  validator: MustMatch('password', 'confirmPassword')
      });

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required, Validators.email],
      password: ['', Validators.required]
    });

    const a = document.querySelector('.toggle-off');
    setInterval(() => {
      a.classList.toggle('toggle-off');
    }, 8000);
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    console.log('submitted');

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      if (this.f.firstname.invalid) {
        this.message = 'Invalid firstname, Fields mark with * are compulsory';
        this.msg = 'invalid-feedback';
        return;
      }
      if (this.f.lastname.invalid) {
        this.message = 'Invalid lastname, Fields mark with * are compulsory';
        this.msg = 'invalid-feedback';
        return;
      }
      if (this.f.email.invalid) {
        this.message = 'Invalid Email, Fields mark with * are compulsory';
        this.msg = 'invalid-feedback';
        return;
      }
      if (this.f.accountNumber.invalid) {
        this.message = 'Invalid account number, Fields mark with * are compulsory';
        this.msg = 'invalid-feedback';
        return;
      }
      if (this.f.hobby.invalid) {
        this.message = 'Invalid hobby, Fields mark with * are compulsory';
        this.msg = 'invalid-feedback';
        return;
      }
      if (this.f.dateOfBirth.invalid) {
        this.message = 'Invalid date of birth, must be at least 18 , Fields mark with * are compulsory';
        this.msg = 'invalid-feedback';
        return;
      }
      if (this.f.address.invalid) {
        this.message = 'Invalid address, Fields mark with * are compulsory';
        this.msg = 'invalid-feedback';
        return;
      }
      if (this.f.bankName.invalid) {
        this.message = 'Invalid bank name, Fields mark with * are compulsory';
        this.msg = 'invalid-feedback';
        return;
      }
      if (this.f.password.invalid) {
        this.message = 'Invalid password, must be at least 6 character, Fields mark with * are compulsory';
        this.msg = 'invalid-feedback';
        return;
      }

      return;
    }
    console.log(this.f.dateOfBirth.value);
    const dob = this.f.dateOfBirth.value.substring(0, 4);
    const d = new Date();
    const age = d.getFullYear() - dob;
    if (age < 18) {
      console.log('age cant be 18');
      this.message = 'User must be atleast 18 years old';
      this.alerts.setMessage('User must be atleast 18 years old', 'error');
      return;
    }
    const data = this.registerForm.value;
    data.id = 0;

    console.log(data);

    this.crudService.saveData('users', data, 0)
      .subscribe((e: any) => {
        console.log(e);
        const stat = parseInt(e.status);
        if (stat === 2) {
          this.message = 'Email already exist, please Login';
        } else if (stat === 1) {
          this.message = 'Successful, Confirmation Link Has Been Sent to Your Email';
          this.alerts.setMessage('Successful Registration', 'success');
        }

      });
  }

  login() {
    this.crudService.login(this.loginForm.controls.username.value, this.loginForm.controls.password.value)
      .subscribe((response: any) => {
        console.log(response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        this.router.navigate(['/home']);
        console.log(response);

      },
        (err: any) => {
          console.log(err);
          //   this.isLoginError = true;
          this.alerts.setMessage('Invalid username or password', 'error');
        });
  }

  /**
   * Check if user is logged in
   */
  loggedIn() {
    return !localStorage.getItem('token');
  }
}
