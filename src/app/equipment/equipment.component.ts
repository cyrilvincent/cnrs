import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EquipmentService } from '../shared/equipments.service';
import { Platform } from '../shared/models';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit {

  panelOpenState = false;

  constructor(public service: EquipmentService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }

  get platformsString() {
    const platforms = this.service.selectedEquipment.platformIds.map(id => this.service.getPlatformById(id).label);
    return platforms.join(',');
  }

  save() {
    this.service.saveEquipments();
    this.snackbar.open('Sauvegardé', 'OK', {duration: 1000});
  }

}
