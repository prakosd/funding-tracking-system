import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SapEasService } from '../sap-eas.service';
import { SapEas } from '../sap-eas.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sap-eas-form',
  templateUrl: './sap-eas-form.component.html',
  styleUrls: ['./sap-eas-form.component.css']
})

export class SapEasFormComponent implements OnInit {
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
    private sapEasService: SapEasService,
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
      this.title = 'CREATE NEW EAS';
      this.subTitle = 'Manually create a new SAP EAS';
    } else {
      this.title = 'EDIT';
      this.subTitle = 'Manually edit an existing SAP EAS';
    }
  }

  private async setForm() {
    const result = await this.sapEasService.getOne(this.id).toPromise().catch(error => { console.log(error); });
    if (!result) { return; }

    const data: SapEas = result.data;
    this.form.setValue({
        requisitionNumber: data.requisitionNumber,
        subject: data.subject,
        currency: data.currency,
        amount: data.amount,
        dept: data.dept,
        costCenter: data.costCenter,
        requestor: data.requestor,
        recipient: data.recipient,
        approver: data.approver,
        status: data.status,
        creationDate: data.creationDate,
        etaRequest: data.etaRequest,
        remark: data.remark || '',
        isLocked: this.mode === 'edit' ? data.isLocked : true,
        isLinked: data.isLinked
      });
  }

  private initForm() {
      this.form = new FormGroup({
      requisitionNumber: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      subject: new FormControl(null),
      currency: new FormControl('IDR', { validators: Validators.required, updateOn: 'blur' }),
      amount: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      dept: new FormControl(null),
      costCenter: new FormControl(null),
      requestor: new FormControl(null),
      recipient: new FormControl(null),
      approver: new FormControl(null),
      status: new FormControl(null),
      creationDate: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      etaRequest: new FormControl(null, { validators: Validators.required, updateOn: 'blur' }),
      remark: new FormControl(),
      isLocked: new FormControl(true),
      isLinked: new FormControl(true)
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
    const data: SapEas = {
      id: null,
      year: null,
      month: null,
      lastUpdateAt: null,
      lastUpdateBy: null,
      requisitionNumber: this.form.value.requisitionNumber,
      subject: this.form.value.subject,
      currency: this.form.value.currency,
      amount: this.form.value.amount,
      dept: this.form.value.dept,
      costCenter: this.form.value.costCenter,
      requestor: this.form.value.requestor,
      recipient: this.form.value.recipient,
      approver: this.form.value.approver,
      status: this.form.value.status,
      creationDate: new Date(this.form.value.creationDate),
      etaRequest: new Date(this.form.value.etaRequest),
      remark: this.form.value.remark,
      isLocked: this.form.value.isLocked,
      isLinked: this.form.value.isLinked
    };

    const result = await this.sapEasService.createOne(data).toPromise().catch(error => { console.log(error); });
    if (!result) { return; }

    this.id = result.data.id || null;
    this.router.navigate(['data-import', 'sap-eas', 'sap-eas-list', this.id]);
  }

  private async updateOne() {
    const data: SapEas = {
      id: null,
      year: null,
      month: null,
      lastUpdateAt: null,
      lastUpdateBy: null,
      requisitionNumber: this.form.value.requisitionNumber,
      subject: this.form.value.subject,
      currency: this.form.value.currency,
      amount: this.form.value.amount,
      dept: this.form.value.dept,
      costCenter: this.form.value.costCenter,
      requestor: this.form.value.requestor,
      recipient: this.form.value.recipient,
      approver: this.form.value.approver,
      status: this.form.value.status,
      creationDate: new Date(this.form.value.creationDate),
      etaRequest: new Date(this.form.value.etaRequest),
      remark: this.form.value.remark,
      isLocked: this.form.value.isLocked,
      isLinked: this.form.value.isLinked
    };

    const result = await this.sapEasService.patchOne(this.id, data).toPromise().catch(error => { console.log(error); });
    if (!result) { return; }

    this.id = result.data.id;
    this.router.navigate(['data-import', 'sap-eas', 'sap-eas-list', this.id]);
  }

  onClear() {
    this.form.reset();
  }
  onCancel() {
    // this.location.back();
    if (!this.id) { this.id = ''; }
    this.router.navigate(['data-import', 'sap-eas', 'sap-eas-list', this.id]);
  }
}
