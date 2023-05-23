import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  isDragover = false; 
  file: File | null = null;
  nextStep = false;

  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  });

  uploadForm = new FormGroup({
    title: this.title
  })
  
  storeFile($event: Event){
    this.isDragover = false

    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null

    //file validation
    if(!this.file || this.file.type !== 'video/mp4'){
      return
    }
    // set title 
    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/, '')
    )

    //show form
    this.nextStep = true;

  }

  uploadFile(){
    console.log('file uploaded')
  }



}
