import { Component, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { switchMap } from 'rxjs/operators'
import { PaymentBatchView } from 'src/app/shared/models/payments/payment-batch-view.model'
import { PaymentBatchService } from 'src/app/shared/services/payment-batch.service'
import { PaymentModalComponent } from './../payment-modal/payment-modal.component'
import { PaymentService } from 'src/app/shared/services/payment.service'
import { PaymentView } from 'src/app/shared/models/payments/payment-view.model'
import { NotificationComponent } from 'src/app/shared/components/notification/notification.component'

@Component({
  selector: 'app-payment-batch-detail',
  templateUrl: './payment-batch-detail.component.html',
  styleUrls: ['./payment-batch-detail.component.css']
})

export class PaymentBatchDetailComponent implements OnInit {
  @ViewChild(PaymentModalComponent)
  private paymentModalComponent: PaymentModalComponent

  paymentsBatch: PaymentBatchView
  paymentList: PaymentView[]

  paymentsBatchId: string
  totalCount = 0
  pageNumber = 1
  pageSize = 10
  showProcessedPayments = false
  isLoading = true

  showPaymentModal = false

  constructor(private route: ActivatedRoute,
    private paymentBatchService: PaymentBatchService,
    private paymentService: PaymentService,
    private notification: NotificationComponent) {}

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.paymentsBatchId = params.get('id')
    )).subscribe(() => {
      console.log("ngOnInit")
      this.getPaymentsBatchById(this.paymentsBatchId)
      this.getPaymentsPart(+this.paymentsBatchId, this.pageNumber, this.pageSize, this.showProcessedPayments)
    })
  }

  getPaymentsBatchById(paymentsBatchId: string) {
    this.paymentBatchService.getOne(+paymentsBatchId)
      .subscribe(paymentsBatch => {
        this.paymentsBatch = paymentsBatch
        console.log("getPaymentsBatchById")
      })
  }

  getPaymentsPart(paymentsBatchId: number, pageNumber: number, pageSize: number, showProcessed: boolean) {
    this.isLoading = true
    this.paymentService.getPart(paymentsBatchId, pageNumber, pageSize, showProcessed)
      .subscribe(response => {
        this.totalCount = Number(response.headers.get('X-Total-Count'))
        this.paymentList = <PaymentView[]>response.body
        this.isLoading = false
        console.log("getPaymentsPart")
      })
  }

  onChangedShowProcessedPayments(showProcessed: boolean) {
    this.showProcessedPayments = showProcessed
    this.getPaymentsPart(+this.paymentsBatchId, this.pageNumber, this.pageSize, this.showProcessedPayments)  
  }

  openPaymentDialog() {
    this.paymentModalComponent.openAddPaymentDialog()
  }

  onAddPaymentToList(payment: PaymentView) {
    this.paymentList = [payment, ...this.paymentList]
    this.totalCount++
    this.updatePaymentsBatchDetailInfo(true, payment)
  }

  pageIndexChange(pageIndex: number) {
    this.pageNumber = pageIndex
    this.getPaymentsPart(+this.paymentsBatchId, this.pageNumber, this.pageSize, this.showProcessedPayments)
  }

  pageSizeChange(pageSize: number) {
    this.pageSize = pageSize
    this.getPaymentsPart(+this.paymentsBatchId, this.pageNumber, this.pageSize, this.showProcessedPayments)
  }

  deletePayment(payment: PaymentView) {
    this.paymentService.delete(payment.id)
      .subscribe(
        _ => {
          this.totalCount--
          this.getPaymentsPart(+this.paymentsBatchId, this.pageNumber, this.pageSize, this.showProcessedPayments)
          this.updatePaymentsBatchDetailInfo(false, payment)
          this.notification.show('success', 'Успіх', `Платіж успішно видалено!`)
        },
        _ => {
          this.notification.show('error', 'Фіаско', `Не вдалося видалити платіж`)
      })
  }

  updatePaymentsBatchDetailInfo(isAdd: boolean, payment: PaymentView) {
    this.paymentsBatch.totalAmount += (isAdd ? 1 : -1) * payment.amount
    this.paymentsBatch.totalCount = this.totalCount
  }
}
