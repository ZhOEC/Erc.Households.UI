import { Person } from './person.model';
import { IAddress } from './address.model';

export interface AccountingPoint {
    id: number
    branchOfficeId: number
    eic: string
    name: string
    dsoId: number
    tarrifId: number
    city: string
    street: string
    building: string
    appartament: string
    contractStartDate: Date
    address: IAddress
    owner: Person
}