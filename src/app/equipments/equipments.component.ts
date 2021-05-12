import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EquipmentService } from '../shared/equipments.service';
import { ValidatorService } from '../shared/validator.service';



@Component({
  selector: 'app-equipments',
  templateUrl: './equipments.component.html',
  styleUrls: ['./equipments.component.scss'],
})
export class EquipmentsComponent implements OnInit {

  nbError = 0;

  constructor(public service: EquipmentService, public validatorService: ValidatorService) {
  }

  ngOnInit() {
    this.validator();
    this.service.changeEvent.subscribe(_ => this.validator());
    this.service.changeEquipmentEvent.subscribe(_ => this.validator());
  }

  validator() {
    this.nbError = this.validatorService.validators.size;
  }



}
