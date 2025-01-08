import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductDialogComponent } from './add-products.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    AddProductDialogComponent,

  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCheckboxModule  
  ]
})
export class AdminpanelModule { }
