import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../angular-material.module';
import { SapActualComponent } from './sap-actual/sap-actual.component';
import { EasComponent } from './eas/eas.component';
import { CommonModule } from '@angular/common';
import { SapCommitmentListComponent } from './sap-commitment/sap-commitment-list/sap-commitment-list.component';
import { SapCommitmentFormComponent } from './sap-commitment/sap-commitment-form/sap-commitment-form.component';
import { RouterModule } from '@angular/router';
import { SapCommitmentComponent } from './sap-commitment/sap-commitment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    SapCommitmentComponent,
    SapCommitmentListComponent,
    SapCommitmentFormComponent,
    SapActualComponent,
    EasComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [
    SapCommitmentComponent,
    SapCommitmentListComponent,
    SapCommitmentFormComponent,
    SapActualComponent,
    EasComponent,
  ],
  entryComponents: [
  ]
})
export class DataImportModule {}
