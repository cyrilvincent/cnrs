import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EquipmentService } from '../shared/equipments.service';

@Component({
  selector: 'app-platform-add',
  templateUrl: './platform-add.component.html',
  styleUrls: ['./platform-add.component.scss']
})
export class PlatformAddComponent implements OnInit {

  label = '';

  constructor(public service: EquipmentService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }

  add() {
    this.service.addPlatform(this.label);
    this.snackbar.open('Plateforme ajoutée', 'OK', {duration: 1000})
  }

}
