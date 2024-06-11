import { Injectable } from '@angular/core';


export interface Icredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  
  constructor() {
   }

   getLoggedInUser() {
    return JSON.parse(localStorage.getItem('loggedinuser') as any);
   }

   getAllgroups() {
    return JSON.parse(localStorage.getItem('groups') as any);
   }

   getAllTransactions() {
    return JSON.parse(localStorage.getItem('transactions') as any);
   }


  logout() {
    localStorage.removeItem('loggedinuser');
  }





}


