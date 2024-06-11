import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { Iuser } from '../../Interface/user.interface';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IMember, Igroup } from '../../Interface/groups.interface';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Itransactions } from '../../Interface/transactions.interface';
import {MatTableModule} from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { CheckDialogComponent } from '../check-dialog/check-dialog.component';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [MatListModule, MatTableModule, MatSnackBarModule ,MatCheckboxModule, FormsModule, CommonModule, MatButtonModule, MatCardModule, MatDividerModule, MatIconModule, ReactiveFormsModule, CommonModule, MatInputModule, MatIconModule ,MatInputModule ,MatFormFieldModule ,CommonModule ,MatButtonModule, ReactiveFormsModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss'
})
export class TransactionComponent implements OnInit {
  @ViewChild('tname') transactionNameField: any;
  transactionForm!: FormGroup;
  groupId!: any;
  loggedInUser!: Iuser;
  start = false;
  groupMemberForCheckbox: any;
  groupMember: IMember[] = [];
  allTransactions: Itransactions[] = [];
  totalOfAllTransactions = { amount: 0 };
  totalOfPartOfTransactions = { amount: 0 };
  userPartOfTransactions: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private snackbar : MatSnackBar,
    public dialog: MatDialog
  ) {}

  
  displayedColumns: string[] = ['expenses', 'amount', 'settlement'];
  allExpensesColumns: string[] = ['expenses', 'amount'];

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.groupId = params['groupId'];
    });

    this.loggedInUser = JSON.parse(localStorage.getItem('loggedinuser') as any);
    console.log(this.loggedInUser)
    this.initiateTransactionForm();
    this.getGroupData();
    this.getAllTransactions();
  }

  initiateTransactionForm() {
    this.transactionForm = this.formBuilder.group({
      transactionName: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(1)]],
      membersOfTransaction: new FormArray([], this.minSelectedCheckboxes(1)),
      upiId: [''],
    });
    this.start = true;
  }

  get membersOfTransactionFormArray() {
    return this.transactionForm.controls['membersOfTransaction'] as FormArray;
  }

   minSelectedCheckboxes(min = 1): ValidatorFn {
    return (formArray: AbstractControl) => {
      if (!(formArray instanceof FormArray)) {
        // If the formArray is not an instance of FormArray, return null
        return null;
      }
  
      const totalSelected = formArray.controls
        .map(control => control.value)
        .reduce((prev, next) => (next ? prev + next : prev), 0);
  
      return totalSelected >= min ? null : { required: true };
    };
  }



  getGroupData() {
    const groups = localStorage.getItem('groups')
    const data = JSON.parse(groups as any).filter((groupId: Igroup) => groupId.groupId == this.groupId)
    console.log(data)

    const groupmemberwithpaidflag = data[0]?.members;
      data[0]?.members.forEach((member: IMember) => {
        member.paid = false;
      });
      console.log(groupmemberwithpaidflag)
      this.groupMember = groupmemberwithpaidflag;
      this.groupMemberForCheckbox = this.groupMember?.filter((ele) => {
        console.log(ele.userEmailId,'====>', this.loggedInUser.userEmailId)
        return ele.userEmailId != this.loggedInUser.userEmailId;
      });

      console.log(this.groupMemberForCheckbox)

      this.addCheckboxes();
  }

  private addCheckboxes() {
    this.groupMemberForCheckbox?.forEach((member: IMember) => {
      this.membersOfTransactionFormArray.push(new FormControl(false));
    });
  }

  addNewTransaction() {
    const transactionMembers = this.transactionForm.value.membersOfTransaction
    .map((checked:Igroup, i:number) => (checked ? this.groupMemberForCheckbox[i] : null))
    .filter((v:any) => v !== null);

    const transactionMembersWithinitiator = [
      ...transactionMembers,

      {
        memberName: this.loggedInUser.userName,
        userEmailId: this.loggedInUser.userEmailId,
        paid: false,
      },
    ];

    const newCreatedDate = new Date().toISOString();
    
    let user = JSON.parse(localStorage.getItem('loggedinuser') as any);
    let transactions = JSON.parse(localStorage.getItem('transactions') as any) || [];
    console.log(transactions)
    const maxId = transactions.length > 0  ? Math.max(...transactions.map((transaction: Itransactions) => parseInt(transaction.transactionId, 10))) : 0;
    const newId = (maxId + 1).toString();
    
    const payloadForCreateTransaction = {
      groupId: this.groupId,
      transactionName: this.transactionForm.controls['transactionName'].value,
      initiatedBy: {
        memberName: user.userName,
        userEmailId: user.userEmailId,
      },
      amount: this.transactionForm.controls['amount'].value,
      membersOfTransaction: transactionMembersWithinitiator,
      upiId: this.transactionForm.controls?.['upiId'].value,
      createdDate: newCreatedDate,
      transactionId: newId
    };
    transactions.push(payloadForCreateTransaction);
    console.log(transactions)
    localStorage.setItem('transactions', JSON.stringify(transactions));
    setTimeout(() => {
      this.getAllTransactions();
    }, 1000);
    this.transactionForm.reset();
    this.snackbar.open('Transaction Created', 'ok', {
      duration: 5000,
    });
  }



  getAllTransactions() {
      const allTransactions = JSON.parse(localStorage.getItem('transactions') as any)
      const myTransactions = allTransactions?.filter((transaction: Itransactions) => {
        
      return transaction.groupId === this.groupId
      } );
      console.log(myTransactions)
      this.allTransactions = myTransactions?.reverse();
      this.totalOfAllTransactions = this.allTransactions?.reduce(
        (previousValue, currentValue) => ({
          amount: previousValue.amount + currentValue.amount,
        }),
        { amount: 0 }
      );
      // console.log(this.totalOfAllTransactions)
      this.partOfTransactions();
  }


  partOfTransactions() {
    this.userPartOfTransactions = [];
    let user = JSON.parse(localStorage.getItem('loggedinuser') as any);
    this.allTransactions?.forEach((ele:Itransactions) => {
      ele['membersOfTransaction'].forEach((ele2: IMember) => {
        if (ele2?.['userEmailId'] == user.userEmailId) {
          if (!this.userPartOfTransactions.includes(ele as Itransactions as any as unknown as never)) {
            this.userPartOfTransactions.push(ele as Itransactions as any as unknown as never);
          }
        }
      });
    });

   

    this.totalOfPartOfTransactions = this.userPartOfTransactions?.reduce(
      (previousValue:any, currentValue:any) => ({
        amount: previousValue.amount + currentValue.amount,
      }),
      { amount: 0 }
    );
    // setTimeout(() => {
    //   this.showSuccess = false;
    // }, 1000);
  }

  focusOnTransactionName() {
    this.transactionNameField.nativeElement.focus();
  }

  scroll(el: HTMLElement) {
    console.log(el);
    el.scrollIntoView({ behavior: 'smooth' });
  }

  assigntransactionToModal(data:Itransactions) {
    console.log(data)
    const dialogRef = this.dialog.open(CheckDialogComponent, {
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
