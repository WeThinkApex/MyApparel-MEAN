// add-products.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminPanelSService } from '../adminpanel.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { environment } from 'environment';

interface Size {
  name: string;
  stock: number;
}

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css']
})
export class AddProductDialogComponent implements OnInit {
  productForm: FormGroup | any;
  mainImagePreview: string | null = null;
  selectedMainImage: File | null = null;
  additionalImages: { file: File, preview: string }[] = [];
  isSubmitting = false;
  categories = [
    { value: 'GIRLS FASHION', label: 'Girls Fashion' },
    { value: 'BOYS FASHION', label: 'Boys Fashion' },
  ];
  removedImageUrls: string[] = [];
  availableSizes = ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y', '9Y', '10Y'];
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddProductDialogComponent>,
    private productService: AdminPanelSService,
    private snackBar: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.initializeForm();
    if (data?.product) {
      this.patchFormWithExistingProduct(data.product);
    }
  }
  ngOnInit(): void {
    this.loadCategories();
  }
  private loadCategories(): void {
    this.categories = [
      { value: 'GIRLS FASHION', label: 'Girls Fashion' },
      { value: 'BOYS FASHION', label: 'Boys Fashion' },
      
    ];
  }
  private initializeForm(): void {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      originalPrice: ['', [Validators.required, Validators.min(0)]],
      // clubPrice: [''],
      category: ['', Validators.required],
      brand: ['', Validators.required],
      sizes: this.fb.array([]),
      sizeAndFit: this.fb.array(['']),
      materialCare: this.fb.array(['']),
      productDetails: this.fb.array(['']),
      deliveryInfo: ['Standard delivery in 4-5 business days'],
      isActive: [true]
    });
    this.availableSizes.forEach(size => {
      this.addSize(size);
    });
  }
  get sizesFormArray() {
    return this.productForm.get('sizes') as FormArray;
  }

  get sizeAndFitFormArray() {
    return this.productForm.get('sizeAndFit') as FormArray;
  }

  get materialCareFormArray() {
    return this.productForm.get('materialCare') as FormArray;
  }

  get productDetailsFormArray() {
    return this.productForm.get('productDetails') as FormArray;
  }

  // Add/Remove form array items
  addSize(sizeName: string) {
    const sizeGroup = this.fb.group({
      name: [sizeName],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
    this.sizesFormArray.push(sizeGroup);
  }

  addSizeAndFit() {
    this.sizeAndFitFormArray.push(this.fb.control(''));
  }

  addMaterialCare() {
    this.materialCareFormArray.push(this.fb.control(''));
  }

  addProductDetail() {
    this.productDetailsFormArray.push(this.fb.control(''));
  }

  removeArrayItem(array: FormArray, index: number) {
    array.removeAt(index);
  }
  private cleanImageUrl(url: string): string {
    const match = url.match(/\/uploads\/products\/.*$/);
    return match ? match[0] : url;
  }
  private patchFormWithExistingProduct(product: any): void {
    // Basic form fields
    this.productForm.patchValue({
      title: product.title,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      brand: product.brand,
      deliveryInfo: product.deliveryInfo,
      isActive: product.isActive
    });
    // Set main image preview
    if (product.mainImage) {
      this.mainImagePreview = product.mainImage;
      console.log("inside ", this.mainImagePreview )
    }
    // Handle additional images
    if (product.additionalImages && product.additionalImages.length > 0) {
      this.additionalImages = product.additionalImages?.map((img: string, index: number) => ({
        file: null,
        preview: img,
        isExisting: true
  
      })) || [];
    }
    // Clear and patch size array
    this.sizesFormArray.clear();
    if (product.sizes && product.sizes.length > 0) {
      product.sizes.forEach((size: Size) => {
        this.sizesFormArray.push(this.fb.group({
          name: [size.name],
          stock: [size.stock]
        }));
      });
    } else {
      this.availableSizes.forEach(size => {
        this.addSize(size);
      });
    }
    // Handle arrays with proper null checks
    ['sizeAndFit', 'materialCare', 'productDetails'].forEach(arrayName => {
      const formArray = this.productForm.get(arrayName) as FormArray;
      formArray.clear();
      if (product[arrayName] && Array.isArray(product[arrayName])) {
        product[arrayName].forEach((item: string) => {
          formArray.push(this.fb.control(item));
        });
      }
      // If array is empty, add at least one empty control
      if (formArray.length === 0) {
        formArray.push(this.fb.control(''));
      }
    });
}

  // File handling methods
  onMainImageSelected(event: any) {
    const file = event.target.files[0];
    this.handleMainImage(file);
  }

  onAdditionalImagesSelected(event: any) {
    const files = event.target.files;
    this.handleAdditionalImages(Array.from(files));
  }

  private handleMainImage(file: File) {
    if (file && file.type.startsWith('image/')) {
      this.selectedMainImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.mainImagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.snackBar.errorSnackBar('Please select a valid image file');
    }
  }

  private handleAdditionalImages(files: File[]) {
    files.forEach(file => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.additionalImages.push({
            file: file,
            preview: reader.result as string
          });
        };
        reader.readAsDataURL(file);
      }
    });
  }

  removeAdditionalImage(index: number) {
    const removedImage = this.additionalImages[index];
    if (!removedImage.file && removedImage.preview.includes('/uploads/')) {
      this.removedImageUrls.push(removedImage.preview);
    }
    this.additionalImages.splice(index, 1);
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.isSubmitting = true;
      const formData = new FormData();
      Object.keys(this.productForm.value).forEach(key => {
        if (key !== 'sizes' && key !== 'sizeAndFit' && 
            key !== 'materialCare' && key !== 'productDetails') {
          formData.append(key, this.productForm.get(key)?.value);
        }
      });
      formData.append('sizes', JSON.stringify(this.sizesFormArray.value));
      formData.append('sizeAndFit', JSON.stringify(this.sizeAndFitFormArray.value));
      formData.append('materialCare', JSON.stringify(this.materialCareFormArray.value));
      formData.append('productDetails', JSON.stringify(this.productDetailsFormArray.value));
      if (this.selectedMainImage) {
        formData.append('mainImage', this.selectedMainImage);
      }
      
      const existingImages = this.additionalImages
      .filter((img:any) => img.isExisting)
      .map(img => this.cleanImageUrl(img.preview));
    this.additionalImages
      .filter(img => img.file)
      .forEach((img) => {
        formData.append('additionalImages', img.file);
      });
      const remainingImageUrls = this.additionalImages
        .filter(img => !img.file)
        .map(img => img.preview);
      formData.append('remainingImages', JSON.stringify(remainingImageUrls));
      formData.append('existingImages', JSON.stringify(existingImages));
      const cleanedRemovedUrls = this.removedImageUrls.map(url => this.cleanImageUrl(url));
    formData.append('removedImages', JSON.stringify(cleanedRemovedUrls));
      const request = this.data?.product?._id
        ? this.productService.updateProduct(this.data.product._id, formData)
        : this.productService.createProduct(formData);

      request.subscribe({
        next: (response) => {
          const successMessage = this.data?.mode === 'edit'
            ? 'Product updated successfully'
            : 'Product added successfully';
          this.snackBar.successSnackBar(successMessage);
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error saving product:', error);
          this.isSubmitting = false;
          this.snackBar.errorSnackBar('Error saving product: ' + error.message);
        }
      });
    } else {
      this.snackBar.errorSnackBar('Please fill all required fields');
      this.markFormGroupTouched(this.productForm);
    }
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}