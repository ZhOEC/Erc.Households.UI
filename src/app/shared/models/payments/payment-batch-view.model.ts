export interface PaymentBatchView {
    id: number,
    name: string,
    branchOfficeId: number,
    branchOfficeName: string,
    paymentChannelName: string,
    paymentChannelId: number,
    paymentChannelPaymentsType: number,
    incomingDate: Date,
    totalCount: number,
    totalAmount: number,
    isClosed: boolean
}