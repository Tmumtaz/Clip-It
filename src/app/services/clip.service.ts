import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import IClip from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  public clipsCollection: AngularFirestoreCollection<IClip>;

  constructor(private db: AngularFirestore, private auth: AngularFireAuth, private storage: AngularFireStorage) {
    this.clipsCollection = db.collection('clips');
  }

  createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return this.clipsCollection.add(data);
  }

  getUserClips() {
    // subscribe to the user observable to get user ID
    return this.auth.user.pipe(
      switchMap(user => {
        // if the user object is not empty, we can begin a query
        if(!user){
          return of([])
        }

        const query = this.clipsCollection.ref.where(
          //filter through documents to see if the uid is = to the user currently logged in
          'uid', '==', user.uid
        )

        return query.get()
      }),
      map(snapshot => (snapshot as QuerySnapshot<IClip>).docs)
    )
  }

  updateClip(id: string, title: string){
    return this.clipsCollection.doc(id).update({
      title
    })
  }

  async deleteClip(clip: IClip){
    const clipRef = this.storage.ref(`clips/${clip.fileName}`) 

    await clipRef.delete()

    await this.clipsCollection.doc(clip.docID).delete()
  }
}
