import { Component } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Igroup } from '../../Interface/groups.interface';
import { Iuser } from '../../Interface/user.interface';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-create-group-dialog',
  standalone: true,
  imports: [MatAutocompleteModule ,MatIconModule ,MatInputModule ,MatFormFieldModule ,CommonModule ,MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, ReactiveFormsModule],
  templateUrl: './create-group-dialog.component.html',
  styleUrl: './create-group-dialog.component.scss'
})
export class CreateGroupDialogComponent {
  createGroupForm!: FormGroup;
  autoCompleteUser : any = []
  constructor(public api: ApiService, public dialogRef: MatDialogRef<CreateGroupDialogComponent>, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.autoCompleteUser = JSON.parse(localStorage.getItem('user') as any)
    console.log(this.autoCompleteUser)
    this.toInitializeCreateGroupForm();
  } 

  toInitializeCreateGroupForm() {
    this.createGroupForm = this.formBuilder.group({
      groupName: ['', Validators.required],
      members: this.formBuilder.array([this.addMemberFormGroup()]),
    });
  }


  addMemberFormGroup() {
    return this.formBuilder.group({
      memberName: ['', Validators.required],
      userEmailId: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
    });
  }



get members() {
  return this.createGroupForm.get('members') as FormArray;
}

  addMemberButtonClick(): void {
    (<FormArray>this.createGroupForm.get('members')).push(
      this.addMemberFormGroup()
    );
  }

  getMembersFormControl(): AbstractControl[] {
    return (<FormArray>this.createGroupForm.get('members')).controls;
  }
  pointAt(index:any) {
    return (<FormArray>this.createGroupForm.get('members')).at(index);
  }

  removemember(index:any) {
    (this.createGroupForm.get('members') as FormArray).removeAt(index);
  }

  createGroup() {
    var users = JSON.parse(localStorage.getItem('user') as any);
    console.log(users)
    let LoggedInUser = JSON.parse(localStorage.getItem('loggedinuser') as any).userEmailId
    const user = users.find((u:Iuser) => u.userEmailId === LoggedInUser );
    console.log(user);
    let obj = [{ memberName: user.userName, userEmailId: user.userEmailId }];

    this.createGroupForm.value.members = [
      ...this.createGroupForm.value.members,
      ...obj,
    ];

    console.log(this.createGroupForm.value)
    if(this.createGroupForm.valid) {
      let groups = JSON.parse(localStorage.getItem('groups') as any) || [];
      const maxId = groups.length > 0  ?  Math.max(...groups.map((group: Igroup) => parseInt(group.id, 10))): 0;
      const maxGroupId = groups.length > 0  ?  Math.max(...groups.map((group: Igroup) => group.groupId)) : 0;
      console.log(groups)
      const newId = (maxId + 1).toString();
      const newGroupId = maxGroupId + 1;
      console.log(newGroupId, newId)

  
    
      // Create a new date for createdDate
      const newCreatedDate = new Date().toISOString();

      const newGroup = {
        id: newId,
        groupId: newGroupId,
        groupName: this.createGroupForm.value.groupName,
        members: this.createGroupForm.value.members,
        createdDate: newCreatedDate,
      };
      groups.push(newGroup)

      localStorage.setItem('groups', JSON.stringify(groups));
      
      // const updatedUser = this.createGroupForm.value.members.map((res:any, i:any) => {
      //   console.log(res)
      //   if(res.userEmailId === users[i].userEmailId) {
      //     return {
      //       userName: users[i].userName,
      //       userEmailId: users[i].userEmailId,
      //       groupsInvolved: res.groupsInvolved && res.groupsInvolved.length > 0 ? [...res.groupsInvolved, newGroupId]: [newGroupId],
      //       password: users[i].password
      //     }
      //   }
      //    else {
      //     return {
      //       userName: users[i].userName,
      //       userEmailId: users[i].userEmailId,
      //       groupsInvolved: res.groupsInvolved && res.groupsInvolved.length > 0 ? [...res.groupsInvolved, newGroupId]: [newGroupId],
      //       password: users[i].password
      //     }
      //   }
       
      // })

    //   console.log(updatedUser)
    //   console.log(users)
    //   // console.log(this.createGroupForm.value.members)
    //   updatedUser.forEach((q:any) => {
    //     const index = users.findIndex((user:Iuser) => user.userEmailId === q.userEmailId);
    //     if (index !== -1) {
    //         users.splice(index, 1, q);
    //     }
    // });


users.forEach((user:any) => {
    const formMember = this.createGroupForm.value.members.find((res:any) => res.userEmailId === user.userEmailId);

    if (formMember) {
        user.userName = user.userName;
        user.groupsInvolved = user.groupsInvolved && user.groupsInvolved.length > 0
            ? [...user.groupsInvolved, newGroupId]
            : [newGroupId];
        user.password = user.password;
    }
});

    
      localStorage.setItem('user', JSON.stringify(users));
      localStorage.setItem('loggedinuser', JSON.stringify(users.find((u:any) =>  u.userEmailId === LoggedInUser)));
    }
  }

  
}
