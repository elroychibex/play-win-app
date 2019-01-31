import { Component, OnInit } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { odometerOptions } from './odometer/odometer';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

declare var window: any;


@Component({
  selector: 'app-dashboardside',
  templateUrl: './dashboardside.component.html',
  styleUrls: ['./dashboardside.component.css', './odometer/odometer-theme-slot-machine.css']
})
export class DashboardsideComponent implements OnInit {
  number1;
  number2;
  number3;
  number4;
  number5;
  amount;
  selectedNumber = 0;
  showSpin = false;
  showMeter = false;
  playText = 'PLAY';
  isPlayed = false;



  constructor(private crudService: CrudService, private spinner: NgxSpinnerService, private location: Location, private router: Router) {

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
      }
    });
  }

  ngOnInit() {
    setTimeout(function () {
      const win = window;
      this.number1 = 1000100001;
      this.number2 = 1000100001;
      this.number3 = 1000100001;
      this.number4 = 1000100001;
      this.selectedNumber = 0;
      this.showSpin = false;
      this.showMeter = false;
      this.playText = 'PLAY';
      this.isPlayed = false;

      win.odometerOptions = {
        auto: false, // Don't automatically initialize everything with class 'odometer'
        //   selector: '.my-numbers', // Change the selector used to automatically find things to be animated
        format: '(,ddd).dd', // Change how digit groups are formatted, and how many digits are shown after the decimal point
        duration: 6000, // Change how long the javascript expects the CSS animation to take
        // theme: 'car', // Specify the theme (if you have more than one theme css file on the page)
        animation: 'count' // Count is a simpler animation method which just increments the value,
        // use it when you're looking for something more subtle.
      };
    }, 2000);


  }

  selectAmount(event) {
    this.amount = event.target.value;
    this.showSpin = true;

  }

  getValues() {
    this.spinner.show();
    this.crudService.findData('userplays/getplaydigits')
      .then((e: any) => {
        console.log(e);
        setTimeout(() => {
          this.number1 = e.number1;
          this.number2 = e.number2;
          this.number3 = e.number3;
          this.number4 = e.number4;
          /** spinner ends after 5 seconds */
          this.spinner.hide();
        }, 3000);
      },
        error => {

          this.spinner.hide();
          Swal('Oops...', 'Sorry error occured, or unauthorize user', 'error');
        });
  }
  // playMeter() {
  //   // this.showMeter = true;
  //   if (this.selectedNumber !== 0) {

  //   } else {
  //     Swal('Oops...', 'Please select card first', 'error');
  //   }

  // }

  chooseBox(number) {
    this.showMeter = true;
    this.selectedNumber = number;
    console.log(number);
  }

  PlayGame() {
    if (this.playText !== 'PLAY AGAIN') {
      this.playMeter();
    } else {
      this.ngOnInit();
    }
  }

  playSlotAudio() {
    const audio = new Audio();
    audio.src = '../../assets/audio/slot-machine.mp3';
    audio.load();
    audio.play();
  }
  playNoWinAudio() {
    const audio = new Audio();
    audio.src = '../../assets/audio/no-win.mp3';
    audio.load();
    audio.play();
  }

  playWinAudio() {
    const audio = new Audio();
    audio.src = '../../assets/audio/winning-sound.mp3';
    audio.load();
    audio.play();
  }

  playMeter() {
    if (this.selectedNumber !== 0) {
      if (this.selectedNumber !== 1000100001) {

        Swal({
          title: 'Ready to play?',
          text: 'You selected ' + this.selectedNumber + ' with amount of ' + this.amount,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, Play',
          cancelButtonText: 'Nope! not ready'
        }).then((result) => {
          this.isPlayed = true;
          if (result.value) {
            const playParam = {
              'amount': this.amount,
              'number': this.selectedNumber,
              'player': localStorage.getItem('token')
            };
            console.log(playParam);
            this.playSlotAudio();

            this.crudService.PostData('userplays', playParam)
              .then((e: any) => {
                console.log(e);
                const d = this;
                setTimeout(function () {
                  const odometer1 = document.getElementById('odometer1');
                  const ser = d.getDisplayNumber(e.code);
                  odometer1.innerHTML = ser + '';
                }, 3000);

                setTimeout(function () {
                  if (e.code === 0) {
                    Swal(e.message, 'Whaooooo');
                    d.playWinAudio();
                  } else {
                    Swal(e.message, 'Please try again');
                    d.playNoWinAudio();
                  }
                }, 5000);


              });



            // For more information about handling dismissals please visit
            // https://sweetalert2.github.io/#handling-dismissals
          } else if (result.dismiss === Swal.DismissReason.cancel) {

          }
          this.playText = 'PLAY AGAIN';
        });

      } else {
        Swal('Oops...', 'Please reshuffle cards', 'error');
      }
    } else {
      Swal('Oops...', 'Please select card first', 'error');
    }

  }

  getDisplayNumber(code) {
    let displayNumber = 0;
    if (code === 0) {
      displayNumber = this.selectedNumber;
    } else if (code === 1) {

      const noWinNumbers = [];
      const numArray = [this.number1, this.number2, this.number3];
      numArray.forEach(num => {
        if (this.selectedNumber !== num) {
          noWinNumbers.push(num);
        }
      });
      displayNumber = noWinNumbers[Math.floor(Math.random() * noWinNumbers.length)];
    } else {
      displayNumber = 10000000001;
    }
    return displayNumber;
  }
}
