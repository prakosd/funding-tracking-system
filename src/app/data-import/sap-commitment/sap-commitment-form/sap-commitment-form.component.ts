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
  isLoading: boolean;
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
    this.isLoading = false;
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

  private setForm() {
    // get from REST API
    this.isLoading = true;
    this.sapCommitmentService.getOne(this.id).subscribe(result => {
      const data: SapCommitment = result.sapCommitment;
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
          username: data.username
      });
      this.isLoading = false;
      if (this.mode === 'edit') {
        this.form.get('orderNumber').disable();
        this.form.get('documentNumber').disable();
        this.form.get('position').disable();
      }
    }, error => {
      console.log(error);
      this.isLoading = false;
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
      isLocked: new FormControl(true),
      isLinked: new FormControl(true),
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

  private createOne() {
    this.isLoading = true;
    const newSapCommitment: SapCommitment = {
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
      isLocked: this.form.value.isLocked,
      isLinked: this.form.value.isLinked
    };

    this.sapCommitmentService.createOne(newSapCommitment).subscribe((result: { message: string, id: string }) => {
      this.isLoading = false;
      this.router.navigate(['data-import', 'sap-commitment', 'sap-commitment-list']);
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  private updateOne() {
    this.isLoading = true;
    const newSapCommitment: SapCommitment = {
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
      isLocked: this.form.value.isLocked,
      isLinked: this.form.value.isLinked
    };

    this.sapCommitmentService.updateOne(this.id, newSapCommitment).subscribe((result: { message: string, id: string }) => {
      this.isLoading = false;
      this.router.navigate(['data-import', 'sap-commitment', 'sap-commitment-list']);
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  onClear() {
    this.form.reset();
  }
  onCancel() {
    this.location.back();
  }
}
