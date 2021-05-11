export interface Entity {
    id: number;
    label: string;
    comment?: string;
}

export interface EquipmentNode extends Entity {
    shortLabel: string;
    parentId: number;
    order: number;
    leaf: boolean;
    unique: boolean;
    required: boolean;
    text: boolean;
}

export interface Labo extends Entity {
    platforms: Platform[];
}

export interface Platform extends Entity {
    isNoPlatform: boolean;
    equipments: Equipment[];
}

export interface AbstractEquipment extends Entity {
    nodeId: number;
}

export interface Equipment extends AbstractEquipment {
    platform?: Platform;
    components: Component[];
}

export interface Component extends AbstractEquipment {
    equipmentId: number;
}

export class ViewModel {
    value: number;
    text: string;
    key: number;
    level: number;
    type: string;
    options: OptionVM[];
    entity: EquipmentNode;
}

export class OptionVM {
    key: number;
    value: string;
}

export class TreeNode {
    entity: Entity;
    children: TreeNode[] = []
}