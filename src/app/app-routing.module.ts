import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DataImportComponent } from './data-import/data-import.component';
import { SapCommitmentListComponent } from './data-import/sap-commitment/sap-commitment-list/sap-commitment-list.component';
import { SapActualComponent } from './data-import/sap-actual/sap-actual.component';
import { SapEasComponent } from './data-import/sap-eas/sap-eas.component';
import { SapCommitmentFormComponent } from './data-import/sap-commitment/sap-commitment-form/sap-commitment-form.component';
import { SapCommitmentComponent } from './data-import/sap-commitment/sap-commitment.component';
import { SapActualListComponent } from './data-import/sap-actual/sap-actual-list/sap-actual-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'data-import', component: DataImportComponent , children: [
    { path: '', redirectTo: 'sap-commitment', pathMatch: 'full' },
    { path: 'sap-commitment', component: SapCommitmentComponent, children: [
      { path: '', redirectTo: 'sap-commitment-list', pathMatch: 'full' },
      { path: 'sap-commitment-list', component: SapCommitmentListComponent },
      { path: 'sap-commitment-list/:id', component: SapCommitmentListComponent },
      { path: 'sap-commitment-form', component: SapCommitmentFormComponent },
      { path: 'sap-commitment-form/:id/:mode', component: SapCommitmentFormComponent }
    ] },
    { path: 'sap-actual', component: SapActualComponent, children: [
      { path: '', redirectTo: 'sap-actual-list', pathMatch: 'full' },
      { path: 'sap-actual-list', component: SapActualListComponent },
      { path: 'sap-actual-list/:id', component: SapActualListComponent }
    ] },
    { path: 'sap-eas', component: SapEasComponent, children: [] }
] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
