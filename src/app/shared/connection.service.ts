import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, timer } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  state = true;
  timer = timer(1000, environment.checkInternet);
  timer$: Subscription;
  error = '';

  get onLine() {
    if (this.state && !navigator.onLine) {
      if (this.state) {
        this.snackbar.open('Serveur injoignable, vérifiez votre connexion Internet', 'OK');
        this.error = 'Aucune connexion réseau';
      }
      this.state = false;
    }
    return navigator.onLine;
  }

  constructor(private http: HttpClient, private snackbar: MatSnackBar) {
  }

  start() {
    this.timer$ = this.timer.subscribe(_ => this.checkInternet());
  }

  stop() {
    this.timer$.unsubscribe();
  }


  checkInternet() {
    const res = this.http.get('http://worldclockapi.com/api/json/utc/now')
    res.subscribe(
      _ => {},
      error => {
        this.error = error.message;
        if (this.state) {
          this.snackbar.open('Serveur injoignable, vérifiez votre connexion Internet', 'OK');
        }
        this.state = false;
      },
      () => {
        this.state = true;
        this.error = 'Connexion Internet OK';
      });
  }
}
