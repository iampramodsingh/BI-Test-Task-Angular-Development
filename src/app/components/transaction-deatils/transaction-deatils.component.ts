import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogContent } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute } from '@angular/router';
import { Icomments } from '../../Interface/comments.interface';
import { IMember } from '../../Interface/groups.interface';

@Component({
  selector: 'app-transaction-deatils',
  standalone: true,
  imports: [MatDialogContent ,ReactiveFormsModule ,CommonModule, DatePipe, FormsModule, MatCardModule, MatListModule, MatButtonModule, MatIconModule, MatInputModule],
  templateUrl: './transaction-deatils.component.html',
  styleUrl: './transaction-deatils.component.scss'
})
export class TransactionDeatilsComponent {
  form!: FormGroup
  transactionId: any;
  loggedInUser: any;
  transactionDetails: any;
  allComments: any[] = [];
  allTransactionsLocalStorage: any[] = [];
  indexInTransactionArray: any
 
  constructor(private route: ActivatedRoute) {
    this.form = new FormGroup({
      commentInput :new FormControl('', Validators.required)
  
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.transactionId = params['transactionId'];
    });
    this.loggedInUser = JSON.parse(localStorage.getItem('loggedinuser') as any);
    console.log(this.loggedInUser, this.transactionId);

    this.fetchTransactionDetails();
    this.fetchAllComments();
  }

  fetchTransactionDetails() {
    this.allTransactionsLocalStorage  = JSON.parse(localStorage.getItem('transactions') as any)
    this.indexInTransactionArray = this.allTransactionsLocalStorage.findIndex(transaction => transaction.transactionId === this.transactionId)
   this.transactionDetails = this.allTransactionsLocalStorage.filter((trasaction:any) => trasaction.transactionId === this.transactionId)[0]
    console.log(this.transactionDetails, this.allTransactionsLocalStorage)
  }

  fetchAllComments() {
    if (!localStorage.getItem('comments')) {
      // If it does not exist, initialize it with an empty array
      localStorage.setItem('comments', JSON.stringify([]));
    } else {
      // Now you can safely retrieve the comments
      console.log(this.transactionId, JSON.parse(localStorage.getItem('comments') as string))
      let comments = JSON.parse(localStorage.getItem('comments') as string).filter((comment: Icomments) => comment.transactionId == this.transactionId);
      console.log(comments);
      this.allComments = comments[0].comments;
      console.log(comments, this.transactionId, this.allComments);

    }
    
    
  }

  createComment() {
    // Check if 'comments' key exists in local storage, if not initialize it with an empty array
let comments = JSON.parse(localStorage.getItem('comments') as any) || [];

// Calculate the new commentId
const newId = (comments.length > 0 
  ? Math.max(...comments.flatMap((transaction: any) => transaction.comments.map((comment: any) => parseInt(comment.commentId, 10)))) + 1 
  : 1
).toString();

// Define the new comment object
const comment = {
  transactionId: this.transactionId,
  comment: this.form.value.commentInput,
  createdDate: new Date().toISOString(),
  commentId: newId,
  commentedBy: {
    memberName: this.loggedInUser.userName,
    userEmailId: this.loggedInUser.userEmailId,
  },
};

console.log(this.loggedInUser.userName, comment)

// Find or create the transaction
let transaction = comments.find((c: any) => c.transactionId === this.transactionId);
if (transaction) {
  transaction.comments.push(comment);
} else {
  comments.push({ transactionId: this.transactionId, comments: [comment] });
}

this.allComments.push(comment)

// Save updated comments back to local storage
localStorage.setItem('comments', JSON.stringify(comments));

this.form.reset();

  }

  updateTransaction(email:any) {
    let members = this.transactionDetails.membersOfTransaction;
    console.log(members)
    members.forEach((member: IMember) => {
      if (member.userEmailId == email) {
        member.paid = true;
      }
    });

    
    let obj = {
      ...this.transactionDetails,
      membersOfTransaction: members,
    }

    this.allTransactionsLocalStorage.splice(this.indexInTransactionArray, 1, obj);
    localStorage.setItem('transactions', JSON.stringify(this.allTransactionsLocalStorage));

    console.log(this.allTransactionsLocalStorage)
  }
}
