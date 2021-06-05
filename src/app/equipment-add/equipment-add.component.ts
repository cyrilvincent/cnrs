import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EquipmentService } from '../shared/equipments.service';
import { EquipmentNode, Platform } from '../shared/models';

@Component({
  selector: 'app-equipment-add',
  templateUrl: './equipment-add.component.html',
  styleUrls: ['./equipment-add.component.scss']
})
export class EquipmentAddComponent implements OnInit {

  selectedNode: EquipmentNode = null;
  label = '';
  @Input() platform: Platform;

  @ViewChild('text') text: ElementRef;

  constructor(public service: EquipmentService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }

  select(value) {
    const node: EquipmentNode = value.value;
    this.selectedNode = node;
    this.label = this.service.proposeEquipmentName(this.selectedNode.id);
  }

  add() {
    this.service.addEquipment(this.selectedNode.id, this.label, this.platform);
    this.snackbar.open('Equipement ajouté', 'OK', {duration: 1000});
  }

  clear() {
    this.selectedNode = null;
  }

}
