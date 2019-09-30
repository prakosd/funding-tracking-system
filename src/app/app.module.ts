import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { DataImportModule } from './data-import/data-import.module';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { DataImportComponent } from './data-import/data-import.component';
import { MatNativeDateModule } from '@angular/material';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    DataImportComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularMaterialModule,
    DataImportModule,
    MatNativeDateModule
  ],
  entryComponents: [ConfirmationDialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
