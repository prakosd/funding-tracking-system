import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DataImportComponent } from './data-import/data-import.component';
import { SapCommitmentListComponent } from './data-import/sap-commitment/sap-commitment-list/sap-commitment-list.component';
import { SapActualComponent } from './data-import/sap-actual/sap-actual.component';
import { EasComponent } from './data-import/eas/eas.component';
import { SapCommitmentFormComponent } from './data-import/sap-commitment/sap-commitment-form/sap-commitment-form.component';
import { SapCommitmentComponent } from './data-import/sap-commitment/sap-commitment.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'data-import', component: DataImportComponent , children: [
    { path: '', redirectTo: 'sap-commitment', pathMatch: 'full' },
    { path: 'sap-commitment', component: SapCommitmentComponent, children: [
      { path: '', redirectTo: 'sap-commitment-list', pathMatch: 'full' },
      { path: 'sap-commitment-list', component: SapCommitmentListComponent },
      { path: 'sap-commitment-form', component: SapCommitmentFormComponent },
      { path: 'sap-commitment-form/:mode/:id', component: SapCommitmentFormComponent },
      { path: 'sap-commitment-form/:mode/:id', component: SapCommitmentFormComponent }
    ] },
    { path: 'sap-actual', component: SapActualComponent, children: [] },
    { path: 'eas', component: EasComponent, children: [] }
] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
