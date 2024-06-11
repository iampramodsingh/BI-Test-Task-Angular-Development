import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgApexchartsModule } from 'ng-apexcharts';
import { GroupsComponent } from '../groups/groups.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ApiService } from '../../api.service';
import { CommonModule } from '@angular/common';
import { Igroup } from '../../Interface/groups.interface';
import { Itransactions } from '../../Interface/transactions.interface';
import { RouterModule } from '@angular/router';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ BaseChartDirective,RouterModule, CommonModule, NgApexchartsModule, MatCardModule, MatButtonModule, GroupsComponent, CarouselModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  data!: ChartData<'bar'> 
  // = {
  //   labels: ['jan', 'feb'],
  //   datasets: [
  //     {
  //       data: [3, 10]
  //     }
  //   ]
  // }
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  loggedInUserGroup: Igroup[] = []
  users :any= []
  constructor(public api : ApiService) {
   this.users = JSON.parse(localStorage.getItem('user') as any)

 
  }

  

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true,
    autoplay: false 
  }

 
  ngOnInit(): void {
    this.filterGroups()
    let groups = this.api.getAllgroups()

    
    let transactions = this.api.getAllTransactions()
    if(groups && transactions) {
      const groupNames = groups.reduce((acc:any, group:any) => {
        acc[group.groupId] = group.groupName;
        return acc;
      }, {} as { [key: number]: string });
  
      const transactionAmounts = groups.reduce((acc:any, group:any) => {
        acc[group.groupName] = 0;
        return acc;
      }, {} as { [key: string]: number });
  
      transactions.forEach((transaction:any) => {
        const groupId = parseInt(transaction.groupId, 10);
        const groupName = groupNames[groupId];
        transactionAmounts[groupName] += transaction.amount;
      });
  
      // Create the chart data
      this.data = {
        labels: Object.keys(transactionAmounts),
        datasets: [
          {
            label: 'Total Transaction Amount',
            data: Object.values(transactionAmounts),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      };

    }
  }
  

  

  filterGroups() {
    const groupsInvolved = this.api.getLoggedInUser()?.groupsInvolved;
    
    this.loggedInUserGroup = this.api.getAllgroups()?.filter((group:Igroup) => groupsInvolved?.includes(group.groupId)).reverse();
    
  }


  
  
}