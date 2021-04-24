export interface Entity {
    id: number;
    label: string;
}

export interface EquipmentNode extends Entity {
    shortLabel: string;
    parentId: number|number[];
    order: number;
    leaf: boolean;
}

export interface Labo extends Entity {
    comment: string;
    platforms: Platform[];
}

export interface Platform extends Entity {
    isNoPlatform: boolean;
    comment: string;
    equipments: Equipment[];
}

export interface AbstractEquipment extends Entity {
    node: EquipmentNode;
    comment: string;
}

export interface Equipment extends AbstractEquipment {
    platform: Platform;
    components: Component[];
}

export interface Component extends AbstractEquipment {
    equipment: Equipment;
}

export class ViewModel {
    value: number|string;
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