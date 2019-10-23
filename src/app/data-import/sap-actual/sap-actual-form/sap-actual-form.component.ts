import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SapActualService } from '../sap-actual.service';
import { SapActual } from '../sap-actual.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sap-actual-form',
  templateUrl: './sap-actual-form.component.html',
  styleUrls: ['./sap-actual-form.component.css']
})

export class SapActualFormComponent implements OnInit {
  title: string;
  subTitle: string;
  mode: string;
  form: FormGroup;
  id: string;
  username: string;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private sapActualService: SapActualService,
    private authService: AuthService
    ) {  }

  ngOnInit() {
    this.username = this.authService.getUserId();
    this.initForm();

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
        // Edit or Clone Item
        if (paramMap.has('mode')) {
          this.mode = paramMap.get('mode');
        }
        this.setForm();
      } else {
        // Insert New Item
        this.id = null;
        this.mode = 'new';
      }
    });

    if (this.mode === 'new' || this.mode === 'clone') {
      this.title = 'CREATE NEW ACTUAL';
      this.subTitle = 'Manually create a new SAP Actual';
    } else {
      this.title = 'EDIT';
      this.subTitle = 'Manually edit an existing SAP Actual';
    }
  }

  private async setForm() {
    const result = await this.sapActualService.getOne(this.id).toPromise().catch(error => { console.log(error); });
    if (!result) { return; }

    const data: SapActual = result.data;
    this.form.setValue({
          orderNumber: data.orderNumber,
          purchasingNumber: data.purchasingNumber || '',
          referenceNumber: data.referenceNumber,
          position: data.position,
          costElement: data.costElement,
          name: data.name || '',
          quantity: data.quantity,
          uom: data.uom || '',
          currency: data.currency,
          actualValue: data.actualValue,
          documentDate: data.documentDate,
          postingDate: data.postingDate,
          documentType: data.documentType,
          headerText: data.headerText || '',
          isLocked: data.isLocked,
          isLinked: data.isLinked,
          username: data.username,
          remark: data.remark
      });
  }

  private initForm() {
      this.form = new FormGroup({
      orderNumber: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      purchasingNumber: new FormControl(null),
      referenceNumber: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      position: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      costElement: new FormControl(null),
      name: new FormControl(null),
      quantity: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      uom: new FormControl(null),
      currency: new FormControl('IDR', { validators: Validators.required, updateOn: 'blur' }),
      actualValue: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      documentDate: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      postingDate: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      documentType: new FormControl(null),
      headerText: new FormControl(null),
      isLocked: new FormControl(false),
      isLinked: new FormControl(true),
      remark: new FormControl(),
      username: new FormControl(this.username, { validators: Validators.required, updateOn: 'blur' })
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    if ((this.mode === 'new' || this.mode === 'clone') ) {
      this.createOne();
    } else if (this.mode === 'edit' && this.id) {
      this.updateOne();
    }
  }

  private async createOne() {
    const data: SapActual = {
      id: null,
      year: null,
      month: null,
      lastUpdateAt: null,
      lastUpdateBy: null,
      orderNumber: this.form.value.orderNumber,
      purchasingNumber: this.form.value.purchasingNumber,
      referenceNumber: this.form.value.referenceNumber,
      position: this.form.value.position,
      costElement: this.form.value.costElement,
      name: this.form.value.name,
      quantity: this.form.value.quantity,
      uom: this.form.value.uom,
      currency: this.form.value.currency,
      actualValue: this.form.value.actualValue,
      documentDate: new Date(this.form.value.documentDate),
      postingDate: new Date(this.form.value.postingDate),
      documentType: this.form.value.documentType,
      headerText: this.form.value.headerText,
      username: this.form.value.username,
      remark: this.form.value.remark,
      isLocked: this.form.value.isLocked,
      isLinked: this.form.value.isLinked
    };

    const result = await this.sapActualService.createOne(data).toPromise().catch(error => { console.log(error); });
    if (!result) { return; }

    this.id = result.data.id || null;
    this.router.navigate(['data-import', 'sap-actual', 'sap-actual-list', this.id]);
  }

  private async updateOne() {
    const data: SapActual = {
      id: null,
      year: null,
      month: null,
      lastUpdateAt: null,
      lastUpdateBy: null,
      orderNumber: this.form.value.orderNumber,
      purchasingNumber: this.form.value.purchasingNumber,
      referenceNumber: this.form.value.referenceNumber,
      position: this.form.value.position,
      costElement: this.form.value.costElement,
      name: this.form.value.name,
      quantity: this.form.value.quantity,
      uom: this.form.value.uom,
      currency: this.form.value.currency,
      actualValue: this.form.value.actualValue,
      documentDate: new Date(this.form.value.documentDate),
      postingDate: new Date(this.form.value.postingDate),
      documentType: this.form.value.documentType,
      headerText: this.form.value.headerText,
      username: this.form.value.username,
      remark: this.form.value.remark,
      isLocked: this.form.value.isLocked,
      isLinked: this.form.value.isLinked
    };

    const result = await this.sapActualService.patchOne(this.id, data).toPromise().catch(error => { console.log(error); });
    if (!result) { return; }

    this.id = result.data.id;
    this.router.navigate(['data-import', 'sap-actual', 'sap-actual-list', this.id]);
  }

  onClear() {
    this.form.reset();
  }
  onCancel() {
    // this.location.back();
    if (!this.id) { this.id = ''; }
    this.router.navigate(['data-import', 'sap-actual', 'sap-actual-list', this.id]);
  }
}
