import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingTemplateComponent } from './shopping-template/shopping-template.component';
import { ShoppingHistoryComponent } from './shopping-history/shopping-history.component';


const routes: Routes = [
  {path: 'list', component: ShoppingListComponent},
  {path: 'template', component: ShoppingTemplateComponent},
  {path: 'history', component: ShoppingHistoryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingRoutingModule { }
