import { Injectable } from '@angular/core';
import { EquipmentNode, Equipment, Component} from './models';
import { EquipmentService } from './equipments.service';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  requiredsAndUniques: Map<Equipment, Set<EquipmentNode>> = new Map();
  validatorsMap: Map<Equipment, Set<EquipmentNode>> = new Map();
  validators: Set<EquipmentNode> = new Set();
  uniqueFailsMap: Map<Equipment, Component[]> = new Map();
  uniqueFails: Component[] = [];

  constructor(public service: EquipmentService) {
    this.checkValidators();
    this.service.changeComponentEvent.subscribe(_ => this.checkValidators());
    this.service.changeEquipmentEvent.subscribe(_ => this.changeEquipment());
  }

  checkValidators() {
    if (this.service.selectedEquipment !== null) {
      this.validators = this.checkRequiredAndUnique(this.service.selectedEquipment);
      this.validatorsMap.set(this.service.selectedEquipment, this.validators);
      this.getUniqueFails(this.service.selectedEquipment, this.validators);
      this.uniqueFailsMap.set(this.service.selectedEquipment, this.uniqueFails);
    }
  }

  changeEquipment() {
    if (this.service.selectedEquipment !== null) {
      if (this.validatorsMap.has(this.service.selectedEquipment)) {
        this.validators = this.validatorsMap.get(this.service.selectedEquipment);
        this.uniqueFails = this.uniqueFailsMap.get(this.service.selectedEquipment);
      }
      else {
        this.checkValidators();
      }
    }
  }

  getUniqueFails(e: Equipment, validators: Set<EquipmentNode>) {
    this.uniqueFails = [];
    for (const v of validators) {
      if (v.unique) {
        for (const c of e.components) {
          if (this.service.hasAncestor(c.nodeId, v.id)) {
            this.uniqueFails.push(c);
          }
        }
      }
    }
  }

  checkRequiredAndUnique(e: Equipment): Set<EquipmentNode> {
    if (!this.requiredsAndUniques.has(e)) {
      this.requiredsAndUniques.set(e, this.getRequiredsAndUniques(this.service.db[e.nodeId]));
    }
    const nb = this.countAncestors(e, this.requiredsAndUniques.get(e));
    const result: Set<EquipmentNode> = new Set();
    for (const ru of nb.keys()) {
      if (ru.required && nb.get(ru) === 0) {
        result.add(ru);
      }
      else if (ru.unique && nb.get(ru) > 1) {
        result.add(ru);
      }
    }
    return result;
  }

  countAncestors(e: Equipment, requiredsAndUniques: Set<EquipmentNode>): Map<EquipmentNode, number> {
    const nb: Map<EquipmentNode, number> = new Map();
    for (const ru of requiredsAndUniques) {
      nb.set(ru, 0);
    }
    for (const c of e.components) {
      for (const ru of requiredsAndUniques) {
        if (this.service.hasAncestor(c.nodeId, ru.id)) {
          nb.set(ru, nb.get(ru) + 1);
        }
      }
    }
    return nb;
  }

  getRequiredsAndUniques(node: EquipmentNode, requiredsAndUniques: Set<EquipmentNode> = new Set()): Set<EquipmentNode> {
    if (node.required || node.unique) {
      return new Set([node]);
    }
    if (node.leaf) {
      return new Set();
    }
    const nodes = this.service.getNodesByParentId(node.id);
    for (const n of nodes) {
      const ru = this.getRequiredsAndUniques(n, requiredsAndUniques);
      requiredsAndUniques = new Set([...requiredsAndUniques, ...ru]);
    }
    return requiredsAndUniques;
  }
}
