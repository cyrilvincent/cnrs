import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EquipmentService } from '../shared/equipments.service';
import { Platform } from '../shared/models';

@Component({
  selector: 'app-platform-select',
  templateUrl: './platform-select.component.html',
  styleUrls: ['./platform-select.component.scss']
})
export class PlatformSelectComponent implements OnInit {

  selected: Platform;

  constructor(public service: EquipmentService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.service.changePlatformEvent.subscribe(_ => this.select());
  }

  select() {
    if (this.service.selectedPlatform.isOutPlatform) {
      this.selected = null;
    }
    this.selected = this.service.selectedPlatform;
  }

  change(value) {
    const p: Platform = value.value;
    this.service.changePlatform(p);
    this.snackbar.open('Plateforme sélectionnée ' + p.label, 'OK', {duration: 1000});
  }

}
