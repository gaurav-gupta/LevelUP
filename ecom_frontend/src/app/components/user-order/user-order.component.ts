import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { UserService } from '../../services/users.service';
import { StorageService } from '../../services/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CodeConstants } from '../../code_constant';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ISubscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-user-order',
    templateUrl: './user-order.component.html',
    styleUrls: ['./user-order.component.css']
})

export class UserOrderComponent implements OnInit , OnDestroy {
    data: any[];
    userdata: any;
    priceDecimalValue: any;
    private subscription: ISubscription;
    constructor(private route: ActivatedRoute, private router: Router, private _userService: UserService,
        private _storeService: StorageService, private _flashMessagesService: FlashMessagesService,
        private changeDetectorRef: ChangeDetectorRef) { }

        ngOnInit() {
            this.getUserOrder();
        }

        getUserOrder() {
            const currentUser = JSON.parse(localStorage.getItem('current_user'));
            this.subscription = this._userService.getUserByEmail(currentUser.email).subscribe(res1 => {
                this.userdata = res1[0];
                this.subscription =  this._userService.getUserOrder(this.userdata._id).subscribe(response => {
                    if (response.length > 0) {
                        this.data = response;
                        this.priceDecimalValue = CodeConstants.DECIMAL;
                    } else {
                        this._flashMessagesService.show('No Orders Placed Yet !!', { cssClass: 'alert-success',
                        timeout: 4000, showCloseBtn: true });
                    }
                     this.changeDetectorRef.detectChanges();
                });
                 this.changeDetectorRef.detectChanges();
            });
        }

        ngOnDestroy() {
            this.subscription.unsubscribe();
            this.changeDetectorRef.detach();
        }

    }
