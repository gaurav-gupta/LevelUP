import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ChangeHeaderService {
    private subject = new Subject<any>();

    changeHeader(user) {
        this.subject.next({ currentUser: user });
    }

    getUser(): Observable<any> {
        return this.subject.asObservable();
    }
}