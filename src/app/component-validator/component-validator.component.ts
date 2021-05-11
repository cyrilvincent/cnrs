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
    this.service.changeEvent.subscribe(e => this.checkValidators());
    const rnode = this.service.db[2];
    rnode.required = true;
    const unode = this.service.db[8];
    unode.unique = true;
    this.checkValidators();
  }

  checkValidators() {
    if (this.service.selectedEquipment !== null) {
      this.validators = this.validatorService.checkRequiredAndUnique(this.service.selectedEquipment);
      this.validatorService.getUniqueFails(this.service.selectedEquipment, this.validators);
      this.uniqueText = 'Enlever un des composants suivants: ';
      this.uniqueText += this.validatorService.uniqueFails.map(c => this.service.db[c.nodeId].shortLabel).join(', ');
    }
  }

}
