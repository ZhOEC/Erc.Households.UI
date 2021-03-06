import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { DistributionSystemOperatorService } from 'src/app/shared/services/distribution-system-operator.service'
import { BranchOfficeService } from 'src/app/shared/services/branch-office.service'
import { AddressService } from 'src/app/shared/services/address.service'
import { TariffService } from 'src/app/shared/services/tariff.service'
import { BuildingTypeService } from 'src/app/shared/services/building-type.service'
import { UsageCategoryService } from 'src/app/shared/services/usage-category.service'
import { BranchOffice } from 'src/app/shared/models/branch-office.model'
import { City } from 'src/app/shared/models/address/city.model'
import { Street } from 'src/app/shared/models/address/street.model'
import { DistributionSystemOperator } from 'src/app/shared/models/distribution-system-operator.model'
import { Tariff } from 'src/app/shared/models/tariff'
import { BuildingType } from 'src/app/shared/models/building-type'
import { UsageCategory } from 'src/app/shared/models/usage-category'
import { Commodity, CommodityData, commodityMap } from 'src/app/shared/models/commodity'

@Component({
  selector: 'app-accounting-point-form',
  templateUrl: './accounting-point-form.component.html',
  styleUrls: ['./accounting-point-form.component.css']
})
export class AccountingPointFormComponent implements OnInit {
  private _accountingPointForm: FormGroup
  @Input()
  set accountingPointForm(fg: FormGroup) {
    this._accountingPointForm = fg
  }
  get accountingPointForm() {
    return this._accountingPointForm
  }
  @Output()
  formChanged = new EventEmitter()

  branchOfficesList: BranchOffice[]
  citiesList: City[]
  streetsList: Street[]
  distributionSystemOperatorsList: DistributionSystemOperator[]
  tariffsList: Tariff[]
  buildingTypes: BuildingType[]
  usageCategories: UsageCategory[]
  availableCommodities: CommodityData[] = []

  isLoadingCities = false
  isLoadingStreets = false

  constructor(
    private formBuilder: FormBuilder,
    private distributionSystemOperatorService: DistributionSystemOperatorService,
    private branchOfficeService: BranchOfficeService,
    private addressService: AddressService,
    private tariffService: TariffService,
    private buildingTypeService: BuildingTypeService,
    private usageCategoryService: UsageCategoryService) { }

  ngOnInit() {
    this.accountingPointForm = this.formBuilder.group({
      id: [null],
      branchOfficeId: [null, Validators.required],
      eic: [null, [Validators.required, Validators.minLength(16), Validators.maxLength(16), Validators.pattern('[0-9a-zA-Z-]*')]],
      name: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      distributionSystemOperatorId: [null, Validators.required],
      tariffId: [null, Validators.required],
      address: this.formBuilder.group({
        id: [0],
        cityId: [null, Validators.required],
        streetId: [null, Validators.required],
        building: [null, Validators.required],
        apt: [null],
        zip: [null, Validators.required],
      }),
      usageCategoryId: [null, Validators.required],
      buildingTypeId: [null, Validators.required],
      commodity: [null, Validators.required]
    })

    this.getBranchOffices()
    this.getBuildingTypes()
    this.getUsageCategories()
    this.formChanged.emit(this.accountingPointForm)
  }

  getBranchOffices() {
    this.branchOfficeService.getBranchOffices().subscribe(offices => {
      this.branchOfficesList = offices;
      if (this.branchOfficesList.length == 1) {
        this.accountingPointForm.get('branchOfficeId').setValue(this.branchOfficesList[0].id)
        this.availableCommodities = [];
        this.branchOfficesList[0].availableCommodities.forEach(c => {
          this.availableCommodities.push(commodityMap[c])
          this.getCities(this.branchOfficesList[0].id)
        });
      }
    })
  }

  getCities(branchOfficeId: number) {
    this.accountingPointForm.controls.address.get('cityId').reset()
    if (branchOfficeId) {
      this.isLoadingCities = true
      this.addressService.getCities(branchOfficeId).subscribe(cities => {
        this.citiesList = cities
        this.accountingPointForm.controls.address.get('cityId').enable()
        this.isLoadingCities = false
      })
    }
  }

  branchOfficeChanged(branchOfficeId: any) {
    this.accountingPointForm.controls.address.get('cityId').reset()
    if (branchOfficeId) {
      this.availableCommodities = [];
      this.branchOfficesList.find(b => b.id == branchOfficeId).availableCommodities.forEach(c => {
        this.availableCommodities.push(commodityMap[c])
      });
      if (this.availableCommodities.length == 1)
        this.accountingPointForm.get('commodity').setValue(this.availableCommodities[0].value)

      this.isLoadingCities = true
      this.addressService.getCities(branchOfficeId).subscribe(cities => {
        this.citiesList = cities
        this.accountingPointForm.controls.address.get('cityId').enable()
        this.isLoadingCities = false
      })
    }
  }

  getStreets(cityId: number) {
    this.accountingPointForm.controls.address.get('streetId').reset()
    if (cityId) {
      this.isLoadingStreets = true
      this.addressService.getStreets(cityId).subscribe(streets => {
        this.streetsList = streets
        this.accountingPointForm.controls.address.get('streetId').enable()
        this.isLoadingStreets = false
      })
    }
  }

  getDistributionSystemOperators(commodity: Commodity) {
    this.distributionSystemOperatorService.getDistributionSystemOperators(commodity).subscribe(operators => {
      this.distributionSystemOperatorsList = operators.sort((a, b) => a.name.localeCompare(b.name))
      if (this.distributionSystemOperatorsList.length == 1) {
        this.accountingPointForm.get('distributionSystemOperatorId').setValue(this.distributionSystemOperatorsList[0].id)
      }
    })
  }

  commodityChanged(commodity: Commodity) {
    this.accountingPointForm.get('tariffId').reset()
    this.accountingPointForm.get('distributionSystemOperatorId').reset()
    this.getTariffs(commodity)
    this.getDistributionSystemOperators(commodity)
  }

  getTariffs = (commodity: Commodity) => this.tariffService.getTariffList(commodity).subscribe(tariffs => this.tariffsList = tariffs)
  getUsageCategories() { this.usageCategoryService.getAll().subscribe(categories => this.usageCategories = categories) }
  getBuildingTypes() { this.buildingTypeService.getAll().subscribe(types => this.buildingTypes = types) }
}
