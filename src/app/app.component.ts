import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup} from '@angular/material/tabs';
import { EquipmentService } from './shared/equipments.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  title = 'CNRS Platform Investigation';
  @ViewChild('matTab')
  matTab: MatTabGroup;

  constructor(public service: EquipmentService, private snackbar: MatSnackBar) {}

  ngOnInit(): void {
    this.snackbar.open('Database loaded', 'OK', {duration: 1000});
    this.matTab.selectedIndex = 0;
  }

  labo() {
    this.matTab.selectedIndex = 0;
  }

  about() {
    this.snackbar.open(this.title + ' by Cyril Vincent', 'OK');
  }

  mind() {
    this.matTab.selectedIndex = 4;
  }

  equipments() {
    this.matTab.selectedIndex = 1;
  }

  details() {
    this.matTab.selectedIndex = 2;
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
