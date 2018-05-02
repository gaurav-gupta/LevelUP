import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { CodeConstants } from '../../code_constant';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
    selector: 'app-transaction',
    templateUrl: './transaction.component.html',
    styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
    transactions: any;
    priceDecimalValue: any;
    constructor(private _transactionService: TransactionService, private _flashMessagesService: FlashMessagesService) {
        this.getTransactionLogs();
    }

    ngOnInit() {
    }

    getTransactionLogs() {
        this._transactionService.getUserTransactions().subscribe(res => {
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
