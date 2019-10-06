import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SapCommitmentService } from '../sap-commitment.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SapCommitment } from '../sap-commitment.model';
import { MatTableDataSource, MatSlideToggleChange, MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { Subscription, Observable } from 'rxjs';
import { DataImportService } from '../../data-import.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ExcelService } from '../../../shared/excel.service';
import { NgxSpinnerService } from 'ngx-spinner';

const sapCommitmentKeyMap = {
  year: 'Fiscal Year',
  month: 'Period',
  orderNumber: 'Order',
  category: 'Reference document category',
  documentNumber: 'Ref Document Number',
  position: 'Reference item',
  costElement: 'Cost element',
  name: 'Name',
  quantity: 'Quantity/plan',
  uom: 'Unit of Measure',
  currency: 'Report currency',
  actualValue: 'Val.in rep.cur.',
  planValue: 'Plan Val. RCrcy',
  documentDate: 'Document Date',
  debitDate: 'Debit date',
  username: 'User Name'
};


@Component({
  selector: 'app-sap-commitment-list',
  templateUrl: './sap-commitment-list.component.html',
  styleUrls: ['./sap-commitment-list.component.css', './sap-commitment-list-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed, void => expanded', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class SapCommitmentListComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  sapCommitments: SapCommitment[];
  fiscalYearSubs: Subscription;
  fiscalYear: number;
  dataSource;
  expandedElement;
  expandedId: string | null;
  displayedColumns = [
    'orderNumber', 'category',
    'documentNumber', 'position', 'name',
    'quantity', 'uom', 'currency', 'actualValue', 'planValue',
    'documentDate', 'debitDate', 'username', 'isLocked', 'isLinked'
  ];

  constructor(
    private sapCommitmentService: SapCommitmentService,
    private dataImportService: DataImportService,
    private excelService: ExcelService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.expandedId = paramMap.get('id');
      }
    });

    this.dataSource = new MatTableDataSource<SapCommitment[]>();
    this.fiscalYearSubs = this.dataImportService.getFiscalYear().subscribe(year => {
      this.fiscalYear = year;
      this.fetchData(this.expandedId);
    });
  }
  onRefresh() {
    this.fetchData(this.expandedId);
  }

  onCloneOne(id: string) {
    this.router.navigate(['data-import', 'sap-commitment', 'sap-commitment-form', id, 'clone']);
  }

  onUpdateOne(id: string, isLocked: boolean | true) {
    if (isLocked) {
      this.snackBar.open('The data is locked!', 'Unlock it first.', { duration: 2000 });
      return;
    }
    this.router.navigate(['data-import', 'sap-commitment', 'sap-commitment-form', id, 'edit']);
  }

  async fetchData(expandedId: string | null) {
    this.spinner.show();
    const result = await this.sapCommitmentService.getMany(this.fiscalYear).toPromise().catch(error => { console.log(error); });
    if (!result) { return; }

    this.sapCommitments = result.data;
    this.dataSource = new MatTableDataSource(this.sapCommitments);
    this.dataSource.sort = this.sort;
    if (expandedId) {
      this.expandedElement = this.sapCommitments.filter(row => row.id === expandedId)[0];
    }
    this.spinner.hide();
  }

  confirmationDialog(title: string, message: string): Observable<any> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '25rem',
      data: { title, message }
     });

    return dialogRef.afterClosed();
  }

  async onDeleteOne(id: string, isLocked: boolean | true) {
    if (isLocked) {
      this.snackBar.open('The data is locked!', 'Unlock it first.', { duration: 2000 });
      return;
    }

    const result = await this.confirmationDialog('Delete Commitment.',
    'Are you sure want to do this?').toPromise().catch(error => { console.log(error); });
    if (!result) { return; }

    await this.sapCommitmentService.deleteOne(id).toPromise().catch(error => { console.log(error); });
    this.fetchData(null);
    this.snackBar.open('Delete Commitment', 'Success', { duration: 2000 });
  }

  async onDeleteMany() {
    const result = await this.confirmationDialog('WARNING!', 'You will delete all UNLOCKED commitment. ' +
    '<br />' + 'Are you sure want to do this?').toPromise().catch(error => { console.log(error); });
    if (!result) { return; }

    this.spinner.show();
    await this.sapCommitmentService.deleteMany().toPromise().catch(error => { console.log(error); });
    await this.fetchData(null);
    this.snackBar.open('Delete Commitment', 'Success', { duration: 2000 });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.fiscalYearSubs.unsubscribe();
  }

  async onLinkChange(id: string, slider: MatSlideToggleChange) {
    const result = await this.sapCommitmentService.setLink(id, slider.checked).toPromise().catch(error => { console.log(error); });
    if (!result) { return; }

    await this.fetchData(id);
    this.snackBar.open('Link', 'updated', { duration: 2000 });
  }

  async onLockChange(id: string, slider: MatSlideToggleChange) {
    const result = await this.sapCommitmentService.setLock(id, slider.checked).toPromise().catch(error => { console.log(error); });
    if (!result) { return; }

    await this.fetchData(id);
    this.snackBar.open('Lock', 'updated', { duration: 2000 });
  }

  async onBlurRemark(id: string, isLocked: boolean, event: any) {
    if (isLocked) {
      return;
    }
    const result = await this.sapCommitmentService.setRemark(id, event.target.value).toPromise().catch(error => { console.log(error); });
    if (!result) { return; }

    await this.fetchData(id);
    this.snackBar.open('Remark', 'updated', { duration: 2000 });
  }

  async mapToExcel(): Promise<any[]> {
    return this.sapCommitments.map((data, index) => {
      return {
          No: index + 1,
          Year: new Date(data.debitDate).getFullYear(),
          Month: new Date(data.debitDate).getMonth(),
          Order: data.orderNumber,
          Category: data.category,
          Document: data.documentNumber,
          Position: +data.position,
          'Cost Element': data.costElement,
          Name: data.name,
          Qty: +data.quantity,
          UoM: data.uom,
          Currency: data.currency,
          'Actual Value': +data.actualValue,
          'Plan Value': +data.planValue,
          'Document Date': new Date(data.documentDate),
          'Debit Date': new Date(data.debitDate),
          Username: data.username,
          Remark: data.remark,
          Locked: data.isLocked ? 'Yes' : '' ,
          Linked: data.isLinked ? 'Yes' : '' ,
          id: data.id,
          'Last Update At': new Date(data.lastUpdateAt),
          'Last Update By': data.lastUpdateBy,
      };
    });
  }
  async exportToExcel() {
    this.excelService.exportAsExcelFile(await this.mapToExcel(), 'SapCommitment');
  }

  async importExcel(data: SapCommitment[]) {
    for (const d of data) {
      const result = await this.sapCommitmentService.getLock(d.orderNumber, d.documentNumber, d.position)
      .toPromise().catch(error => { console.log(error); });
      if (!result) { return; }

      if (!result.data.isLocked) {
        await this.sapCommitmentService.upsertOne(d).toPromise().catch(error => { console.log(error); });
        if (!result) { return; }
      }
    }
  }

  async onFilePicked(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length <= 0) {
      return;
    }

    const file = files[0];
    // if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    //   this.snackBar.open('File type not allowed.', 'only *.xlsx', { duration: 2000 });
    //   return;
    // }

    const result = await this.confirmationDialog('Import from Excel',
    'All UNLOCKED data will be updated<br />' +
    'and non existing will be inserted.<br /><br />' + 'Are you sure want to do this?')
    .toPromise().catch(error => { console.log(error); });
    if (!result) { return; }

    this.spinner.show();
    let arrayBuffer: ArrayBuffer;
    const reader = new FileReader();

    reader.onload = async () => {
        arrayBuffer = reader.result as ArrayBuffer;
        const json = await this.excelService.importAsJson(arrayBuffer).catch(error => { console.log(error); });
        if (!json) { return; }

        const data = await this.mapJsonFromExcel(json).catch(error => { console.log(error); });
        if (!data) { return; }

        await this.importExcel(data).catch(error => { console.log(error); });
        await this.fetchData(null);
        this.snackBar.open('Import from Excel', 'success', { duration: 2000 });
      };
    reader.readAsArrayBuffer(file);
  }

  async mapJsonFromExcel(json: any[]): Promise<any[]> {
    const results: any[] = [];
    for (const data of json) {
      const result = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          result[await this.mapKey(key)] = data[key];
        }
      }
      results.push(result);
    }
    return results.filter(r => r.orderNumber !== null && r.orderNumber !== undefined);
  }

  async mapKey(findKey: string): Promise<string> {
    for (const key in sapCommitmentKeyMap) {
      if (sapCommitmentKeyMap.hasOwnProperty(key)) {
        if (sapCommitmentKeyMap[key] === findKey) {
          return key;
        }
      }
    }
  }
}
