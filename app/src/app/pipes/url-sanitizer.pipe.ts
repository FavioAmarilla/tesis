import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

const API = environment.api;

@Pipe({
  name: 'urlSanitizer'
})
export class UrlSanitizerPipe implements PipeTransform {

  constructor(
    private domSanitizer: DomSanitizer
  ) {}

  transform(url: any): any {
    if (!url || url == '') return url;

    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

}
