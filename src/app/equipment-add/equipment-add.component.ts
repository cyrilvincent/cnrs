import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EquipmentService } from '../shared/equipments.service';
import { EquipmentNode } from '../shared/models';

@Component({
  selector: 'app-equipment-add',
  templateUrl: './equipment-add.component.html',
  styleUrls: ['./equipment-add.component.scss']
})
export class EquipmentAddComponent implements OnInit {

  selectedNode: EquipmentNode = null;

  @ViewChild('text') text: ElementRef;

  constructor(public service: EquipmentService) { }

  ngOnInit(): void {
  }

  get selectedText() {
    return this.service.proposeEquipmentName(this.selectedNode.id);
  }

  select(value) {
    const node: EquipmentNode = value.value;
    this.selectedNode = node;
  }

  add() {
    const label: string = this.text.nativeElement.value;
    this.service.addEquipment(this.selectedNode.id, label);
  }

  clear() {
    this.selectedNode = null;
  }

}
