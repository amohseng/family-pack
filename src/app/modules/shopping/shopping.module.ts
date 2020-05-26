import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ShoppingRoutingModule } from './shopping-routing.module';
import { MaterialModule } from '../material/material.module';
import { ListComponent } from './list/list.component';
import { ItemsComponent } from './items/items.component';
import { HistoryComponent } from './history/history.component';



@NgModule({
  declarations: [ListComponent, ItemsComponent, HistoryComponent],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MaterialModule,
    ShoppingRoutingModule
  ]
})
export class ShoppingModule { }
