import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailsComponent } from './product-details.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';


@NgModule({
  declarations: [
    ProductDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatExpansionModule,
    MatIconModule
  ]
})
export class ProductsModule { }
