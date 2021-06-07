import { Component, OnInit } from '@angular/core';
import { EquipmentService } from '../shared/equipments.service';
import { Equipment, EquipmentNode } from '../shared/models';
import { ValidatorService } from '../shared/validator.service';

@Component({
  selector: 'app-component-validator',
  templateUrl: './component-validator.component.html',
  styleUrls: ['./component-validator.component.css']
})
export class ComponentValidatorComponent implements OnInit {

  validators: Set<EquipmentNode>;
  uniqueText = '';

  constructor(public service: EquipmentService, public validatorService: ValidatorService) { }

  ngOnInit(): void {
    // this.setUniqueText();
    this.service.changeComponentEvent.subscribe(_ => this.setUniqueText());
    this.service.changeEquipmentEvent.subscribe(_ => this.setUniqueText());
  }

  setUniqueText() {
    if (this.service.selectedEquipment !== null) {
      this.uniqueText = this.validatorService.uniqueFails.map(c => this.service.db[c.nodeId].shortLabel).join(', ');
    }
  }

}
