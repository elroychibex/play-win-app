import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from '../services/crud.service';
import { NgxSoapService, Client, ISoapMethodResponse } from 'ngx-soap';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  closeResult;
  balance;
  client: Client;
  message;
  amount;
  transactionRef;
  email;

  constructor(private modalService: NgbModal, private crudService: CrudService) {
    console.log(this.email)
    this.crudService.findData('users/finduser')
      .then((e: any) => {
        console.log(e)
        this.email = e.email;
        console.log(this.email)
      }).catch(e => {
        console.log(e);

      });
    this.email = localStorage.getItem('username');

  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  ngOnInit() {
    this.callBal();

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

  callBal() {
    this.crudService.findData('userplays/useraccount')
      .then((e: any) => {
        this.balance = e.balance;
        console.log(e);
      });
  }

  createTransaction() {
    const amt = (<HTMLInputElement>document.getElementById('amountpay')).value;
    const data = {
      amount: amt
    };
    this.crudService.PostData('transaction/transref', data)
      .then((e: any) => {
        console.log('data is passed: ', e);
        if (e.ref != null) {
          this.amount = e.amount * 100;
          this.transactionRef = e.ref;
          this.email = e.email;
          console.log('Amount: ', this.amount, " REF: ", this.transactionRef, " email: ", this.email);
          (<HTMLInputElement>document.getElementById('invokepay')).click();
        }
      });

  }

  paymentSucceed(response) {
    console.log(response);
    /**
     * message: "Approved"
    reference: "5708-1551768902677"
    status: "success"
    trans: "124266844"
    transaction: "124266844"
    trxref: "5708-1551768902677"
     */
    if (response.status == 'success') {

      const data = {
        transactionRef: response.reference,
        merchantId: response.trans,
        amount: this.amount
      }
      console.log(data);
      this.crudService.PostData('transaction/proccesspayment', data).then((e: any) => {
        console.log(e)
        if (e.status == 0) {
          window.location.href = '/home/accounts';
        }
      })
        .catch(e => {

        });
    }
  }



  paymentFailed(response) {
    console.log(response);
  }
  paymentCancel(){
  alert('payment cancelled');
  }
}
