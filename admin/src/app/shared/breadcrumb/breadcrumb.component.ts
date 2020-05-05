import { Component, Input, OnInit } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  @Input() pagina: string;
  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  public menuItems: any[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => this.menuItems = this.createBreadcrumbs(this.activatedRoute.root));
  }

  ngOnInit() { }

  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: any[] = []): any[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const titulo = child.snapshot.data[BreadcrumbComponent.ROUTE_DATA_BREADCRUMB];
      const icono = child.snapshot.data['icono'];

      if (!isNullOrUndefined(titulo)) {
        breadcrumbs.push({ titulo, url, icono });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
  }

}
