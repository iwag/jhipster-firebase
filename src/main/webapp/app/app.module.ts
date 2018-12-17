import './vendor.ts';

import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { Ng2Webstorage } from 'ngx-webstorage';
import { JhiEventManager } from 'ng-jhipster';

//import { AuthExpiredInterceptor } from './blocks/interceptor/auth-expired.interceptor';
import { ErrorHandlerInterceptor } from './blocks/interceptor/errorhandler.interceptor';
import { NotificationInterceptor } from './blocks/interceptor/notification.interceptor';
import { FirestarterSharedModule } from 'app/shared';
import { FirestarterCoreModule } from 'app/core';
import { FirestarterAppRoutingModule } from './app-routing.module';
import { FirestarterHomeModule } from './home/home.module';
import { FirestarterAccountModule } from './account/account.module';
import { FirestarterEntityModule } from './entities/entity.module';
import * as moment from 'moment';
import environment from '../environments/environment';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { JhiMainComponent, NavbarComponent, FooterComponent, PageRibbonComponent, ErrorComponent } from './layouts';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

@NgModule({
    imports: [
        BrowserModule,
        FirestarterAppRoutingModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-' }),
        FirestarterSharedModule,
        FirestarterCoreModule,
        FirestarterHomeModule,
        FirestarterAccountModule,
        // jhipster-needle-angular-add-module JHipster will add new module here
        FirestarterEntityModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule
    ],
    declarations: [JhiMainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, FooterComponent],
    providers: [
        // {
        //     provide: HTTP_INTERCEPTORS,
        //     useClass: AuthExpiredInterceptor,
        //     multi: true,
        //     deps: [Injector]
        // },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorHandlerInterceptor,
            multi: true,
            deps: [JhiEventManager]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NotificationInterceptor,
            multi: true,
            deps: [Injector]
        }
    ],
    bootstrap: [JhiMainComponent]
})
export class FirestarterAppModule {
    constructor(private dpConfig: NgbDatepickerConfig) {
        this.dpConfig.minDate = { year: moment().year() - 100, month: 1, day: 1 };
    }
}
