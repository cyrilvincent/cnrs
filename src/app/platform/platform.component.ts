import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EquipmentService } from '../shared/equipments.service';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss']
})
export class PlatformComponent implements OnInit {

  constructor(public service: EquipmentService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }

  save() {
    this.service.saveEquipments();
    this.snackbar.open('Sauvegardé', 'OK', {duration: 1000});
  }

}
