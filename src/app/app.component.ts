import { Component, AfterViewInit } from '@angular/core';
import { Stage } from 'konva';
import { Selection } from './models/selection';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  stage: Stage;
  activeSelection = null;
  selectionLayers = [];

  constructor() {}

  ngAfterViewInit() {
    const that = this;
    this.stage = new Stage({
      container: 'container',
      width: window.innerWidth,
      height: window.innerHeight
    });

    // default selection
    that.addPost(150, 150);

    // don't trigger on empty space
    this.stage.on('click', function(e) {
      console.log('click');
      this.activeSelection = e.target;
      console.log(this.activeSelection);
      if (!(e.target instanceof Stage)) {
        console.log('select');
      }
    });

    // trigger every where
    this.stage.on('contentClick', function(e) {
      console.log('contentClick');
      this.activeSelection = null;
      console.log(this.activeSelection);
      if (e.currentTarget instanceof Stage) {
        // that.addPost(e.evt.x, e.evt.y);
      }
    });
  }

  private addPost(x: number, y: number) {
    const orderNumber = this.selectionLayers.length + 1;
    const newPost = new Selection(orderNumber, x, y);
    this.selectionLayers.push(newPost.exportLayer());
    this.stage.add(...this.selectionLayers);
  }
}
