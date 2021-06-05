import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EquipmentService } from '../shared/equipments.service';

@Component({
  selector: 'app-sor',
  templateUrl: './sor.component.html',
  styleUrls: ['./sor.component.scss']
})
export class SorComponent implements OnInit {

  panelOpenState = false;

  constructor(public service: EquipmentService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }

  add() {
    this.snackbar.open('Pas encore implémenté!', 'OK');
  }

  get completion() {
    return Math.round(this.service.getCompletion() * 100);
  }

}
