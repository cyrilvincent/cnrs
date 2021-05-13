import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConnectionService } from '../shared/connection.service';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css']
})
export class ConnectionComponent implements OnInit {

  constructor(public service: ConnectionService) { }

  ngOnInit(): void {
    this.service.start();
  }

  get state() {
    if (this.service.state && this.service.onLine) {
      return 0;
    }
    if (!this.service.onLine) {
      return 1;
    }
    if (!this.service.state && this.service.onLine) {
      return 2;
    }
    return -1;
  }

}
