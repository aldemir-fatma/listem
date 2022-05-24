import { Component } from '@angular/core';

import { HomePage } from '../app/home/home.page';

import { LoginPage } from '../app/login/login.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  rootPage: any = HomePage;

  constructor() {
    if (false) {
      this.rootPage = HomePage;
    } else {
      this.rootPage = LoginPage;
    }
  }
}
