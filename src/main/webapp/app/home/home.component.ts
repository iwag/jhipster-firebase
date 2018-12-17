import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { AngularFireAuth } from '@angular/fire/auth';
import { app } from 'firebase/auth';

import { LoginModalService, Principal, Account } from 'app/core';
import { auth } from 'firebase';
import { async } from 'rxjs/internal/scheduler/async';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;

    constructor(public afAuth: AngularFireAuth, private loginModalService: LoginModalService, private eventManager: JhiEventManager) {}

    ngOnInit() {
        // this.principal.identity().then(account => {
        //     this.account = account;
        // });
        // this.registerAuthenticationSuccess();
        this.afAuth.user.subscribe(user => {
            if (user != null) this.account = new Account(true, [], user.email, user.displayName, 'en', '', user.displayName, '');
        });
    }

    isAuthenticated() {
        return this.account != null;
    }

    login() {
        //this.modalRef = this.loginModalService.open();
        let provider = new auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        this.afAuth.auth.signInWithPopup(provider).then(res => {
            if (res.user != null)
                this.account = new Account(true, [], res.user.email, res.user.displayName, 'en', '', res.user.displayName, '');
        });
    }

    logout() {
        this.afAuth.auth.signOut().then(() => {
            this.account = null;
        });
    }
}
