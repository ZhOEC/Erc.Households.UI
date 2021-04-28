import { BranchOffice } from 'src/app/shared/models/branch-office'
import { Period } from 'src/app/shared/models/period'

export interface TaxInvoiceCreateRequest {
    branchOffice: BranchOffice,
    period: Period,
    isDisabled: boolean
}