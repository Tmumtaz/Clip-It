import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css']
})
export class ClipComponent implements OnInit {
  id = '';
  constructor(public route: ActivatedRoute) {}

  ngOnInit(): void {
    //set the id to the id in the route
    this.route.params.subscribe((params: Params) => {
      this.id = params.id
    })
  }

}
