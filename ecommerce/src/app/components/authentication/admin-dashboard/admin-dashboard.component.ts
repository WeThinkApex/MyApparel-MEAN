import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../core/services/auth.service';
import { AddProductDialogComponent } from '../../adminpanel/add-products/add-products.component';
import { AdminPanelSService } from '../../adminpanel/adminpanel.service';
import { environment } from 'src/environments/environment';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  images: Array<{
    url: string;
    alt: string;
  }>;
  mainImage: string;
  category: string;
  sizes: Array<{
    name: string;
    stock: number;
  }>;
  totalStock: number;
  sizeAndFit?: string[];
  materialCare?: string[];
  productDetails?: string[];
  deliveryInfo?: string;
  isActive: boolean;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  isAuthenticated = false;
  private imgURL = `${environment.imgURL}`;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private productService: AdminPanelSService,
    private snackbar: SnackbarService
  ) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (products: any) => {
        const backendBaseUrl = this.imgURL;
        this.products = (Array.isArray(products) ? products : products['products'])
          .map((product: any) => ({
            ...product,
            // Handle mainImage
            mainImage: product.mainImage ?
              `${backendBaseUrl}${product.mainImage}` :
              'assets/no-image-available.jpg',
            // Handle additionalImages array properly
            additionalImages: Array.isArray(product.additionalImages) ?
              product.additionalImages.map((imgPath: string) =>
                `${backendBaseUrl}${imgPath}`
              ) : [],
            // Ensure sizes array exists with proper format
            sizes: product.sizes || [],
            // Calculate total stock
            totalStock: product.sizes?.reduce(
              (total: number, size: any) => total + size.stock,
              0
            ) || 0
          }));
        this.isLoading = false;
      },
      error: (error) => {
        this.snackbar.errorSnackBar('Error loading products. Please try again.')
        this.isLoading = false;
      }
    });
  }
  handleImageError(event: any) {
    event.target.src = 'assets/no-image-available.jpg';
  }

  openAddProductDialog() {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '800px',  
      maxHeight: '90vh', 
      position: { top: '50px' }, 
      panelClass: 'centered-dialog',
      autoFocus: false,
      hasBackdrop: true,
      data: { mode: 'add' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }
  editProduct(product: Product) {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '400px',
      height: '800px',
      position: { right: '0' },
      panelClass: 'right-sidebar-dialog',
      autoFocus: false,
      hasBackdrop: true,
      data: { mode: 'edit', product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  deleteProduct(productId: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: (response) => {
          this.snackbar.successSnackBar('Product deleted successfully')
          this.loadProducts();
        },
        error: (error) => {
          this.snackbar.errorSnackBar('Error deleting product. Please try again.')
        },
      });
    }
  }


  logout() {
    this.authService.logout();
    this.snackbar.successSnackBar('Admin Logged Out Successfully')
    this.isAuthenticated = false;
    this.router.navigate(['admin/login']);
  }
}