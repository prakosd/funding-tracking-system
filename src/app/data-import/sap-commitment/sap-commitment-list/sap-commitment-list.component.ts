import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SapCommitmentService } from '../sap-commitment.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SapCommitment } from '../sap-commitment.model';
import { MatTableDataSource, MatSlideToggleChange } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { DataImportService } from '../../data-import.service';
import { ActivatedRoute, Router } from '@angular/router';


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
  isLoading: boolean;
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
    private route: ActivatedRoute,
    private router: Router,
    ) { }

  ngOnInit() {
    this.isLoading = false;
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

  onUpdateOne(id: string) {
    this.router.navigate(['../sap-commitment-form', 'edit', id], {relativeTo: this.route});
  }

  fetchData(expandedId: string | null) {
    this.isLoading = true;
    this.sapCommitmentService.getMany(this.fiscalYear)
    .subscribe((result: { message: string; sapCommitments: SapCommitment[] }) => {
      this.sapCommitments = result.sapCommitments;
      this.dataSource = new MatTableDataSource(this.sapCommitments);
      this.dataSource.sort = this.sort;
      this.isLoading = false;
      if (expandedId) {
        this.expandedElement = this.sapCommitments.filter(row => row.id === expandedId)[0];
      }
    }, error => {
      console.log(error);
      this.isLoading = false;
    });
  }

  onDeleteOne(id: string) {
    this.isLoading = true;
    this.sapCommitmentService.deleteOne(id).subscribe(result => {
      this.fetchData(null);
    }, error => {
      console.log(error);
      this.isLoading = false;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.fiscalYearSubs.unsubscribe();
  }

  onLinkChange(id: string, slider: MatSlideToggleChange) {
    this.isLoading = true;
    this.sapCommitmentService.setLink(id, slider.checked).subscribe(result => {
      this.isLoading = false;
      this.fetchData(id);
    }, error => {
      console.log(error);
      this.isLoading = false;
    });
  }

  onLockChange(id: string, slider: MatSlideToggleChange) {
    this.isLoading = true;
    this.sapCommitmentService.setLock(id, slider.checked).subscribe(result => {
      this.isLoading = false;
      this.fetchData(id);
    }, error => {
      console.log(error);
      this.isLoading = false;
    });
  }
}
