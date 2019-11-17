import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { Sap } from '../sap.model';
import { Subscription } from 'rxjs';
import { SapService } from '../sap.service';
import { DataImportService } from '../../data-import.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sap-list',
  templateUrl: './sap-list.component.html',
  styleUrls: ['./sap-list.component.css', './sap-list-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed, void => expanded', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class SapListComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  searchField = '';
  saps: Sap[];
  fiscalYearSubs: Subscription;
  fiscalYear: number;
  dataSource: MatTableDataSource<Sap>;
  expandedElement;
  expandedId: string | null;
  displayedColumns = [
    'no', 'orderNumber', 'prActual', 'prPlan', 'poActual', 'poPlan', 'actualized'
  ];

  constructor(
    private sapService: SapService,
    private dataImportService: DataImportService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('orderNumber')) {
        this.expandedId = paramMap.get('orderNumber');
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params.filter) {
        this.searchField = params.filter;
      }
    });

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
    const result = await this.sapService.getMany(this.fiscalYear).toPromise().catch(error => { console.log(error); });
    if (!result) { return false; }

    this.saps = result.data;
    this.dataSource = new MatTableDataSource(this.saps);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    if (expandedId) {
      this.expandedElement = this.saps.filter(row => row.orderNumber === expandedId)[0];
    }
    this.spinner.hide();
    return true;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.fiscalYearSubs.unsubscribe();
  }
}
