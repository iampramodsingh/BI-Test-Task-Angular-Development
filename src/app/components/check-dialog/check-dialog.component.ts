import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Itransactions } from '../../Interface/transactions.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-check-dialog',
  standalone: true,
  imports: [RouterModule, MatIconModule ,MatInputModule ,MatFormFieldModule ,CommonModule ,MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, ReactiveFormsModule],
  templateUrl: './check-dialog.component.html',
  styleUrl: './check-dialog.component.scss'
})
export class CheckDialogComponent {
  loggedInUser: any
  transactionSettled: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: Itransactions) {
    this.loggedInUser = JSON.parse(localStorage.getItem('loggedinuser') as any);
    console.log(this.loggedInUser)
    console.log(data); // This will log the transaction data passed to the dialog
    let count = 1;
    if (
      data.initiatedBy.userEmailId ==
      this.loggedInUser.userEmailId
    ) {
      data.membersOfTransaction.forEach((ele) => {
        if (ele?.paid) {
          count++;
        }
      });
      if (count == data.membersOfTransaction.length) {
        this.transactionSettled = true;
      }
    }
  }
}
