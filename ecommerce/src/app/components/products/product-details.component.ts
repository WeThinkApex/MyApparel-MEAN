import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminPanelSService } from '../adminpanel/adminpanel.service';
import { environment } from 'environment';

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

  product: Product | undefined;
  currentImageIndex: number = 0;
  selectedSize: string | null = null;
  pincode: string = '';
  deliveryInfo: DeliveryInfo | null = null;
  showSizeChart: boolean = false;
  showNotifyModal: boolean = false;
  isInWishlist: boolean = false;
  notificationEmail: string = '';
  notificationPhone: string = '';
  inStock: boolean = true;
  showZoom = false;
  zoomStyle: { [key: string]: string } = {};
  zoomImageStyle: { [key: string]: string } = {};
  expandedSections = {
    sizeAndFit: false,
    materialCare: false,
    productDetails: false
  };
  private imgURL = `${environment.imgURL}`;

  constructor(private route: ActivatedRoute, private productService: AdminPanelSService,) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.loadProductDetails(productId);
    });
  }
  
  
  onMouseMove(event: MouseEvent) {
    if (!this.showZoom) return;
  
    const containerRect = (event.target as HTMLElement).getBoundingClientRect();
    const x = event.clientX - containerRect.left;
    const y = event.clientY - containerRect.top;
    
    const zoomX = (x / containerRect.width) * 100;
    const zoomY = (y / containerRect.height) * 100;
  
    this.zoomImageStyle = {
      transform: `translate(-${zoomX}%, -${zoomY}%) scale(2)`
    };
  }
  
  onMouseEnter() {
    this.showZoom = true;
  }
  
  onMouseLeave() {
    this.showZoom = false;
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
        console.log("additional images",this.product)
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

  calculateDiscount(price: number, originalPrice: number): number {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  isOutOfStock(product: Product): boolean {
    return !(product.sizes?.some((s) => s.stock > 0));
  }

  checkDelivery() {
    if (this.pincode.length === 6) {
      // Simulate API call for delivery check
      this.deliveryInfo = {
        estimatedDate: 'Saturday, Jan 11',
        isAvailable: true,
        isCodAvailable: true
      };
    }
  }

  openSizeChart() {
    this.showSizeChart = true;
  }

  closeSizeChart() {
    this.showSizeChart = false;
  }

  closeNotifyModal() {
    this.showNotifyModal = false;
    this.notificationEmail = '';
    this.notificationPhone = '';
  }

  submitNotification() {
    // Implement notification signup logic
    console.log('Notification submitted:', {
      email: this.notificationEmail,
      phone: this.notificationPhone
    });
    this.closeNotifyModal();
  }

  toggleWishlist() {
    this.isInWishlist = !this.isInWishlist;
    // Implement wishlist logic
  }

  toggleSection(section: keyof typeof this.expandedSections) {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  addToCart() {
    if (this.selectedSize && this.inStock) {
      // Implement add to cart logic
      console.log('Adding to cart:', {
        product: this.product?.title,
        size: this.selectedSize
      });
    }
  }
}