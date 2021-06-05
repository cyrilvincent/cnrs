import { Component, OnInit } from '@angular/core';
import { EquipmentService } from '../shared/equipments.service';
import { Platform } from '../shared/models';

@Component({
  selector: 'app-equipment-platforms',
  templateUrl: './equipment-platforms.component.html',
  styleUrls: ['./equipment-platforms.component.scss']
})
export class EquipmentPlatformsComponent implements OnInit {

  constructor(public service: EquipmentService) { }

  ngOnInit(): void {
  }

  get platforms() {
    return this.service.selectedEquipment.platformIds.map(id => this.service.getPlatformById(id));
  }

  hasPlatform(p: Platform): boolean {
    const eids = p.equipments.map(e => e.id);
    return eids.includes(this.service.selectedEquipment.id);
  }

  change(p: Platform, checked: boolean) {
    if (checked) {
      this.service.addPlatformToEquipment(this.service.selectedEquipment, p);
    }
    else {
      this.service.removePlatformToEquipment(this.service.selectedEquipment, p);
    }
    if (this.service.selectedEquipment.platformIds.length === 0) {
      this.service.addPlatformToEquipment(this.service.selectedEquipment, this.service.outPlatform);
    }
  }

}
