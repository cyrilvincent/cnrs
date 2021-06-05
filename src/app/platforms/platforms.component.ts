import { Component, OnInit } from '@angular/core';
import { EquipmentService } from '../shared/equipments.service';

@Component({
  selector: 'app-platforms',
  templateUrl: './platforms.component.html',
  styleUrls: ['./platforms.component.scss']
})
export class PlatformsComponent implements OnInit {

  constructor(public service: EquipmentService) {
  }

  ngOnInit() {
  }

}
