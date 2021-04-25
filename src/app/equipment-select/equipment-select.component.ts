import { Component, OnInit } from '@angular/core';
import { EquipmentService } from '../shared/equipments.service';
import { Equipment } from '../shared/models';

@Component({
  selector: 'app-equipment-select',
  templateUrl: './equipment-select.component.html',
  styleUrls: ['./equipment-select.component.scss']
})
export class EquipmentSelectComponent implements OnInit {

  constructor(public service: EquipmentService) { }

  ngOnInit(): void {
  }

  firstChange(value) {
    const equipment: Equipment = value.value;
    this.service.changeEquipment(equipment);
    //this.clear();
    //this.addControl(equipment.nodeId);
  }

}
