import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Inject, Component } from '@angular/core';

export interface ConfirmationDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
