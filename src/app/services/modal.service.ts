import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private visible = false;

  constructor() {}
  // method to return the visible value
  isModalOpen() {
    return this.visible;
  }

  //toggle visible property
  toggleModal() {
    this.visible = !this.visible;
  }
}
