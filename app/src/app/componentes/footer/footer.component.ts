import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  @Input() bgLight = true;

  constructor(
    private router: Router,
    private iab: InAppBrowser
  ) { }

  ngOnInit() {}

  openBrowser(url: string) {
    const browser = this.iab.create(url, '_system');
  }

}
