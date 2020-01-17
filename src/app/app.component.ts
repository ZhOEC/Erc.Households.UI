import { Component } from '@angular/core';
import { AuthService } from './core/auth.service';
import { BranchOfficeService } from './baranch-office/branch-office.service';
import { BranchOffice } from './baranch-office/branch-office';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentUser: Promise<string>;
  branchOfficesList: BranchOffice[];
  selectedBranchOffice: string;

  visibilityDrawer = false;
  placementDrawer = 'left';

  constructor(private authService: AuthService, private apiService: BranchOfficeService) {}

  ngOnInit() {
    this.getBranchOffices();
    this.currentUser = this.authService.getUserName();
  }

  getBranchOffices() {
    this.apiService.getBranchOffices().subscribe(data => {
      this.branchOfficesList = data
    });
  }

  logout() {
    this.authService.logout();
  }
}