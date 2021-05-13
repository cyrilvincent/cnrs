import { Component, OnInit } from '@angular/core';
import { EquipmentService } from '../shared/equipments.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(public service: EquipmentService) { }

  ngOnInit(): void {
  }

  clearLocalStorage() {
    this.service.clearStorage();
  }

}
