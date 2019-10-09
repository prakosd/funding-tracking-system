import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SapCommitmentService } from '../sap-commitment.service';
import { SapCommitment } from '../sap-commitment.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sap-commitment-form',
  templateUrl: './sap-commitment-form.component.html',
  styleUrls: ['./sap-commitment-form.component.css']
})

export class SapCommitmentFormComponent implements OnInit {
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
    private sapCommitmentService: SapCommitmentService,
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
      this.title = 'CREATE NEW COMMITMENT';
      this.subTitle = 'Manually create a new SAP commitment';
    } else {
      this.title = 'EDIT';
      this.subTitle = 'Manually edit an existing SAP Commitment';
    }
  }

  private async setForm() {
    const result = await this.sapCommitmentService.getOne(this.id).toPromise().catch(error => { console.log(error); });
    if (!result) { return; }

    const data: SapCommitment = result.data;
    this.form.setValue({
          orderNumber: data.orderNumber,
          category: data.category,
          documentNumber: data.documentNumber,
          name: data.name,
          position: data.position,
          quantity: data.quantity,
          uom: data.uom,
          costElement: data.costElement,
          currency: data.currency,
          actualValue: data.actualValue,
          planValue: data.planValue,
          documentDate: data.documentDate,
          debitDate: data.debitDate,
          isLocked: data.isLocked,
          isLinked: data.isLinked,
          username: data.username,
          remark: data.remark
      });
  }

  private initForm() {
      this.form = new FormGroup({
      orderNumber: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      category: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      documentNumber: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      name: new FormControl(null),
      position: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      quantity: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      uom: new FormControl(null),
      costElement: new FormControl(null),
      currency: new FormControl('IDR', { validators: Validators.required, updateOn: 'blur' }),
      actualValue: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      planValue: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      documentDate: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      debitDate: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
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
    const data: SapCommitment = {
      id: null,
      year: null,
      month: null,
      lastUpdateAt: null,
      lastUpdateBy: null,
      orderNumber: this.form.value.orderNumber,
      category: this.form.value.category,
      documentNumber: this.form.value.documentNumber,
      position: this.form.value.position,
      costElement: this.form.value.costElement,
      name: this.form.value.name,
      quantity: this.form.value.quantity,
      uom: this.form.value.uom,
      currency: this.form.value.currency,
      actualValue: this.form.value.actualValue,
      planValue: this.form.value.planValue,
      documentDate: new Date(this.form.value.documentDate),
      debitDate: new Date(this.form.value.debitDate),
      username: this.form.value.username,
      remark: this.form.value.remark,
      isLocked: this.form.value.isLocked,
      isLinked: this.form.value.isLinked
    };

    const result = await this.sapCommitmentService.createOne(data).toPromise().catch(error => { console.log(error); });
    if (!result) { return; }

    this.id = result.data.id || null;
    this.router.navigate(['data-import', 'sap-commitment', 'sap-commitment-list', this.id]);
  }

  private async updateOne() {
    const data: SapCommitment = {
      id: null,
      year: null,
      month: null,
      lastUpdateAt: null,
      lastUpdateBy: null,
      orderNumber: this.form.value.orderNumber,
      category: this.form.value.category,
      documentNumber: this.form.value.documentNumber,
      position: this.form.value.position,
      costElement: this.form.value.costElement,
      name: this.form.value.name,
      quantity: this.form.value.quantity,
      uom: this.form.value.uom,
      currency: this.form.value.currency,
      actualValue: this.form.value.actualValue,
      planValue: this.form.value.planValue,
      documentDate: new Date(this.form.value.documentDate),
      debitDate: new Date(this.form.value.debitDate),
      username: this.form.value.username,
      remark: this.form.value.remark,
      isLocked: this.form.value.isLocked,
      isLinked: this.form.value.isLinked
    };

    const result = await this.sapCommitmentService.patchOne(this.id, data).toPromise().catch(error => { console.log(error); });
    if (!result) { return; }

    this.id = result.data.id;
    this.router.navigate(['data-import', 'sap-commitment', 'sap-commitment-list', this.id]);
  }

  onClear() {
    this.form.reset();
  }
  onCancel() {
    // this.location.back();
    if (!this.id) { this.id = ''; }
    this.router.navigate(['data-import', 'sap-commitment', 'sap-commitment-list', this.id]);
  }
}
