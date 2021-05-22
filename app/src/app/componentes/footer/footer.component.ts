import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  @Input() bgLight = true;

  isMobile = false;

  constructor(
    private platform: Platform,
    private iab: InAppBrowser,
    private router: Router,
  ) { }

  ngOnInit() {
    this.isMobile = this.platform.is('android') || this.platform.is('ios');
  }

  openBrowser(url: string) {
    const browser = this.iab.create(url, '_system');
  }

}
