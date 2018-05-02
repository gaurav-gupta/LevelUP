import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { CodeConstants } from '../../code_constant';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
	transactions: any;
	priceDecimalValue: any;
  	constructor(private _transactionService: TransactionService) { 
  		this.getTransactionLogs();
  	}

  	ngOnInit() {
  	}

  	getTransactionLogs(){
		this._transactionService.getUserTransactions().subscribe(res => {
		    this.transactions = res;
		    this.priceDecimalValue = CodeConstants.DECIMAL;
		});
	}
}
