import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { MatSort, MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { Transaction } from '../sap.model';
import { SapService } from '../sap.service';
// import { DataImportService } from '../../data-import.service';
// import { NgxSpinnerService } from 'ngx-spinner';

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

export class SapDetailComponent implements OnInit {
  @Input() fiscalYear: number;
  @Input() orderNumber: string;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  searchField = '';
  transactions: Transaction[];
  dataSource: MatTableDataSource<Transaction>;
  expandedElement;
  expandedId: string | null;
  displayedColumns = [
    'prNumber', 'poNumber', 'grNumber', 'subject',
    'prValue', 'poValue', 'grValue',
    'issueDate', 'etaDate', 'actualDate', 'dueDay'
  ];

  constructor(
    private sapService: SapService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.fetchData(this.expandedId);
  }

  async fetchData(expandedId: string | null) {
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
    this.applyFilter(this.searchField);
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

  async onBlurPrNumber(poNumber: string, event: any) {
    const result = await this.sapService.updatePrToPo(this.orderNumber, event.target.value, poNumber)
    .toPromise().catch(error => { console.log(error); });
    if (!result) {
      this.snackBar.open('Updating', 'failed', { duration: 2000 });
      return false;
    }
    await this.fetchData(this.expandedId);
    this.snackBar.open('Updating', 'success', { duration: 2000 });
  }
}
