import { Component, OnInit } from '@angular/core';
import { EquipmentService } from '../shared/equipments.service';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.css']
})
export class PlatformComponent implements OnInit {

  constructor(public service: EquipmentService) { }

  ngOnInit(): void {
  }

  add() {
    window.alert('Not implemented yet');
  }

  get completion() {
    return Math.round(this.service.getCompletion() * 100);
  }

}
