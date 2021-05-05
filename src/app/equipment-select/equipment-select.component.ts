import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EquipmentService } from '../shared/equipments.service';
import { Equipment } from '../shared/models';

@Component({
  selector: 'app-equipment-select',
  templateUrl: './equipment-select.component.html',
  styleUrls: ['./equipment-select.component.scss']
})
export class EquipmentSelectComponent implements OnInit {

  constructor(public service: EquipmentService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }

  firstChange(value) {
    const equipment: Equipment = value.value;
    this.service.changeEquipment(equipment);
    this.snackbar.open('Equipement sélectionné ' + equipment.label, 'OK', {duration: 1000});
  }

}
