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
    private dialog: MatDialog
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

  fetchData(expandedId: string | null) {
    const snackBarRef = this.snackBar.open('Please wait.', 'Updating list.');
    this.sapCommitmentService.getMany(this.fiscalYear)
    .subscribe((result: { message: string; sapCommitments: SapCommitment[] }) => {
      this.sapCommitments = result.sapCommitments;
      this.dataSource = new MatTableDataSource(this.sapCommitments);
      this.dataSource.sort = this.sort;
      if (expandedId) {
        this.expandedElement = this.sapCommitments.filter(row => row.id === expandedId)[0];
      }
      snackBarRef.dismiss();
    }, error => {
      console.log(error);
      snackBarRef.dismiss();
    });
  }

  confirmationDialog(title: string, message: string): Observable<any> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '25rem',
      data: { title, message }
     });

    return dialogRef.afterClosed();
  }

  onDeleteOne(id: string, isLocked: boolean | true) {
    if (isLocked) {
      this.snackBar.open('The data is locked!', 'Unlock it first.', { duration: 2000 });
      return;
    }
    this.confirmationDialog('Delete Commitment.', 'Are you sure want to do this?').subscribe(result => {
      if (result) {
        this.sapCommitmentService.deleteOne(id).subscribe(() => {
          this.fetchData(null);
          this.snackBar.open('Delete Commitment', 'Success', { duration: 2000 });
        }, error => {
          console.log(error);
          this.snackBar.open('Delete Commitment', 'Failed!', { duration: 2000 });
        });
      }
    });
  }

  onDeleteMany() {
    let snackBarRef;
    this.confirmationDialog('WARNING!', 'You will delete all UNLOCKED commitment. ' + '<br />' + 'Are you sure want to do this?')
    .subscribe(result => {
      if (result) {
        snackBarRef = this.snackBar.open('Please wait.', 'Deleting list.');
        this.sapCommitmentService.deleteMany().subscribe(() => {
        this.fetchData(null);
        snackBarRef.dismiss();
        this.snackBar.open('Delete Commitment', 'Success', { duration: 2000 });
        }, error => {
          console.log(error);
          snackBarRef.dismiss();
          this.snackBar.open('Delete Commitment', 'Failed!', { duration: 2000 });
        });
      }
    }, error => {
      console.log(error);
      snackBarRef.dismiss();
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.fiscalYearSubs.unsubscribe();
  }

  onLinkChange(id: string, slider: MatSlideToggleChange) {
    this.sapCommitmentService.setLink(id, slider.checked).subscribe(result => {
      this.fetchData(id);
      this.snackBar.open('Link', 'Updated', { duration: 2000 });
    }, error => {
      console.log(error);
    });
  }

  onLockChange(id: string, slider: MatSlideToggleChange) {
    this.sapCommitmentService.setLock(id, slider.checked).subscribe(result => {
      this.fetchData(id);
      this.snackBar.open('Lock', 'Updated', { duration: 2000 });
    }, error => {
      console.log(error);
    });
  }

  onBlurRemark(id: string, isLocked: boolean, event: any) {
    if (isLocked) {
      return;
    }
    this.sapCommitmentService.setRemark(id, event.target.value).subscribe(result => {
      this.fetchData(id);
      this.snackBar.open('Remark', 'Updated', { duration: 2000 });
    }, error => {
      console.log(error);
    });
  }

  mapToExcel(): any[] {
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
  exportToExcel() {
    this.excelService.exportAsExcelFile(this.mapToExcel(), 'SapCommitment');
  }

  importExcel(data: SapCommitment[]) {
    this.confirmationDialog('Import from Excel',
    'All UNLOCKED data will be updated and non existing will be inserted.<br />' + 'Are you sure want to do this?')
    .subscribe(ok => {
      if (ok) {
        data.forEach((d, index) => {
          this.sapCommitmentService.getLock(d.orderNumber, d.documentNumber, d.position).subscribe(isLocked => {
            if (!isLocked.data || (isLocked.data && isLocked.data.isLocked === false)) {
              this.sapCommitmentService.updateOne(d).subscribe(result => {
                // console.log(result);

              }, error => {
                console.log(error);
              });
            }
          });
          console.log(index);
          if (index >= data.length - 1) {

            // this.fetchData(null);
          }
        });
      } else { return; }
    }, error => {
      console.log(error);
      return;
    });
  }

  onFilePicked(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length <= 0) {
      return;
    }

    const file = files[0];
    // if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    //   this.snackBar.open('File type not allowed.', 'only *.xlsx', { duration: 2000 });
    //   return;
    // }

    let arrayBuffer: ArrayBuffer;
    const reader = new FileReader();
    reader.onload = () => {
      arrayBuffer = reader.result as ArrayBuffer;
      const json = this.excelService.importAsJson(arrayBuffer);
      const data: SapCommitment[] = this.mapJsonFromExcel(json);
      this.importExcel(data);
    };

    reader.readAsArrayBuffer(file);
  }

  mapJsonFromExcel(json: any[]): any[] {
    const results: any[] = [];
    json.forEach(data => {
      const result = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          result[this.mapKey(key)] = data[key];
        }
      }
      results.push(result);
    });
    return results.filter(r => r.orderNumber !== null && r.orderNumber !== undefined);
  }

  mapKey(findKey: string): string {
    for (const key in sapCommitmentKeyMap) {
      if (sapCommitmentKeyMap.hasOwnProperty(key)) {
        if (sapCommitmentKeyMap[key] === findKey) {
          return key;
        }
      }
    }
  }
}


