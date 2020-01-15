import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {

  public loading = true;

  constructor() { }

  ngOnInit() {
    const tsthis = this;
    setTimeout(() => {
      tsthis.loading = false;
    }, 2000);
  }

}
