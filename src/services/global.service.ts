import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }


  whatAmIModal = '';
  whatAmIHead = '';


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



}
