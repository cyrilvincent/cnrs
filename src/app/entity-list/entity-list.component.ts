import { Component, OnInit } from '@angular/core';
import { EquipmentService } from '../shared/equipments.service';

@Component({
  selector: 'app-entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.css']
})
export class EntityListComponent implements OnInit {

  constructor(public service: EquipmentService) { }

  ngOnInit(): void {
  }

  delete(id: number) {
    //this.service.deleteEquipment(id);
    this.service.removeComponent(id);
  }

  save() {
    window.alert('Not implemented yet');
  }

}
