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

  isLoading = false;
  searchField = '';
  transactions: Transaction[];
  dataSource: MatTableDataSource<Transaction>;
  expandedElement;
  expandedId: string | null;
  displayedColumns = [
    'no', 'prNumber', 'poNumber', 'grNumber', 'subject',
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

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async fetchData(expandedId: string | null) {
    this.isLoading = true;
    const result = await this.sapService.getTransactions(this.fiscalYear, this.orderNumber)
    .toPromise().catch(error => { console.log(error); });
    if (!result) { return false; }

    // await this.delay(2000);
    this.transactions = result.data;
    this.dataSource = new MatTableDataSource(this.transactions);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    if (expandedId) {
      this.expandedElement = this.transactions.filter(row => row.id === expandedId)[0];
    }
    this.applyFilter(this.searchField);
    this.isLoading = false;
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

  async onBlurPrNumber(id: string, orderNumber: string, poNumber: string, grNumber: string, event: any) {
    this.expandedId = id;
    let newPrNumber = '';
    if (event.target.value) {
      newPrNumber = event.target.value.trim();
    }

    if (poNumber) {
      let result = await this.sapService.deletePrToPo(orderNumber, poNumber)
      .toPromise().catch(error => { console.log(error); });

      if (newPrNumber.length > 0) {
        result = await this.sapService.updatePrToPo(orderNumber, newPrNumber, poNumber)
        .toPromise().catch(error => { console.log(error); });

        if (!result) {
            this.snackBar.open('Updating', 'failed', { duration: 2000 });
            return false;
        }
      }
      await this.fetchData(this.expandedId);
      this.snackBar.open('Updating', 'success', { duration: 2000 });
    } else {
      let result = await this.sapService.deletePrToGr(orderNumber, grNumber)
      .toPromise().catch(error => { console.log(error); });

      if (newPrNumber.length > 0) {
        result = await this.sapService.updatePrToGr(orderNumber, newPrNumber, grNumber)
        .toPromise().catch(error => { console.log(error); });
        if (!result) {
            this.snackBar.open('Updating', 'failed', { duration: 2000 });
            return false;
        }
      }
      await this.fetchData(this.expandedId);
      this.snackBar.open('Updating', 'success', { duration: 2000 });
    }
  }

  getStatusColor(status: string) {
    let result;
    switch (status) {
        case 'PR': {
          result = 'accent';
          break;
        }
        case 'PO': {
            result = 'warn';
            break;
        }
        case 'GR': {
          result = 'primary';
          break;
        }
        default: {
          result = 'accent';
          break;
        }
    }
    return result;
  }

  async onEtaDateChange(id: string, orderNumber: string, prNumber: string, poNumber: string, etaDate: any) {
    this.expandedId = id;
    if (prNumber) {
      const result = await this.sapService.updateEtaDate(orderNumber, prNumber, etaDate)
      .toPromise().catch(error => { console.log(error); });

      if (!result) {
        this.snackBar.open('Updating PO', 'failed', { duration: 2000 });
      }
    }

    if (poNumber) {
      const result = await this.sapService.updateEtaDate(orderNumber, poNumber, etaDate)
      .toPromise().catch(error => { console.log(error); });

      if (!result) {
        this.snackBar.open('Updating PO', 'failed', { duration: 2000 });
      }
    }
    await this.fetchData(this.expandedId);
    this.snackBar.open('Updating', 'success', { duration: 2000 });
  }

  async onClearEtaDate(id: string, orderNumber: string, prNumber: string, poNumber: string) {
    this.expandedId = id;
    if (prNumber) {
      const result = await this.sapService.deleteEtaDate(orderNumber, prNumber)
      .toPromise().catch(error => { console.log(error); });

      if (!result) {
        this.snackBar.open('Deleting PO', 'failed', { duration: 2000 });
      }
    }

    if (poNumber) {
      const result = await this.sapService.deleteEtaDate(orderNumber, poNumber)
      .toPromise().catch(error => { console.log(error); });

      if (!result) {
        this.snackBar.open('Deleting PO', 'failed', { duration: 2000 });
      }
    }

    await this.fetchData(this.expandedId);
    this.snackBar.open('Deleting', 'success', { duration: 2000 });
  }
}
