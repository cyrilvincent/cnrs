import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ConnectionService } from './connection.service';

describe('ConnectionService', () => {
    let service: ConnectionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule]
      });
      service = TestBed.inject(ConnectionService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('google', () => {
      service.checkInternet();
      expect(service.state).toBeTrue();
    });
  });
