import { FlatTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { EquipmentService } from 'src/app/shared/equipments.service';
import { Entity, TreeNode } from 'src/app/shared/models';
import { AdminService } from '../admin.service';

interface EquipmentNodeFlatNode {
  expandable: boolean;
  level: number;
  entity: Entity;
}

@Component({
  selector: 'app-equipment-nodes-tree',
  templateUrl: './equipment-nodes-tree.component.html',
  styleUrls: ['./equipment-nodes-tree.component.css']
})
export class EquipmentNodesTreeComponent implements OnInit {
  treeControl;
  treeFlattener;
  dataSource;

  constructor(public service: EquipmentService, public adminService: AdminService) {
    this.treeControl = new FlatTreeControl<EquipmentNodeFlatNode>(node => node.level, node => node.expandable);
    this.treeFlattener = new MatTreeFlattener(this.transformer, node => node.level, node => node.expandable, node => node.children);
    this.dataSource  = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  ngOnInit(): void {
    this.service.changeNodeEvent.subscribe(x => this.initDataSource());
  }

  initDataSource(): void {
    this.dataSource.data = this.adminService.treeNode;
    for (const n of this.treeControl.dataNodes) {
      if (n.level < 2) {
        this.treeControl.expand(n);
      }
    }
  }

  private transformer = (node: TreeNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      entity: node.entity,
      level,
    };
  }

  hasChild = (_: number, node: EquipmentNodeFlatNode) => node.expandable;
}
