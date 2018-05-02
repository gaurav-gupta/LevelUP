import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { CodeConstants } from '../../code_constant';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    transactions: any;
    priceDecimalValue: any;
    constructor(private _transactionService: TransactionService, private _flashMessagesService: FlashMessagesService) {
        this.getTransactionLogs();
    }

    ngOnInit() {
    }

    getTransactionLogs() {
        this._transactionService.getTransactions().subscribe(res => {
            console.log('response >>>...in side of home page...........', res);
            if (res.length > 0) {
                this.transactions = res;
                this.priceDecimalValue = CodeConstants.DECIMAL;
            } else {
                this._flashMessagesService.show('No Transaction Placed Yet !!', { cssClass: 'alert-success',
                timeout: 4000, showCloseBtn: true });
            }
        });
    }
}
