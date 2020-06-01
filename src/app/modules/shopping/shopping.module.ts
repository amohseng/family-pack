import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '../material/material.module';
import { ShoppingRoutingModule } from './shopping-routing.module';

import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingTemplateComponent } from './shopping-template/shopping-template.component';
import { ShoppingHistoryComponent } from './shopping-history/shopping-history.component';
import { ShoppingConfirmComponent } from './shopping-confirm/shopping-confirm.component';



@NgModule({
  declarations: [ ShoppingListComponent, ShoppingTemplateComponent, ShoppingHistoryComponent, ShoppingConfirmComponent],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MaterialModule,
    ShoppingRoutingModule
  ],
  entryComponents: [ShoppingConfirmComponent]
})
export class ShoppingModule { }
