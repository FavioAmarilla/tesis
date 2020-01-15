import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  public loading = true;

  constructor() { }

  ngOnInit() {
    const tsthis = this;
    setTimeout(() => {
      tsthis.loading = false;
    }, 2000);
  }

}
