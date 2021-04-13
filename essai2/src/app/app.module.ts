import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { BasicComponent } from "./basic/basic.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AddformgroupsComponent } from "./addformgroups/addformgroups.component";

@NgModule({
  declarations: [AppComponent, BasicComponent, AddformgroupsComponent],
  imports: [BrowserModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
