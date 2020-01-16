import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  public cargando = true;

  constructor() { }

  ngOnInit() {
    const tsthis = this;
    setTimeout(() => {
      tsthis.cargando = false;
    }, 2000);
  }

}
