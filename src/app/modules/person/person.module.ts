import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm'
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker'
import { NzCardModule } from 'ng-zorro-antd/card'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PersonAddComponent } from './person-add/person-add.component'

@NgModule({
  declarations: [
    PersonAddComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzPopconfirmModule,
    NzDatePickerModule,
    NzCardModule
  ],
  exports: [
    PersonAddComponent
  ]
})
export class PersonModule { }
