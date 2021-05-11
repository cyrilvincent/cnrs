import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup} from '@angular/material/tabs';
import { EquipmentService } from './shared/equipments.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import SEAL from 'node-seal'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'CNRS Enquête Plateformes';
  @ViewChild('matTab')
  matTab: MatTabGroup;
  matTabIndex = 0;

  constructor(public service: EquipmentService, private snackbar: MatSnackBar) {}

  ngOnInit(): void {
    this.snackbar.open('Base de données chargée', 'OK', {duration: 1000});
  }

  about() {
    this.snackbar.open(this.title + ' par Cyril Vincent', 'OK');
  }

  mindsimple() {
    window.open('https://www.cyrilvincent.com/cnrs/jsmind/Spectroscopie.htm');
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

  seal() {
  }

  clearLocalStorage() {
    this.service.clearStorage();
  }
}
