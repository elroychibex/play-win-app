import { Component, OnInit } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { provideForRootGuard } from '@angular/router/src/router_module';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  gamePlayed = [];
  transactions;
  constructor(private crudService: CrudService) { }

  ngOnInit() {
    this.findGamePlayed();
    this.findTransactions();
  }

  findGamePlayed() {
    this.crudService.findData('userplays/alluserplay')
      .then((e: any) => {
        e.forEach(elem => {
          this.gamePlayed.push({
            'serial': elem.serial, 'date': elem.date, 'amount': elem.amount,
            'amountWon': elem.amountWon, 'isWon': elem.isWon
          });
        });
      });
  }

  findTransactions() {
    this.crudService.findData('userplays/usertransaction')
      .then((e: any) => {
      this.transactions = e;
      });
  }
}
