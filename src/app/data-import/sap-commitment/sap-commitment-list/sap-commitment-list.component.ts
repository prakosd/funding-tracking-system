import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SapCommitmentService } from '../sap-commitment.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SapCommitment } from '../sap-commitment.model';
import { MatTableDataSource, MatSlideToggleChange, MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { Subscription, Observable } from 'rxjs';
import { DataImportService } from '../../data-import.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ExcelService } from '../../../shared/excel.service';


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
    this.dataSource = new MatTableDataSource<SapCommitment[]>();
    this.fiscalYearSubs = this.dataImportService.getFiscalYear().subscribe(year => {
      this.fiscalYear = year;
      this.fetchData(null);
    });
  }
  onRefresh() {
    this.fetchData(null);
  }

  onCloneOne(id: string) {
    this.router.navigate(['../sap-commitment-form', 'clone', id], {relativeTo: this.route});
  }

  onUpdateOne(id: string, isLocked: boolean | true) {
    if (isLocked) {
      this.snackBar.open('The data is locked!', 'Unlock it first.', { duration: 2000 });
      return;
    }
    this.router.navigate(['../sap-commitment-form', 'edit', id], {relativeTo: this.route});
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

  exportToExcel() {
    this.excelService.exportAsExcelFile(this.sapCommitments, 'SapCommitment');
  }

  onBlurRemark(id: string, event: any) {
    this.sapCommitmentService.updateRemark(id, event.target.value).subscribe(result => {
      this.fetchData(id);
      this.snackBar.open('Remark', 'Updated', { duration: 2000 });
    }, error => {
      console.log(error);
    });
  }
}
