import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environment';
import { AdminPanelSService } from 'src/app/components/adminpanel/adminpanel.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

interface Product {
  brand: string;
  title: string;
  mainImage: string;
  price: number;
  originalPrice: number;
  sizes: Array<{
    name: string;
    stock: number;
    _id: string;
  }>;
  deliveryInfo: string;
  link: string;
}

@Component({
  selector: 'app-premium-boutiques',
  templateUrl: './premium-boutiques.component.html',
  styleUrls: ['./premium-boutiques.component.css']
})
export class PremiumBoutiquesComponent {
  products: Product[] = [];
  isLoading = false;
  private imgURL = `${environment.imgURL}`;
  constructor(private router: Router, private productService: AdminPanelSService, private snackbar: SnackbarService
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
            // Handle both mainImage and additional images
            mainImage: product.mainImage ?
              `${backendBaseUrl}${product.mainImage}` :
              'path/to/default-image.jpg',
            images: product.additionalImages?.map((img: any) => ({
              ...img,
              url: `${backendBaseUrl}${img.url}`
            })) || [],
            // Ensure sizes array exists
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

  isOutOfStock(product: Product): boolean {
    return !(product.sizes?.some((s) => s.stock > 0));
  }

  getButtonText(product: Product): string {
    return this.isOutOfStock(product) ? 'OUT OF STOCK' : 'ADD TO CART';
  }
  handleImageError(event: any) {
    event.target.src = 'assets/no-image-available.jpg';
  }
  addToCart(card: Product, event: Event): void {
    event.preventDefault(); // Prevent navigation when clicking the button
    event.stopPropagation(); // Prevent event bubbling
    // Add your cart logic here
    console.log('Adding to cart:', card.title);
  }

  calculateDiscount(product: { originalPrice: number; price: number; }) {
    const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
    return Math.round(discount);
  }
  navigateToProduct(product: any) {
    const productId = product._id;
    this.router.navigate(['/product', productId]);
  }
  getLimitedSizes(sizes: { name: string; stock: number; _id: string }[], limit: number) {
    return sizes.slice(0, limit);
  }
}