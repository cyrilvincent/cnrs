import { Equipment } from './models';

export class MockDb {

    getEquipments(): Equipment[] {
        return [
            {
                id: 1,
                label: 'Spectromètre RMN #1',
                nodeId: 1,
                components: []
            },
            {
                id: 2,
                label: 'Spectromètre RPE #1',
                nodeId: 113,
                components: []
            },
            {
                id: 3,
                label: 'Spectromètre de masse #1',
                nodeId: 137,
                components: []
            },
            {
                id: 4,
                label: 'Spectromètre Mössbauer #1',
                nodeId: 167,
                components: []
            },
            {
                id: 5,
                label: 'Diffractomètre RX #1',
                nodeId: 81,
                components: []
            }
        ]
    }
}

