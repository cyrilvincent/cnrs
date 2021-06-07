import { EventEmitter, Injectable } from '@angular/core';
import { EquipmentNode, Equipment, Component, TreeNode, Platform, Sor} from './models';
import * as dbjson from '../../assets/db.json';
import { environment} from '../../environments/environment'
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  db: { [id: number]: EquipmentNode; } = {};
  loaded = false;
  leafs: EquipmentNode[] = [];
  rootId = 0;
  selectedEquipment: Equipment = null;
  sequenceNb = Math.floor(Math.random() * 10000) + 1000;
  firstLevelNodes: EquipmentNode[] = [];
  equipmentTree: TreeNode[] = [];
  sor = this.sorFactory('Institut de la chimie du CNRS', '');
  platforms = [this.platformFactory('Hors plateforme', '', true)];
  selectedPlatform = this.platforms[0];

  get equipments(): Equipment[] {
    const equipments: Equipment[] = [];
    for (const p of this.platforms) {
      for (const e of p.equipments) {
        equipments.push(e);
      }
    }
    return equipments;
  }

  get outPlatform() {
    return this.platforms[0];
  }

  changeEquipmentEvent = new BehaviorSubject(null);
  changeComponentEvent = new BehaviorSubject(null);
  changeNodeEvent = new BehaviorSubject(null);
  changePlatformEvent = new BehaviorSubject(null);

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
      if (this.platforms.length > 1) {
        this.selectedPlatform = this.platforms[1];
        this.changePlatformEvent.next(this.selectedPlatform);
      }
      this.changeEquipmentEvent.next(this.selectedEquipment);
      this.changeNodeEvent.next(null);
      this.changeComponentEvent.next(null);
      this.sor.platforms = this.platforms;
      this.snackbar.open('Base de données chargée', 'OK', {duration: 1000});
      this.loaded = true;
    });
  }

  changeEquipment(e: Equipment) {
    this.selectedEquipment = e;
    this.equipmentTree = this.getEquipmentsTree();
    this.changeEquipmentEvent.next(e);
    this.changeComponentEvent.next(e);
  }

  changePlatform(p: Platform) {
    this.selectedPlatform = p;
    this.changePlatformEvent.next(p);
    this.changeEquipmentEvent.next(null);
  }

  private generateLeafs() {
    this.leafs = Object.values(this.db).filter(e => e.leaf);
    this.leafs.sort((a, b) => +(a.label > b.label) || -(a.label < b.label));
  }

  addComponant(nodeId: number, label: string, comment: string) {
    const c = this.componentFactory(nodeId, label, comment);
    this.selectedEquipment.components.push(c);
    this.equipmentTree = this.getEquipmentsTree();
    this.changeComponentEvent.next(c);
  }

  removeComponent(id: number) {
    this.selectedEquipment.components = this.selectedEquipment.components.filter(c => c.id !== id);
    this.equipmentTree = this.getEquipmentsTree();
    this.changeComponentEvent.next(id);
  }

  addEquipment(nodeId: number, label: string, platform: Platform = this.outPlatform) {
    const e: Equipment = this.equipmentFactory(nodeId, label, '');
    platform.equipments.push(e);
    e.platformIds.push(platform.id);
    this.changeEquipment(e);
  }

  removeEquipment(id: number, platform: Platform = this.outPlatform) {
    platform.equipments = platform.equipments.filter(c => c.id !== id);
    if (platform.equipments.length === 0) {
      if (this.equipments.length === 0) {
        this.selectedEquipment = null;
      }
      else {
        this.selectedEquipment = this.equipments[0];
      }
    }
    else {
      this.selectedEquipment = platform.equipments[0];
    }
    if (platform === this.outPlatform) {
      this.equipmentTree = this.getEquipmentsTree();
    }
    this.changeEquipmentEvent.next(id);
  }

  addPlatform(label: string) {
    const p: Platform = this.platformFactory(label, '');
    this.platforms.push(p);
    this.changePlatform(p);
  }

  removePlatform(id: number) {
    this.platforms = this.platforms.filter(p => p.id !== id);
    this.selectedPlatform = this.platforms.length > 1 ? this.platforms[1] : this.outPlatform;
    this.changePlatformEvent.next(id);
  }

  addPlatformToEquipment(e: Equipment, p: Platform) {
    e.platformIds.push(p.id);
    p.equipments.push(e);
    this.changeEquipmentEvent.next(e);
  }

  removePlatformToEquipment(e: Equipment, p: Platform) {
    e.platformIds = e.platformIds.filter(id => id !== p.id);
    p.equipments = p.equipments.filter(equipment => equipment.id !== e.id);
    this.changeEquipmentEvent.next(e);
  }

  getPlatformById(id: number) {
    return this.platforms.filter(p => p.id === id)[0];
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
       components: [],
       platformIds: [],
       manufacturer: '',
       value: 0,
       year: null,
       useRate: 0,
    };
    return equipment;
  }

  platformFactory(label: string, comment: string, isOutPlatform = false): Platform {
    const platform: Platform = {
      id: isOutPlatform ? 0 : this.getSequence(),
      equipments: [],
      isOutPlatform,
      label,
      comment,
      acronym: '',
      budget: 0,
    };
    return platform;
  }

  sorFactory(label: string, comment: string): Sor {
    const sor: Sor = {
      id: 0,
      platforms: [],
      label,
      comment
    };
    return sor;
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
      label: 'SOR'
    };
    for (const p of this.platforms) {
      const pnode = new TreeNode();
      pnode.entity = {
        id: p.id,
        label: p.label
      };
      for (const e of p.equipments) {
        const node = new TreeNode();
        node.entity = e;
        for (const c of e.components) {
          const cnode = new TreeNode();
          cnode.entity = c;
          node.children.push(cnode);
        }
        pnode.children.push(node);
      }
      root.children.push(pnode);
    }
    return [root];
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
    const json = JSON.stringify(this.platforms);
    console.log(json);
    localStorage.setItem('platforms', json);
  }

  loadEquipments() {
    const v = localStorage.getItem('version');
    if (v !== null && v === environment.version &&  localStorage.getItem('platforms') !== null) {
      this.platforms = JSON.parse(localStorage.getItem('platforms'));
      this.selectedEquipment = this.outPlatform.equipments[0];
    }
    else {
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
