import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { CrudService } from '../services/crud.service';
import { Router } from '@angular/router';
import { AlertsService } from 'angular-alert-module';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  closeResult: string;
  registerForm: FormGroup;
  submitted = false;
  message;
  msg;

  loginForm: FormGroup;
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
    private crudService: CrudService, private router: Router, private alerts: AlertsService,
    public spinner: NgxSpinnerService) { }

  ngOnInit() {
    console.log(1);
    this.getUser();


    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      accountNumber: ['', Validators.required],
      hobby: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      address: ['', Validators.required],
      bankName: ['', Validators.required],
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
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



  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    console.log('submitted');

    // stop here if form is invalid
 
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
    data.token = localStorage.getItem('token');

    console.log(data);

    this.crudService.saveData('users/updateuser', data, 0)
      .subscribe((e: any) => {
        console.log(e);
        const stat = parseInt(e.status, 0);
        if (stat === 2) {
          this.message = 'Wrong old password, please try again';
        } else if (stat === 1) {
          alert('Update successful');
        }

      });
  }

  /**
   * Check if user is logged in
   */
  loggedIn() {
    return !localStorage.getItem('token');
  }

  /**
   * accountNumber: "09090909"
  address: "FCT ,  Central Business District Abuja"
  bankName: "Standard Chartered"
  dateOfBirth: "1989-07-13"
  datejoined: "2018-12-22T08:50:40Z[UTC]"
  email: "king@yahoo.com"
  firstname: "james"
  hobby: "fonnd"
  id: 9
  isActivated: false
  isSuspended: false
  lastname: "king"
   */

  getUser() {
    this.crudService.findData('users/finduser')
      .then((e: any) => {
        console.log(e);
        this.f.firstname.patchValue(e.firstname);
        this.f.lastname.patchValue(e.lastname);
        this.f.email.patchValue(e.email);
        this.f.accountNumber.patchValue(e.accountNumber);
        this.f.hobby.patchValue(e.hobby);
        this.f.dateOfBirth.patchValue(e.dateOfBirth);
        this.f.address.patchValue(e.address);
        this.f.bankName.patchValue(e.bankName);

      }).catch(e => {
        console.log(e);

      });

  }


}
