import { ValidatorService } from './validator.service';
import { TestBed } from '@angular/core/testing';

describe('ConstraintsService', () => {
    let service: ValidatorService;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.inject(ValidatorService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('getRequiredsAndUniques', () => {
      const node = service.service.db[1];
      const rnode = service.service.db[2];
      rnode.required = true;
      const unode = service.service.db[8];
      unode.unique = true;
      const res = service.getRequiredsAndUniques(node);
      expect(res.size).toBe(2);
    });

    it('countAncestors', () => {
      const node = service.service.db[1];
      const rnode = service.service.db[2];
      rnode.required = true;
      const unode = service.service.db[8];
      unode.unique = true;
      const res = service.getRequiredsAndUniques(node);
      service.service.addEquipment(1, 'Equipment 1');
      let ancestors = service.countAncestors(service.service.equipments[0], res);
      expect(ancestors.size).toBe(2);
      expect(ancestors.get(rnode)).toBe(0);
      expect(ancestors.get(unode)).toBe(0);
      service.service.addComponant(3, 'C3', '');
      ancestors = service.countAncestors(service.service.equipments[0], res);
      expect(ancestors.get(rnode)).toBe(1);
    });

    it('checkRequiredAndUnique', () => {
      const node = service.service.db[1];
      const rnode = service.service.db[2];
      rnode.required = true;
      const unode = service.service.db[8];
      unode.unique = true;
      service.service.addEquipment(1, 'Equipment 1');
      let res = service.checkRequiredAndUnique(service.service.equipments[0]);
      expect(res.size).toBe(1);
      service.service.addComponant(13, 'C13', '');
      service.service.addComponant(14, 'C13', '');
      res = service.checkRequiredAndUnique(service.service.equipments[0]);
      expect(res.size).toBe(2);
      service.service.addComponant(3, 'C3', '');
      res = service.checkRequiredAndUnique(service.service.equipments[0]);
      expect(res.size).toBe(1);
    });
  });
