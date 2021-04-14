import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'CNRS Equipments Demo';

  refresh() {
    document.location.reload();
  }

  about() {
    window.alert(this.title + " by Cyil Vincent");
  }
}
