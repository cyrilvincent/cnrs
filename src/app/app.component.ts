import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup} from '@angular/material/tabs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'CNRS Platform Investigation';
  @ViewChild('matTab')
  matTab: MatTabGroup;

  refresh() {
    document.location.reload();
  }

  about() {
    window.alert(this.title + ' by Cyril Vincent ');
  }

  mind() {
    this.matTab.selectedIndex = 2;
  }

  manage() {
    this.matTab.selectedIndex = 1;
  }

  mindsimple() {
    window.open('https://www.cyrilvincent.com/cnrs/jsmind/Spectroscopie.htm');
  }

  db() {
    this.matTab.selectedIndex = 3;
  }

  angular() {
    window.open('https://material.angular.io/components/categories');
  }

  material() {
    window.open('https://material.io/design');
  }

  pg() {
    window.open('https://www.postgresql.org/');
  }

  python() {
    window.open('https://www.python.org');
  }

  cyril() {
    window.open('https://www.cyrilvincent.com');
  }
}
