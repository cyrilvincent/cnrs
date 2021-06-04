import { EventEmitter, Injectable } from '@angular/core';
import { EquipmentNode, Equipment, Component, TreeNode, Platform} from './models';
import * as dbjson from '../../assets/db.json';
import { environment} from '../../environments/environment'
import { MatSnackBar } from '@angular/material/snack-bar';
import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  db: { [id: number]: EquipmentNode; } = {};
  loaded = false;
  // equipments: Equipment[] = [];
  leafs: EquipmentNode[] = [];
  rootId = 0;
  selectedEquipment: Equipment = null;
  sequenceNb = Math.floor(Math.random() * 10000) + 1000;
  firstLevelNodes: EquipmentNode[] = [];
  equipmentTree: TreeNode[] = [];
  platforms = [this.platformFactory('Hors plateforme', '', true)];
  outPlatformId = 0;
  selectedPlatform = this.platforms[this.outPlatformId];

  get equipments(): Equipment[] {
    return this.selectedPlatform.equipments;
  }

  set equipments(equipments: Equipment[]) {
    this.selectedPlatform.equipments = equipments;
  }

  changeEquipmentEvent: EventEmitter<Equipment> = new EventEmitter();
  changeComponentEvent: EventEmitter<any> = new EventEmitter();
  changeNodeEvent: EventEmitter<any> = new EventEmitter();
  changePlatformEvent: EventEmitter<any> = new EventEmitter();

  get version() {
    return environment.version;
  }

  constructor(private snackbar: MatSnackBar) {
    timer(100).subscribe(_ => { // Test only
      this.loadDb();
      // TODO: For test only
      const rnode = this.db[2];
      rnode.required = true;
      const unode = this.db[8];
      unode.unique = true;
      // End for test only
      this.loadEquipments();
      this.selectedEquipment = this.equipments.length === 0 ? null : this.equipments[0];
      this.generateLeafs();
      this.firstLevelNodes = this.getNodesByParentId(this.rootId);
      this.equipmentTree = this.getEquipmentsTree();
      this.changeEquipmentEvent.emit(this.selectedEquipment);
      this.changeNodeEvent.emit();
      this.snackbar.open('Base de données chargée', 'OK', {duration: 1000});
      this.loaded = true;
    });
  }

  changeEquipment(e: Equipment) {
    this.selectedEquipment = e;
    this.equipmentTree = this.getEquipmentsTree();
    this.changeEquipmentEvent.emit(e);
  }

  private generateLeafs() {
    this.leafs = Object.values(this.db).filter(e => e.leaf);
    this.leafs.sort((a, b) => +(a.label > b.label) || -(a.label < b.label));
  }

  addComponant(nodeId: number, label: string, comment: string) {
    const c = this.componentFactory(nodeId, label, comment);
    this.selectedEquipment.components.push(c);
    this.equipmentTree = this.getEquipmentsTree();
    this.changeComponentEvent.emit(c);
  }

  removeComponent(id: number) {
    this.selectedEquipment.components = this.selectedEquipment.components.filter(c => c.id !== id);
    this.equipmentTree = this.getEquipmentsTree();
    this.changeComponentEvent.emit(id);
  }

  removeEquipment(id: number) {
    this.equipments = this.equipments.filter(c => c.id !== id);
    this.selectedEquipment = this.equipments.length === 0 ? null : this.equipments[0];
    this.equipmentTree = this.getEquipmentsTree();
    this.changeComponentEvent.emit(id);
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
       equipmentId: this.selectedEquipment === null ? -1 : this.selectedEquipment.id,
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

  platformFactory(label: string, comment: string, isOutPlatform = false): Platform {
    const platform: Platform = {
      id: isOutPlatform ? 0 : this.getSequence(),
      equipments: [],
      isOutPlatform,
      label,
      comment
    };
    return platform;
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
    const root = new TreeNode();
    root.entity = {
      id: -1,
      label: 'Hors plateforme'
    };
    for (const e of this.equipments) {
      const node = new TreeNode();
      node.entity = e;
      for (const c of e.components) {
        const cnode = new TreeNode();
        cnode.entity = c;
        node.children.push(cnode);
      }
      root.children.push(node);
    }
    return [root];
  }

  addEquipment(nodeId: number, label: string) {
    const e: Equipment = this.equipmentFactory(nodeId, label, '');
    this.equipments.push(e);
    this.changeEquipment(e);
    this.changeComponentEvent.emit(e);
  }

  proposeEquipmentName(nodeId: number): string {
    const node: EquipmentNode = this.db[nodeId];
    let i = 1;
    let stop = false;
    let label = '';
    while (!stop && i <= 100) {
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
    return this.equipments.length === 0 ? 0 : Math.min(i / (this.equipments.length * 5), 1);
  }

  saveEquipments() {
    localStorage.setItem('version', environment.version);
    const json = JSON.stringify(this.equipments);
    console.log(json);
    localStorage.setItem('equipments', json);
  }

  loadEquipments() {
    const v = localStorage.getItem('version');
    if (v !== null && v === environment.version &&  localStorage.getItem('equipments') !== null) {
      this.equipments = JSON.parse(localStorage.getItem('equipments'));
      this.selectedEquipment = this.equipments[0];
    }
    else {
      this.equipments = [];
      this.selectedEquipment = null;
    }
  }

  loadDb() {
    const v = localStorage.getItem('db_version');
    if (v !== null && v === '0' && localStorage.getItem('db') !== null) {
      console.log('Load Db from localStorage');
      this.db = JSON.parse(localStorage.getItem('db'));
    }
    else {
      console.log('Load Db from dbjson');
      // tslint:disable-next-line: no-string-literal
      this.db = dbjson['default'];
      this.saveDb();
    }
  }

  saveDb() {
    localStorage.setItem('db_version', '0');
    const json = JSON.stringify(this.db);
    localStorage.setItem('db', json);
  }

  clearStorage() {
    localStorage.clear();
    this.loadEquipments();
  }

}
