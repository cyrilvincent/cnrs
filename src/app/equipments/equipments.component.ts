import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EquipmentService } from '../shared/equipments.service';



@Component({
  selector: 'app-equipments',
  templateUrl: './equipments.component.html',
  styleUrls: ['./equipments.component.scss'],
})
export class EquipmentsComponent implements OnInit {
  


  constructor(private fb: FormBuilder, public service: EquipmentService) {
  }

  ngOnInit() {

  }

  

  




}
