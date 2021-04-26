import { Component, Input, OnInit } from '@angular/core';
import { EquipmentService } from '../shared/equipments.service';
import { Entity } from '../shared/models';

@Component({
  selector: 'app-entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.css']
})
export class EntityListComponent implements OnInit {

  @Input() source: string;

  constructor(public service: EquipmentService) { }

  get entity(): Entity[] {
    if (this.source === 'components') {
      return this.service.selectedEquipment.components;
    }
    if (this.source === 'equipments') {
      return this.service.equipments;
    }
  }

  ngOnInit(): void {
  }

  delete(id: number) {
    if (this.source === 'components') {
      this.service.removeComponent(id);
    }
    if (this.source === 'equipments') {
      this.service.removeEquipment(id);
    }
  }

  save() {
    window.alert('Not implemented yet');
  }

}
