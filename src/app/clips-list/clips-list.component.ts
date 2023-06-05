import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClipService } from '../services/clip.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.css'],
  providers: [DatePipe]
})
export class ClipsListComponent implements OnInit, OnDestroy {
  constructor(public clipService: ClipService) {
    this.clipService.getClips()
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.handleScroll);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () => {
    const {scrollTop, offsetHeight} = document.documentElement
    const { innerHeight } = window

    const bottomofWindow = Math.round(scrollTop) + innerHeight === offsetHeight

    if(bottomofWindow){
      this.clipService.getClips()
    }
  };
}
