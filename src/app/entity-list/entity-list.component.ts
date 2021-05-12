import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EquipmentService } from '../shared/equipments.service';
import { Entity, Component as Comp, Equipment, AbstractEquipment } from '../shared/models';
import { ValidatorService } from '../shared/validator.service';

@Component({
  selector: 'app-entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.css']
})
export class EntityListComponent implements OnInit {

  @Input() source: string;

  constructor(public service: EquipmentService, public validatorService: ValidatorService , private snackbar: MatSnackBar) { }

  get entity(): Entity[] {
    if (this.source === 'components') {
      return this.service.selectedEquipment.components;
    }
    if (this.source === 'equipments') {
      return this.service.equipments;
    }
  }

  isUnique(e: Entity): boolean {
    if (this.source === 'components') {
      const c = e as Comp;
      return this.validatorService.uniqueFails.includes(c);
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
    this.snackbar.open('Effacé', 'OK', {duration: 1000});
  }

  save() {
    this.service.saveEquipments();
    this.snackbar.open('Sauvegardé', 'OK', {duration: 1000});
  }

  tooltip(e: Entity): string {
    if (this.source === 'components' && e.comment && e.comment.length > 0) {
      return e.comment;
    }
    const a = e as AbstractEquipment;
    const node = this.service.db[a.nodeId];
    return node.label;
  }

}
