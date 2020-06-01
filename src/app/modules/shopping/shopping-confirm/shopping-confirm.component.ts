import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-shopping-confirm',
  templateUrl: './shopping-confirm.component.html',
  styleUrls: ['./shopping-confirm.component.scss']
})
export class ShoppingConfirmComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
