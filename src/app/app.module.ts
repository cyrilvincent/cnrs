import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from "./app.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AddformgroupsComponent } from "./addformgroups/addformgroups.component";
import { MaterialModule} from "./material.module";

@NgModule({
  declarations: [AppComponent, AddformgroupsComponent],
  imports: [BrowserModule, ReactiveFormsModule, MaterialModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
