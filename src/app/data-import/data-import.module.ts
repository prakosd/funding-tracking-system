import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SapCommitmentComponent } from './sap-commitment/sap-commitment.component';
import { SapCommitmentListComponent } from './sap-commitment/sap-commitment-list/sap-commitment-list.component';
import { SapCommitmentFormComponent } from './sap-commitment/sap-commitment-form/sap-commitment-form.component';
import { SapActualComponent } from './sap-actual/sap-actual.component';
import { SapActualListComponent } from './sap-actual/sap-actual-list/sap-actual-list.component';
import { SapActualFormComponent } from './sap-actual/sap-actual-form/sap-actual-form.component';
import { SapEasComponent } from './sap-eas/sap-eas.component';
import { SapEasListComponent } from './sap-eas/sap-eas-list/sap-eas-list.component';
import { SapEasFormComponent } from './sap-eas/sap-eas-form/sap-eas-form.component';
import { SapComponent } from './sap/sap.component';
import { SapListComponent } from './sap/sap-list/sap-list.component';

@NgModule({
  declarations: [
    SapCommitmentComponent,
    SapCommitmentListComponent,
    SapCommitmentFormComponent,
    SapActualComponent,
    SapActualListComponent,
    SapActualFormComponent,
    SapEasComponent,
    SapEasListComponent,
    SapEasFormComponent,
    SapComponent,
    SapListComponent
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    FormsModule
  ],
  exports: [
    SapCommitmentComponent,
    SapCommitmentListComponent,
    SapCommitmentFormComponent,
    SapActualComponent,
    SapActualListComponent,
    SapActualFormComponent,
    SapEasComponent,
    SapEasListComponent,
    SapEasFormComponent,
    SapComponent,
    SapListComponent
  ],
  entryComponents: [
  ]
})
export class DataImportModule {}
