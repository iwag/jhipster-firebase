import { NgModule } from '@angular/core';

import { FirestarterSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
    imports: [FirestarterSharedLibsModule],
    declarations: [JhiAlertComponent, JhiAlertErrorComponent],
    exports: [FirestarterSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class FirestarterSharedCommonModule {}
