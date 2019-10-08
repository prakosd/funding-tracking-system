import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-sap-commitment-form-dialog',
  templateUrl: './sap-commitment-form-dialog.component.html',
  styleUrls: ['./sap-commitment-form-dialog.component.css']
})

export class SapCommitmentFormDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<SapCommitmentFormDialogComponent>) {}

  ngOnInit() {

  }
  onSubmit() {
    this.dialogRef.close();
  }
}
