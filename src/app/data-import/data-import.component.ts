import { OnInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataImportService } from './data-import.service';

@Component({
  selector: 'app-data-import',
  templateUrl: './data-import.component.html',
  styleUrls: ['./data-import.component.css']
})

export class DataImportComponent implements OnInit {
  years = [];
  selectedYear: number;
  navLinks = [];

  constructor(private router: Router, private dataImportService: DataImportService) {
    this.setFiscalYears();
    this.selectedYear = (new Date()).getFullYear();
    this.navLinks = [
      { path: './sap-commitment', label: 'SAP Commitment' },
      { path: './sap-actual', label: 'SAP Actual' },
      { path: './sap-eas', label: 'SAP Fiori' }
      // { path: './sap-master', label: 'Master Detail' },
      // { path: './sap-detail', label: 'Detail Only' }
    ];
    this.dataImportService.setFiscalYear((new Date()).getFullYear());
  }

  ngOnInit() {

  }

  onFiscalYearChange(year: number) {
    this.dataImportService.setFiscalYear(year);
  }

  setFiscalYears() {
    this.years = [];
    for (let i = 2018; i <= (new Date()).getFullYear() + 10; i++) {
      this.years.push(
        { value: i, viewValue: i }
      );
    }
  }
}
