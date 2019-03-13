import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { CrudService } from '../services/crud.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  balance;

  constructor(private route: Router, private crudService: CrudService) { }

  ngOnInit() {
    this.callBal();

  }
  callBal() {
    this.crudService.findData('userplays/useraccount')
      .then((e: any) => {
        this.balance = e.balance;
        console.log(e);
      });
  }

  ngAfterViewInit() {
    // loading templates js after dom render
    $('#sidebarCollapse').on('click', function () {
      // open or close navbar
      $('#sidebar').toggleClass('active');
      // close dropdowns
      $('.collapse.in').toggleClass('in');
      // and also adjust aria-expanded attributes we use for the open/closed arrows
      // in our CSS
      $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
  }
  loggout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.clear();
    //this.route.navigate('/');
  }

  gotoDashboard() {
    window.location.href = '/home/dashboard';
  }
}
