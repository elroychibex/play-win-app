import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboardside',
  templateUrl: './dashboardside.component.html',
  styleUrls: ['./dashboardside.component.css', './odometer/odometer-theme-slot-machine.css']
})
export class DashboardsideComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    setTimeout(function(){
 const odometer1 =   document.getElementById('odometer1');
      odometer1.innerHTML = '4587908658';
      const odometer2 =   document.getElementById('odometer2');
      odometer2.innerHTML = '8987654563';
      const odometer3 =   document.getElementById('odometer3');
      odometer3.innerHTML = '3765890872';
      const odometer4 =   document.getElementById('odometer4');
      odometer4.innerHTML = '2890765381';
  }, 1000);
  }

}
