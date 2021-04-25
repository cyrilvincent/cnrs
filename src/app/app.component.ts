import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup} from '@angular/material/tabs';
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material/tooltip';
import { EquipmentService } from './shared/equipments.service';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 500,
  hideDelay: 0,
  touchendHideDelay: 0,
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [
    {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}
  ],
})
export class AppComponent {
  title = 'CNRS Platform Investigation';
  @ViewChild('matTab')
  matTab: MatTabGroup;
  
  constructor(public service: EquipmentService) {}

  labo() {
    this.matTab.selectedIndex = 2;
  }

  about() {
    window.alert(this.title + ' by Cyril Vincent ');
  }

  mind() {
    this.matTab.selectedIndex = 4;
  }

  equipments() {
    this.matTab.selectedIndex = 0;
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
