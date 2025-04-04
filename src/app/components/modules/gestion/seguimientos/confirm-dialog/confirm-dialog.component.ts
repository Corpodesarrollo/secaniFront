import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [ButtonModule, DynamicDialogModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  constructor(public ref: DynamicDialogRef) {}

  onSave() {
    this.ref.close(true);
  }

  onCancel() {
    this.ref.close(false);
  }
}
