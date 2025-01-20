import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminPanelSService } from '../adminpanel/adminpanel.service';
import { environment } from 'src/environments/environment';

interface ProductImage {
  url: string;
  alt: string;
}

interface Size {
  name: string;
  stock: number;
}

interface DeliveryInfo {
  estimatedDate: string;
  isAvailable: boolean;
  isCodAvailable: boolean;
}

interface Product {
  id: string;
  brand: string;
  title: string;
  images: ProductImage[];
  price: number;
  originalPrice: number;
  sizes: Size[];
  sizeAndFit: string[];
  materialCare: string[];
  productDetails: string[];
  sizeChartImage: string;
}

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  @ViewChild('zoomContainer', { static: true }) zoomContainer!: ElementRef;

  product: Product | undefined;
  currentImageIndex: number = 0;
  selectedSize: string | null = null;
  pincode: string = '';
  deliveryInfo: DeliveryInfo | null = null;
  showNotifyModal: boolean = false;
  isInWishlist: boolean = false;
  notificationEmail: string = '';
  notificationPhone: string = '';
  inStock: boolean = true;
  isZoomActive: boolean = false;
  expandedSections = {
    sizeAndFit: false,
    materialCare: false,
    productDetails: false
  };
  private imgURL = `${environment.imgURL}`;

  constructor(
    private route: ActivatedRoute, 
    private productService: AdminPanelSService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.loadProductDetails(productId);
    });
  }
  onZoomStateChange(zoomActive: boolean) {
    this.isZoomActive = zoomActive;
  }
  loadProductDetails(productId: string) {
    this.productService.getProduct(productId).subscribe({
      next: (product) => {
        const backendBaseUrl = this.imgURL;
        const mainImage = product.mainImage
          ? { url: `${backendBaseUrl}${product.mainImage}`, alt: 'Main View' }
          : { url: 'assets/no-image-available.jpg', alt: 'Default Image' };
        const additionalImages = product.additionalImages?.map((img: string, index: number) => ({
          url: `${backendBaseUrl}${img}`,
          alt: `Additional View ${index + 1}`
        })) || [];
        this.product = {
          ...product,
          images: [mainImage, ...additionalImages]
        };
      },
      error: (error) => {
        console.error('Error loading product:', error);
      }
    });
  }

  setActiveImage(index: number) {
    this.currentImageIndex = index;
  }

  selectSize(size: Size) {
    if (size.stock > 0) {
      this.selectedSize = size.name;
      this.inStock = true;
    } else {
      this.showNotifyModal = true;
      this.inStock = false;
    }
  }

  shouldShowStock(size: Size): boolean {
    return size.stock > 0 && size.stock < 10;
  }

  calculateDiscount(price: number, originalPrice: number): number {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  isOutOfStock(product: Product): boolean {
    return !product.sizes?.some((s) => s.stock > 0);
  }

  checkDelivery() {
    if (this.pincode.length === 6) {
      this.deliveryInfo = {
        estimatedDate: 'Saturday, Jan 11',
        isAvailable: true,
        isCodAvailable: true
      };
    }
  }

  closeNotifyModal() {
    this.showNotifyModal = false;
    this.notificationEmail = '';
    this.notificationPhone = '';
  }

  submitNotification() {
    console.log('Notification submitted:', {
      email: this.notificationEmail,
      phone: this.notificationPhone
    });
    this.closeNotifyModal();
  }

  toggleWishlist() {
    this.isInWishlist = !this.isInWishlist;
  }

  addToCart() {
    if (this.selectedSize && this.inStock && this.product) {
      console.log('Adding to cart:', {
        product: this.product.title,
        size: this.selectedSize
      });
    }
  }
}