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
import { SapActualFormComponent } from './data-import/sap-actual/sap-actual-form/sap-actual-form.component';
import { SapEasListComponent } from './data-import/sap-eas/sap-eas-list/sap-eas-list.component';
import { SapEasFormComponent } from './data-import/sap-eas/sap-eas-form/sap-eas-form.component';
import { SapComponent } from './data-import/sap/sap.component';
import { SapListComponent } from './data-import/sap/sap-list/sap-list.component';
import { SapDetailComponent } from './data-import/sap/sap-detail/sap-detail.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'data-import', component: DataImportComponent , children: [
    { path: '', redirectTo: 'sap-master', pathMatch: 'full' },
    { path: 'sap-master', component: SapComponent, children: [
      { path: '', redirectTo: 'sap-list', pathMatch: 'full' },
      { path: 'sap-list', component: SapListComponent },
      { path: 'sap-list/:orderNumber', component: SapListComponent }
    ] },
    { path: '', redirectTo: 'sap-detail', pathMatch: 'full' },
    { path: 'sap-detail', component: SapComponent, children: [
      { path: '', redirectTo: 'sap-detail', pathMatch: 'full' },
      { path: 'sap-list', component: SapDetailComponent },
      { path: 'sap-list/:orderNumber', component: SapDetailComponent }
    ] },
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
      { path: 'sap-actual-list/:id', component: SapActualListComponent },
      { path: 'sap-actual-form', component: SapActualFormComponent },
      { path: 'sap-actual-form/:id/:mode', component: SapActualFormComponent }
    ] },
    { path: 'sap-eas', component: SapEasComponent, children: [
      { path: '', redirectTo: 'sap-eas-list', pathMatch: 'full' },
      { path: 'sap-eas-list', component: SapEasListComponent },
      { path: 'sap-eas-list/:id', component: SapEasListComponent },
      { path: 'sap-eas-form', component: SapEasFormComponent },
      { path: 'sap-eas-form/:id/:mode', component: SapEasFormComponent }
    ] }
] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
