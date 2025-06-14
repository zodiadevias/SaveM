import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }


  whatAmIModal = '';
  whatAmIHead = '';
  whatAmIDashboard = '';

  storeID = '';

  getWhatAmIHead() {
    return this.whatAmIHead
  }

  setWhatAmIHead(whatAmI: string) {
    this.whatAmIHead = whatAmI
  }
  getWhatAmI() {
    return this.whatAmIModal
  }
  setWhatAmI(whatAmI: string) {
    this.whatAmIModal = whatAmI
  }

  setWhatAmIDashboard(whatAmI: string) {
    this.whatAmIDashboard = whatAmI
  }

  getWhatAmIDashboard() {
    return this.whatAmIDashboard
  }


  setStoreID(storeID: string) {
    this.storeID = storeID
  }

  getStoreID() {
    return this.storeID
  }

}
