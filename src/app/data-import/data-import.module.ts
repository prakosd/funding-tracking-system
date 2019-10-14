import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../angular-material.module';
import { SapActualComponent } from './sap-actual/sap-actual.component';
import { SapEasComponent } from './sap-eas/sap-eas.component';
import { CommonModule } from '@angular/common';
import { SapCommitmentListComponent } from './sap-commitment/sap-commitment-list/sap-commitment-list.component';
import { SapCommitmentFormComponent } from './sap-commitment/sap-commitment-form/sap-commitment-form.component';
import { RouterModule } from '@angular/router';
import { SapCommitmentComponent } from './sap-commitment/sap-commitment.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    SapCommitmentComponent,
    SapCommitmentListComponent,
    SapCommitmentFormComponent,
    SapActualComponent,
    SapEasComponent,
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
    SapEasComponent,
  ],
  entryComponents: [
  ]
})
export class DataImportModule {}
