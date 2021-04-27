import { Injectable } from '@angular/core';
import { EquipmentNode, ViewModel, OptionVM, Equipment, Component, TreeNode, Entity} from './models';
import { EquipmentService } from './equipments.service';

@Injectable({
  providedIn: 'root'
})
export class VMService {

  constructor(public service: EquipmentService) {
  }

  private convertNodeToVM(entity: EquipmentNode, entities: EquipmentNode[], level: number): ViewModel {
    const vm: ViewModel = new ViewModel();
    vm.value = entity.id;
    vm.key = entity.id;
    vm.level = level;
    vm.entity = entity;
    if (entity.leaf) {
      vm.type = 'text';
      vm.text = '';
    }
    else {
      vm.type = 'select';
      vm.options = [];
      entities.sort((a, b) => a.order - b.order);
      for (const e of entities) {
        const option: OptionVM = new OptionVM();
        option.key = e.id;
        option.value = e.shortLabel;
        vm.options.push(option);
      }
    }
    return vm;
  }

  getVMById(id: number, level: number): ViewModel {
    const entity = this.service.db[id];
    const entities = this.service.getNodesByParentId(entity.id);
    const vm: ViewModel = this.convertNodeToVM(entity, entities, level);
    return vm;
  }
}
