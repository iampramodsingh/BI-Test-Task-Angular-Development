import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Igroup } from '../../Interface/groups.interface';
import { ApiService } from '../../api.service';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, RouterModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export class GroupsComponent implements OnInit {
 public groups : Igroup[] = [
  {
      "id": "1",
      "groupId": 2,
      "groupName": "himachal Trip",
      "members": [
          {
              "memberName": "sourabh kashyap",
              "userEmailId": "sourabh@gmail.com"
          },
          {
              "memberName": "yash Patnaik",
              "userEmailId": "yash@gmail.com"
          },
          {
              "memberName": "Pramod Singh",
              "userEmailId": "singh.pramod9981@gmail.com"
          }
      ],
      "createdDate": "2024-06-09T09:50:46.418Z",
  },
   


]

loggedInUserGroup: Igroup[] = []

constructor(public api : ApiService) {}

ngOnInit() {
//   localStorage.setItem("groups", JSON.stringify(this.groups))

  this.filterGroups()
}

filterGroups() {
    const groupsInvolved = this.api.getLoggedInUser().groupsInvolved;
    this.loggedInUserGroup = this.api.getAllgroups()?.filter((group:Igroup) => groupsInvolved.includes(group.groupId)).reverse();
    console.log(this.loggedInUserGroup)
  }
}
