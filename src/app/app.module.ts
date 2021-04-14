import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from "./app.component";
import { ReactiveFormsModule } from "@angular/forms";
import { EquipmentsComponent } from "./equipments/equipments.component";
import { MaterialModule} from "./material.module";

@NgModule({
  declarations: [AppComponent, EquipmentsComponent],
  imports: [BrowserModule, ReactiveFormsModule, MaterialModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
