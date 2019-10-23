import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SapEasService } from '../sap-eas.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SapEas } from '../sap-eas.model';
import { MatTableDataSource, MatSlideToggleChange, MatSnackBar, MatDialog, MatPaginator } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { Subscription, Observable } from 'rxjs';
import { DataImportService } from '../../data-import.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProgressDataService, ProgressData } from '../../../shared/progress-data.service';


@Component({
  selector: 'app-sap-eas-list',
  templateUrl: './sap-eas-list.component.html',
  styleUrls: ['./sap-eas-list.component.css', './sap-eas-list-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed, void => expanded', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class SapEasListComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  searchField;
  sapEases: SapEas[];
  fiscalYearSubs: Subscription;
  fiscalYear: number;
  dataSource: MatTableDataSource<SapEas>;
  expandedElement;
  expandedId: string | null;
  progressData: ProgressData;
  progressDataSubs: Subscription;
  displayedColumns = [
    'no', 'requisitionNumber', 'subject',
    'currency', 'amount', 'costCenter', 'requestor', 'recipient', 'status',
    'creationDate', 'etaRequest', 'isLocked', 'isLinked'
  ];

  constructor(
    private sapEasService: SapEasService,
    private dataImportService: DataImportService,
    private progressDataService: ProgressDataService,
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

    this.fiscalYearSubs = this.dataImportService.getFiscalYear().subscribe(year => {
      this.fiscalYear = year;
      this.fetchData(this.expandedId);
    });

    this.progressDataSubs = this.progressDataService.getLoadingProgress().subscribe(progress => {
      this.progressData = progress;
    });
  }

  onRefresh() {
    this.fetchData(this.expandedId);
  }

  onCloneOne(id: string) {
    this.router.navigate(['data-import', 'sap-eas', 'sap-eas-form', id, 'clone']);
  }

  onUpdateOne(id: string, isLocked: boolean | true) {
    if (isLocked) {
      this.snackBar.open('The data is locked!', 'Unlock it first.', { duration: 2000 });
      return;
    }
    this.router.navigate(['data-import', 'sap-eas', 'sap-eas-form', id, 'edit']);
  }

  async fetchData(expandedId: string | null) {
    this.spinner.show();
    const result = await this.sapEasService.getMany(this.fiscalYear).toPromise().catch(error => { console.log(error); });
    if (!result) { return false; }

    this.sapEases = result.data;
    this.dataSource = new MatTableDataSource(this.sapEases);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    if (expandedId) {
      this.expandedElement = this.sapEases.filter(row => row.id === expandedId)[0];
    }
    this.spinner.hide();
    return true;
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

  getTotalAmount() {
    if (this.dataSource) {
      return this.dataSource.filteredData.map(row => row.amount).reduce((acc, value) => acc + value, 0);
    }
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

    const isContinue = await this.confirmationDialog('Delete EAS.',
    'Are you sure want to do this?').toPromise().catch(error => { console.log(error); });
    if (!isContinue) { return false; }

    this.spinner.show();
    const result = await this.sapEasService.deleteOne(id).toPromise().catch(error => { console.log(error); });
    if (!result) {
      this.spinner.hide();
      this.snackBar.open('Delete EAS', 'failed', { duration: 2000 });
      return false;
    }

    const fetched = await this.fetchData(null);
    if (!fetched) { return false; }

    this.snackBar.open('Delete EAS', 'success', { duration: 2000 });
  }

  async onDeleteMany() {
    const isContinue = await this.confirmationDialog('WARNING!', 'You will delete all UNLOCKED EAS. ' +
    '<br />' + 'Are you sure want to do this?').toPromise().catch(error => { console.log(error); });
    if (!isContinue) { return false; }

    this.spinner.show();
    const result = await this.sapEasService.deleteMany().toPromise().catch(error => { console.log(error); });
    if (!result) {
      this.spinner.hide();
      this.snackBar.open('Delete EAS', 'failed', { duration: 2000 });
      return false;
    }
    const fetched = await this.fetchData(null);
    if (!fetched) { return false; }

    this.snackBar.open('Delete EAS', 'success', { duration: 2000 });
  }

  ngOnDestroy() {
    this.fiscalYearSubs.unsubscribe();
    this.progressDataSubs.unsubscribe();
  }

  async onLinkChange(id: string, slider: MatSlideToggleChange) {
    this.spinner.show();

    const result = await this.sapEasService.setLink(id, slider.checked).toPromise().catch(error => { console.log(error); });
    if (!result) {
      this.spinner.hide();
      this.snackBar.open('Updating', 'failed', { duration: 2000 });
      return false;
    }

    const index = this.sapEases.findIndex(data => data.id === id);
    this.sapEases[index].isLinked = slider.checked;
    this.spinner.hide();
    this.snackBar.open('The data is', slider.checked ? 'linked' : 'unlinked', { duration: 2000 });
  }

  async onLockChange(id: string, slider: MatSlideToggleChange) {
    this.spinner.show();

    const result = await this.sapEasService.setLock(id, slider.checked).toPromise().catch(error => { console.log(error); });
    if (!result) {
      this.spinner.hide();
      this.snackBar.open('Updating', 'failed', { duration: 2000 });
      return false;
    }

    const index = this.sapEases.findIndex(data => data.id === id);
    this.sapEases[index].isLocked = slider.checked;
    this.spinner.hide();
    this.snackBar.open('Lock', slider.checked ? 'locked' : 'unlocked', { duration: 2000 });
  }

  async onBlurRemark(id: string, isLocked: boolean, event: any) {
    if (isLocked) { return false; }

    this.spinner.show();
    const result = await this.sapEasService.setRemark(id, event.target.value).toPromise().catch(error => { console.log(error); });
    if (!result) {
      this.spinner.hide();
      this.snackBar.open('Updating', 'failed', { duration: 2000 });
      return false;
    }

    const index = this.sapEases.findIndex(data => data.id === id);
    this.sapEases[index].remark = event.target.value;
    this.spinner.hide();
    this.snackBar.open('Remark', 'updated', { duration: 2000 });
  }

  exportToExcel() {
    this.sapEasService.exportToExcel(this.sapEases);
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
      const importRes = await this.sapEasService.importFromExcel(arrayBuffer).catch(error => { console.log(error); });
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
