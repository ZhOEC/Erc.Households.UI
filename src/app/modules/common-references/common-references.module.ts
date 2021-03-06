import { PrintBillsComponent } from './print-bills/print-bills.component'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ExemptionCategyListComponent } from './exemption-categy-list/exemption-categy-list.component'
import { ConsumptionLoaderFormComponent } from './consumption-loader-form/consumption-loader-form.component'
import { ErcSharedModule } from 'src/app/shared/modules/erc-shared.module'
import { ReportsComponent } from './reports/reports.component'

@NgModule({
  declarations: [
    ExemptionCategyListComponent,
    ConsumptionLoaderFormComponent,
    PrintBillsComponent,
    ReportsComponent
  ],
  imports: [
    CommonModule,
    ErcSharedModule
  ],
  exports: [
    ExemptionCategyListComponent
  ]
})
export class CommonReferencesModule {}
