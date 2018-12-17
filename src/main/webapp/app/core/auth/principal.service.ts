import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AccountService } from './account.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Account } from '../user/account.model';

@Injectable({ providedIn: 'root' })
export class Principal {
    private userIdentity: any;
    private authenticated = false;
    private authenticationState = new Subject<any>();

    constructor(private afAuth: AngularFireAuth) {}

    authenticate(identity) {
        this.userIdentity = identity;
        this.authenticated = identity !== null;
        this.authenticationState.next(this.userIdentity);
    }

    hasAnyAuthority(authorities: string[]): Promise<boolean> {
        return Promise.resolve(this.hasAnyAuthorityDirect(authorities));
    }

    hasAnyAuthorityDirect(authorities: string[]): boolean {
        if (!this.authenticated || !this.userIdentity || !this.userIdentity.authorities) {
            return false;
        }

        for (let i = 0; i < authorities.length; i++) {
            if (this.userIdentity.authorities.includes(authorities[i])) {
                return true;
            }
        }

        return false;
    }

    hasAuthority(authority: string): Promise<boolean> {
        if (!this.authenticated) {
            return Promise.resolve(false);
        }

        return this.identity().then(
            id => {
                return Promise.resolve(id.authorities && id.authorities.includes(authority));
            },
            () => {
                return Promise.resolve(false);
            }
        );
    }

    identity(force?: boolean): Promise<any> {
        if (force === true) {
            this.userIdentity = undefined;
        }

        // check and see if we have retrieved the userIdentity data from the server.
        // if we have, reuse it by immediately resolving
        if (this.userIdentity) {
            return Promise.resolve(this.userIdentity);
        }

        if (this.afAuth.auth.currentUser) {
            const user = this.afAuth.auth.currentUser;
            const account = new Account(true, ['ROLE_USER'], user.email, user.displayName, 'en', '', user.displayName, '');

            this.userIdentity = account;
            this.authenticated = true;
        } else {
            this.userIdentity = null;
            this.authenticated = false;
        }
        this.authenticationState.next(this.userIdentity);
        return Promise.resolve(this.userIdentity);
    }

    isAuthenticated(): boolean {
        return this.authenticated;
    }

    isIdentityResolved(): boolean {
        return this.userIdentity !== undefined;
    }

    getAuthenticationState(): Observable<any> {
        return this.authenticationState.asObservable();
    }

    getImageUrl(): string {
        return this.isIdentityResolved() ? this.userIdentity.imageUrl : null;
    }
}
