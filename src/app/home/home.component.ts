import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private cdRef: ChangeDetectorRef) {}

  videoLoaded(){
    this.cdRef.detectChanges();
  }
}
