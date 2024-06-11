import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ApiService } from '../../api.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreateGroupDialogComponent } from '../create-group-dialog/create-group-dialog.component';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, MatSnackBarModule, RouterModule, ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  list =  [
    {name: 'Dashboard', isLink: true, link: '/dashboard', isActive: true},
    {name: 'Groups',  isLink: true, link: '/dashboard/groups', isActive: false},
    { name: 'Logout',  isLink: false, link: '/Logout', isActive: false, action: () => this.logout() }
  ]
  currentUrl!: string
  currentRouteName!: string;

  constructor(public api: ApiService, private snackbar : MatSnackBar, private router: Router, public dialog: MatDialog) { }


  ngOnInit():void{
  }

 

 

  handleClick(item: any) {
    if (item.name === 'Logout' && item.action) {
      item.action();
      return false; // Prevent default navigation if needed
    } else {
      return true;
    }
  }




  currentRoute(event: any): void {
    this.currentUrl = this.router.url;
      console.log('Current URL:', this.currentUrl);
  }


  openDialog() {
    const dialogRef = this.dialog.open(CreateGroupDialogComponent, {
      width: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(this.currentUrl === '/dashboard') {
        this.router.navigateByUrl('dashboard/groups');
      } else if(this.currentUrl === '/dashboard/groups') {
        this.router.navigateByUrl('dashboard');
      }
    });
  }

  logout() {
    this.api.logout();
    this.snackbar.open('Logged Out Successfully', 'ok', {
      duration: 5000,
      });
      this.router.navigateByUrl('/');

  }
  }

