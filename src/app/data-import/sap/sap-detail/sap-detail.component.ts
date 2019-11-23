import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { Transaction } from '../sap.model';
import { SapService } from '../sap.service';
import { DataImportService } from '../../data-import.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sap-detail',
  templateUrl: './sap-detail.component.html',
  styleUrls: ['./sap-detail.component.css', './sap-detail-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed, void => expanded', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class SapDetailComponent implements OnInit, OnDestroy {
  @Input() orderNumber: string;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  searchField = '';
  transactions: Transaction[];
  fiscalYearSubs: Subscription;
  fiscalYear: number;
  dataSource: MatTableDataSource<Transaction>;
  expandedElement;
  expandedId: string | null;
  displayedColumns = [
    'prNumber', 'poNumber', 'grNumber', 'subject', 'items', 'remarks',
    'headerTexts', 'prValue', 'prPlan', 'poValue', 'poPlan', 'grValue',
    'issueDate', 'etaDate', 'actualDate'
  ];

  constructor(
    private sapService: SapService,
    private dataImportService: DataImportService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.fiscalYearSubs = this.dataImportService.getFiscalYear().subscribe(year => {
      this.fiscalYear = year;
      this.fetchData(this.expandedId).then(isFetched => {
        if (isFetched) {
          this.applyFilter(this.searchField);
        }
      });
    });
  }

  async fetchData(expandedId: string | null) {
    this.spinner.show();
    const result = await this.sapService.getTransactions(this.fiscalYear, this.orderNumber)
    .toPromise().catch(error => { console.log(error); });
    if (!result) { return false; }

    this.transactions = result.data;
    this.dataSource = new MatTableDataSource(this.transactions);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    if (expandedId) {
      this.expandedElement = this.transactions.filter(row => row.orderNumber === expandedId)[0];
    }
    this.spinner.hide();
    return true;
  }

  onRefresh() {
    this.fetchData(this.expandedId);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearSearchField() {
    this.searchField = '';
    this.applyFilter('');
  }

  onRowClicked() {
    if (this.expandedElement) {
      // console.log(this.expandedElement);
    }
  }

  getTotalPrValue() {
    if (this.dataSource) {
      return this.dataSource.filteredData.map(row => row.prValue).reduce((acc, value) => acc + value, 0);
    }
  }

  getTotalPrPlan() {
    if (this.dataSource) {
      return this.dataSource.filteredData.map(row => row.prPlan).reduce((acc, value) => acc + value, 0);
    }
  }

  getTotalPoValue() {
    if (this.dataSource) {
      return this.dataSource.filteredData.map(row => row.poValue).reduce((acc, value) => acc + value, 0);
    }
  }

  getTotalPoPlan() {
    if (this.dataSource) {
      return this.dataSource.filteredData.map(row => row.poPlan).reduce((acc, value) => acc + value, 0);
    }
  }

  getTotalGrValue() {
    if (this.dataSource) {
      return this.dataSource.filteredData.map(row => row.grValue).reduce((acc, value) => acc + value, 0);
    }
  }

  exportToExcel() {
    this.sapService.exportToExcel(this.transactions);
  }

  ngOnDestroy() {
    this.fiscalYearSubs.unsubscribe();
  }
}
