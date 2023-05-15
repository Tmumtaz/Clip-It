import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modals: IModal[] = []

  constructor() {}

  register(id: string){
    this.modals.push({
      id,
      visible: false
    }) 
  }

  //remove modal with associated id to prevent memory leak
  unregister(id: string) {
    this.modals = this.modals.filter(
      element => element.id !== id
    )
  }

  // method to return the visible value
  isModalOpen(id: string, ) : boolean {
    return !!this.modals.find(element => element.id === id)?.visible
  }

  //toggle visible property
  toggleModal(id : string) {
    const modal = this.modals.find(element => element.id === id)

    if(modal){
      modal.visible = !modal.visible
    }
  }
}
