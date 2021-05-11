import { Injectable } from '@angular/core';
import { EquipmentNode, Equipment} from './models';
import { EquipmentService } from './equipments.service';

@Injectable({
  providedIn: 'root'
})
export class ConstraintsService {

  requiredsAndUniques: Map<Equipment, Set<EquipmentNode>> = new Map();

  constructor(public service: EquipmentService) {
  }

  checkRequiredsAndUniques(): Map<Equipment, Set<EquipmentNode>> {
    const result: Map<Equipment, Set<EquipmentNode>> = new Map();
    for (const e of this.service.equipments) {
      const requiredsAndUniques = this.checkRequiredAndUnique(e);
      if (requiredsAndUniques.size > 0) {
        result.set(e, requiredsAndUniques);
      }
    }
    return result;
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
