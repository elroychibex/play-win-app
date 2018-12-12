import { Component, OnInit } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { NgxSpinnerService } from 'ngx-spinner';
// import { odometerOptions } from './odometer/odometer';
import Swal from 'sweetalert2';

declare var window: any;


@Component({
  selector: 'app-dashboardside',
  templateUrl: './dashboardside.component.html',
  styleUrls: ['./dashboardside.component.css', './odometer/odometer-theme-slot-machine.css']
})
export class DashboardsideComponent implements OnInit {
  number1 = 1000100001;
  number2 = 1000100001;
  number3 = 1000100001;
  amount;
  selectedNumber = 0;
  showSpin = false;
  showMeter = false;
  playText = 'PLAY';
  isPlayed = false;



  constructor(private crudService: CrudService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    const win = window;
    this.isPlayed = false;
    this.playText='PLAY';

    // win.odo = {
    //    auto: false, // Don't automatically initialize everything with class 'odometer'
    //   //   selector: '.my-numbers', // Change the selector used to automatically find things to be animated
    //   format: '(,ddd).dd', // Change how digit groups are formatted, and how many digits are shown after the decimal point
    //   duration: 6000, // Change how long the javascript expects the CSS animation to take
    //  // theme: 'car', // Specify the theme (if you have more than one theme css file on the page)
    //   animation: 'count' // Count is a simpler animation method which just increments the value,
    //   // use it when you're looking for something more subtle.
    // };

  }

  selectAmount(event) {
    this.amount = event.target.value;
    this.showSpin = true;

  }

  getValues() {
    this.spinner.show();
    this.crudService.getAll('userplays/getplaydigits/' + localStorage.getItem('username'))
      .subscribe((e: any) => {
        console.log(e);
        setTimeout(() => {
          this.number1 = e.number1;
          this.number2 = e.number2;
          this.number3 = e.number3;
          /** spinner ends after 5 seconds */
          this.spinner.hide();
        }, 5000);
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
    if (!this.isPlayed) {
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
            'player': localStorage.getItem('username')
          };
          console.log(playParam);
          this.playSlotAudio();

          this.crudService.saveData('userplays', playParam, 0)
            .subscribe((e: any) => {
              console.log(e);
              const d = this;
              setTimeout(function () {
                const odometer1 = document.getElementById('odometer1');
                const ser = d.getDisplayNumber(e.code);
                odometer1.innerHTML = ser + '';
              }, 3000);

              setTimeout(function () {
                if (e.code === 1) {
                  Swal(e.message, 'Please try again');
                 d.playNoWinAudio();
                } else {
                  Swal(e.message, 'whaoooo');
                  
                  d.playWinAudio();
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
