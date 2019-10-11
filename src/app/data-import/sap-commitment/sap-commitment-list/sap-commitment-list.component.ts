import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SapCommitmentService } from '../sap-commitment.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SapCommitment } from '../sap-commitment.model';
import { MatTableDataSource, MatSlideToggleChange, MatSnackBar, MatDialog, MatPaginator } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { Subscription, Observable } from 'rxjs';
import { DataImportService } from '../../data-import.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';


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
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  searchString: string;
  sapCommitments: SapCommitment[];
  fiscalYearSubs: Subscription;
  fiscalYear: number;
  dataSource;
  expandedElement;
  expandedId: string | null;
  displayedColumns = [
    'no', 'orderNumber', 'category',
    'documentNumber', 'position', 'name',
    'quantity', 'uom', 'currency', 'actualValue', 'planValue',
    'documentDate', 'debitDate', 'username', 'isLocked', 'isLinked'
  ];

  constructor(
    private sapCommitmentService: SapCommitmentService,
    private dataImportService: DataImportService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit() {
    this.searchString = '';
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.expandedId = paramMap.get('id');
      }
    });

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
    if (!result) { return false; }

    this.sapCommitments = result.data;
    this.dataSource = new MatTableDataSource(this.sapCommitments);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    if (expandedId) {
      this.expandedElement = this.sapCommitments.filter(row => row.id === expandedId)[0];
    }
    this.spinner.hide();
    return true;
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
      return false;
    }

    const isContinue = await this.confirmationDialog('Delete Commitment.',
    'Are you sure want to do this?').toPromise().catch(error => { console.log(error); });
    if (!isContinue) { return false; }

    this.spinner.show();
    const result = await this.sapCommitmentService.deleteOne(id).toPromise().catch(error => { console.log(error); });
    if (!result) {
      this.spinner.hide();
      this.snackBar.open('Delete commitment', 'failed', { duration: 2000 });
      return false;
    }

    const fetched = await this.fetchData(null);
    if (!fetched) { return false; }

    this.snackBar.open('Delete commitment', 'success', { duration: 2000 });
  }

  async onDeleteMany() {
    const isContinue = await this.confirmationDialog('WARNING!', 'You will delete all UNLOCKED commitment. ' +
    '<br />' + 'Are you sure want to do this?').toPromise().catch(error => { console.log(error); });
    if (!isContinue) { return false; }

    this.spinner.show();
    const result = await this.sapCommitmentService.deleteMany().toPromise().catch(error => { console.log(error); });
    if (!result) {
      this.spinner.hide();
      this.snackBar.open('Delete commitment', 'failed', { duration: 2000 });
      return false;
    }
    const fetched = await this.fetchData(null);
    if (!fetched) { return false; }

    this.snackBar.open('Delete commitment', 'success', { duration: 2000 });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.fiscalYearSubs.unsubscribe();
  }

  async onLinkChange(id: string, slider: MatSlideToggleChange) {
    this.spinner.show();

    const result = await this.sapCommitmentService.setLink(id, slider.checked).toPromise().catch(error => { console.log(error); });
    if (!result) {
      slider.checked = !slider.checked;
      this.spinner.hide();
      this.snackBar.open('Updating', 'failed', { duration: 2000 });
      return false;
    }

    const index = this.sapCommitments.findIndex(data => data.id === id);
    this.sapCommitments[index].isLinked = slider.checked;
    this.spinner.hide();
    this.snackBar.open('The data is', slider.checked ? 'linked' : 'unlinked', { duration: 2000 });
  }

  async onLockChange(id: string, slider: MatSlideToggleChange) {
    this.spinner.show();

    const result = await this.sapCommitmentService.setLock(id, slider.checked).toPromise().catch(error => { console.log(error); });
    if (!result) {
      slider.checked = !slider.checked;
      this.spinner.hide();
      this.snackBar.open('Updating', 'failed', { duration: 2000 });
      return false;
    }

    const index = this.sapCommitments.findIndex(data => data.id === id);
    this.sapCommitments[index].isLocked = slider.checked;
    this.spinner.hide();
    this.snackBar.open('Lock', slider.checked ? 'locked' : 'unlocked', { duration: 2000 });
  }

  async onBlurRemark(id: string, isLocked: boolean, event: any) {
    if (isLocked) { return false; }

    this.spinner.show();
    const index = this.sapCommitments.findIndex(data => data.id === id);
    const oldValue = this.sapCommitments[index].remark;

    const result = await this.sapCommitmentService.setRemark(id, event.target.value).toPromise().catch(error => { console.log(error); });
    if (!result) {
      this.sapCommitments[index].remark = oldValue;
      this.spinner.hide();
      this.snackBar.open('Updating', 'failed', { duration: 2000 });
      return false;
    }

    this.sapCommitments[index].remark = event.target.value;
    this.spinner.hide();
    this.snackBar.open('Remark', 'updated', { duration: 2000 });
  }

  exportToExcel() {
    this.sapCommitmentService.exportToExcel(this.sapCommitments);
  }

  async onFilePicked(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length <= 0) {
      return false;
    }

    const file = files[0];
    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.snackBar.open('File type not allowed.', 'only *.xlsx', { duration: 2000 });
      return false;
    }

    const isContinue = await this.confirmationDialog('Import from Excel',
    'The followings will occur.<br />' +
    '<ul>' +
    '<li>Unlocked data will be replace with new one.</li>' +
    '<li>New data will be added.</li>' +
    '</ul>' +
    'Are you sure want to do this?')
    .toPromise().catch(error => { console.log(error); });
    if (!isContinue) { return false; }

    let arrayBuffer: ArrayBuffer;
    const reader = new FileReader();

    reader.onload = async () => {
      this.spinner.show();
      arrayBuffer = reader.result as ArrayBuffer;
      const importRes = await this.sapCommitmentService.importFromExcel(arrayBuffer).catch(error => { console.log(error); });
      if (!importRes) {
        this.spinner.hide();
        this.snackBar.open('Updating', 'failed', { duration: 2000 });
        return false;
      }
      await this.fetchData(null);
      this.snackBar.open('Import from Excel', 'success', { duration: 2000 });
      };
    reader.readAsArrayBuffer(file);
  }
}
