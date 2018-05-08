import { Component, OnInit, Injectable, Input, Output, EventEmitter } from '@angular/core';
import { ViewComponentComponent } from 'app/view-component/view-component.component'
@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
@Injectable()
export class PaginatorComponent implements OnInit {
  size: number = 20;
  @Input() page: number = 1;
  @Input() pages: number = 0;
  constructor(private view: ViewComponentComponent) { }

  delimiters = [
    { value: 10 },
    { value: 20 },
    { value: 50 },
    { value: 100 },
  ];

  ngOnInit() {
  }

  resize() {
    this.view.size = this.size;
    this.view.resize();
  }

  next() {
    if (this.view.page < this.view.pages) {
      this.view.page += 1;
      this.page = this.view.page;
      this.pages = this.view.pages;
      this.view.onPaginatorChange();
    }
  }
  back() {
    if (this.view.page > 1) {
      this.view.page -= 1;
      this.page = this.view.page;
      this.pages = this.view.pages;
      this.view.onPaginatorChange();
    }
  }

}
