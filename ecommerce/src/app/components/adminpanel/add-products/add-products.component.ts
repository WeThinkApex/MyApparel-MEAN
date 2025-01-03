import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminPanelSService } from '../adminpanel.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css']
})
export class AddProductDialogComponent implements OnInit {
  productForm: FormGroup;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  isSubmitting = false;
  categories = [
    { value: 'GIRLS FASHION', label: 'Girls Fashion' },
    { value: 'BOYS FASHION', label: 'Boys Fashion' },
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddProductDialogComponent>,
    private productService: AdminPanelSService,
    private snackBar: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      stock: ['', Validators.required]
    });

    if (data?.product) {
      this.productForm.patchValue({
        title: data.product.title,
        description: data.product.description,
        price: data.product.price,
        category: data.product.category,
        stock: data.product.stock
      });
      this.imagePreview = data.product.imageUrl;
    }
  }

  ngOnInit() {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.handleFile(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  private handleFile(file: File) {
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.snackBar.successSnackBar('Please select an image file')
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.isSubmitting = true;
      const formData = new FormData();
      formData.append('title', this.productForm.get('title')?.value);
      formData.append('description', this.productForm.get('description')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('category', this.productForm.get('category')?.value);
      formData.append('stock', this.productForm.get('stock')?.value);
      formData.append('brand', 'Default Brand'); 
      // Only append the file if a new one is selected
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }
  
      // Determine whether to create or update the product
      const request = this.data?.product?._id
        ? this.productService.updateProduct(this.data.product._id, formData)
        : this.productService.createProduct(formData);
  
      request.subscribe({
        next: (response) => {
          const successMessage =
            this.data?.mode === 'edit'
              ? 'Product updated successfully'
              : 'Product added successfully';
          this.snackBar.successSnackBar(successMessage)
    this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error saving product:', error);
          this.isSubmitting = false;
          this.snackBar.errorSnackBar('Error saving product')

        },
      });
    } else {
      // Form validation error
      this.snackBar.errorSnackBar('Please fill all required fields')
    }
  }
  

  onClose() {
    this.dialogRef.close();
  }
}