import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataImportService } from '../data-import/data-import.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  years = [];
  selectedYear: number;
  navLinks = [];

  constructor(private router: Router, private dataImportService: DataImportService) {
    this.setFiscalYears();
    this.selectedYear = (new Date()).getFullYear();
    this.navLinks = [
      { path: './sap-master', label: 'Master Detail' },
      { path: './sap-detail', label: 'Detail Only' }
    ];
    this.dataImportService.setFiscalYear((new Date()).getFullYear());
  }

  setFiscalYears() {
    this.years = [];
    for (let i = 2018; i <= (new Date()).getFullYear() + 10; i++) {
      this.years.push(
        { value: i, viewValue: i }
      );
    }
  }

  onFiscalYearChange(year: number) {
    this.dataImportService.setFiscalYear(year);
  }

  ngOnInit() {

  }

}
