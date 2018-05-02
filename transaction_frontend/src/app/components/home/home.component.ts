import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { CodeConstants } from '../../code_constant';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	transactions: any;
	priceDecimalValue: any;
  	constructor(private _transactionService: TransactionService) { 
  		this.getTransactionLogs();
  	}

	ngOnInit() {
	}

	getTransactionLogs(){
		this._transactionService.getTransactions().subscribe(res => {
		    this.transactions = res;
		    this.priceDecimalValue = CodeConstants.DECIMAL;
		});
	}
}
