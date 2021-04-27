import { EventEmitter, Injectable } from '@angular/core';
import { EquipmentNode, Equipment, Component, TreeNode, Entity} from './models';
import * as dbjson from '../../assets/db.json';
import { MockDb } from './mockdb';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  db: { [id: number]: EquipmentNode; } = {};
  mockdb = new MockDb();
  equipments: Equipment[] = [];
  leafs: EquipmentNode[] = [];
  rootId = 0;
  selectedEquipment: Equipment = null;
  sequenceNb = 100;
  firstLevelNodes: EquipmentNode[] = [];

  changeEquipmentEvent: EventEmitter<Equipment> = new EventEmitter();
  changeEvent: EventEmitter<any> = new EventEmitter();

  constructor() {
    // tslint:disable-next-line: no-string-literal
    this.db = dbjson['default'];
    this.equipments = this.mockdb.getEquipments();
    this.selectedEquipment = this.equipments.length === 0 ? null : this.equipments[0];
    this.generateLeafs();
    this.firstLevelNodes = this.getNodesByParentId(this.rootId);
  }

  changeEquipment(e: Equipment) {
    this.selectedEquipment = e;
    this.changeEquipmentEvent.emit(e);
  }

  private generateLeafs() {
    this.leafs = Object.values(this.db).filter(e => e.leaf);
    this.leafs.sort((a, b) => +(a.label > b.label) || -(a.label < b.label));
  }

  addComponant(nodeId: number, label: string, comment: string) {
    const c = this.componentFactory(nodeId, label, comment);
    this.selectedEquipment.components.push(c);
    this.changeEvent.emit(c);
  }

  removeComponent(id: number) {
    this.selectedEquipment.components = this.selectedEquipment.components.filter(c => c.id !== id);
    this.changeEvent.emit(id);
  }

  removeEquipment(id: number) {
    this.equipments = this.equipments.filter(c => c.id !== id);
    this.selectedEquipment = this.equipments.length === 0 ? null : this.equipments[0];
    this.changeEvent.emit(id);
  }

  getNodesByParentId(parentId: number): EquipmentNode[] {
    const res = Object.values(this.db).filter(v => v.parentId === parentId);
    return res;
  }

  getLevel(id: number): number {
    if (id === this.rootId) {
      return 0;
    }
    const node = this.db[id];
    return this.getLevel(node.parentId) + 1;
  }

  getSequence(): number {
    return this.sequenceNb++;
  }

  componentFactory(nodeId: number, label: string, comment: string): Component {
    const component: Component = {
       equipment: this.selectedEquipment,
       id: this.getSequence(),
       label,
       nodeId,
       comment
    };
    return component;
  }

  equipmentFactory(nodeId: number, label: string, comment: string): Equipment {
    const equipment: Equipment = {
       id: this.getSequence(),
       label,
       nodeId,
       comment,
       components: []
    };
    return equipment;
  }

  hasAncestor(nodeId: number, ancestorId: number): boolean {
    if (ancestorId === nodeId) {
      return true;
    }
    if (nodeId === this.rootId) {
      return false;
    }
    const node: EquipmentNode = this.db[nodeId];
    return this.hasAncestor(node.parentId, ancestorId);
  }

  getEquipmentsTree(): TreeNode[] {
    const nodes = [];
    for (const e of this.equipments) {
      const node = new TreeNode();
      node.entity = e;
      for (const c of e.components) {
        const cnode = new TreeNode();
        cnode.entity = c;
        node.children.push(cnode);
      }
      nodes.push(node);
    }
    return nodes;
  }

  addEquipment(nodeId: number, label: string) {
    const e: Equipment = this.equipmentFactory(nodeId, label, '');
    this.equipments.push(e);
    this.changeEquipment(e);
    this.changeEvent.emit(e);
  }

  proposeEquipmentName(nodeId: number): string {
    const node: EquipmentNode = this.db[nodeId];
    let i = 1;
    let stop = false;
    let label = '';
    while (!stop) {
      label = node.label + ' #' + i;
      if (this.equipments.filter(e => e.label === label).length === 0) {
        stop = true;
      }
      i += 1;
    }
    return label;
  }

  getCompletion(): number {
    let i = 0;
    for (const e of this.equipments) {
      for (const c of e.components) {
        i++;
      }
    }
    return Math.min(this.equipments.length === 0 ? 0 : i / (this.equipments.length * 5), 1);
  }

}
