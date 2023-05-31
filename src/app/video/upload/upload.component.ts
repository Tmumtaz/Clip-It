import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import { combineLatest, forkJoin } from 'rxjs';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnDestroy {
  isDragover = false;
  file: File | null = null;
  nextStep = false;
  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please Wait, your clip is being uploaded';
  inSubmission = false;
  percentage = 0;
  showPercentage = false;
  user: firebase.User | null = null;
  task?: AngularFireUploadTask;
  screenshots: string[] = [] 
  selectedScreenshot = '';
  screenshotTask?: AngularFireUploadTask

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  uploadForm = new FormGroup({
    title: this.title,
  });

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService,
    private router: Router,
    public ffmpegService: FfmpegService
  ) {
    auth.user.subscribe(user => this.user = user)
    this.ffmpegService.init()
  }

  ngOnDestroy(): void {
    // cancel the upload before the component is removed from the document
    this.task?.cancel()
  }

  async storeFile($event: Event) {
    if(this.ffmpegService.isRunning) {
      return
    }
    this.isDragover = false;

    this.file = ($event as DragEvent).dataTransfer ?
    ($event as DragEvent).dataTransfer?.files.item(0) ?? null:
    ($event.target as HTMLInputElement).files?.item(0) ?? null

    //file validation
    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.screenshots = await this.ffmpegService.getScreenshots(this.file)

    this.selectedScreenshot = this.screenshots[0]

    // set title
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));

    //show form
    this.nextStep = true;
  }

  async uploadFile() {
    // stops the user editing the form while upload is in progress 
    this.uploadForm.disable()

    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please Wait, your clip is being uploaded';
    this.inSubmission = true;
    this.showPercentage = true;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    const screenshotBlob = await this.ffmpegService.blobFromURL(
      this.selectedScreenshot
    )
    const screenshotPath = `screenshots/${clipFileName}.png`

    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath)

    this.screenshotTask = this.storage.upload(screenshotPath, screenshotBlob)
    const screenshotRef = this.storage.ref(screenshotPath)

    combineLatest([
      this.task.percentageChanges(),
      this.screenshotTask.percentageChanges()
    ]).subscribe((progress) => {
      const[clipProgress, screenshotProgress] = progress

      if(!clipProgress || !screenshotProgress){
        return
      }

      const total = clipProgress + screenshotProgress

      this.percentage = total as number / 200;
    })

    forkJoin([
      this.task.snapshotChanges(),
      this.screenshotTask.snapshotChanges()
    ]).pipe(
        switchMap(() => forkJoin([
          clipRef.getDownloadURL(),
          screenshotRef.getDownloadURL()
        ]))
      )
      .subscribe({
        next: async (urls) => {
          const [clipURL, screenshotURL] = urls

          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.title.value,
            fileName: `${clipFileName}.mp4`,
            url: clipURL,
            screenshotURL,
            screenshotFileName: `${clipFileName}.png`,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          };

          // Create clip in DB
          const clipDocRef = await this.clipsService.createClip(clip)

          // Success UI
          this.alertColor = 'green';
          this.alertMsg = 'Success!';
          this.showPercentage = false;
          // redirect to clip URL path
          setTimeout(() => {
            this.router.navigate([
              'clips', clipDocRef.id
            ])
          },1000)
        },
        error: (error) => {
          // enable form in case of error 
          this.uploadForm.enable()

          // Error UI
          this.alertColor = 'red';
          this.alertMsg = 'Upload Failed';
          this.inSubmission = true;
          this.showPercentage = false;
          console.error(error);
        },
      });
  }
}
