import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  clubPrice: number;
  sizes: Size[];
  sizeAndFit: string[];
  materialCare: string[];
  productDetails: string[];
  sizeChartImage: string;  // Add this line
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

  expandedSections = {
    sizeAndFit: false,
    materialCare: false,
    productDetails: false
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.loadProductDetails(productId);
    });
  }

  loadProductDetails(productId: string) {
    // Simulated product data - replace with actual API call
    this.product = {
      id: productId,
      brand: 'PUMA',
      title: 'Cotton Knit Half Sleeves T-Shirt With Logo Print - Teal Blue',
      images: [
        { url: 'assets/premium/premium-1.jpg', alt: 'Front View' },
        { url: 'assets/premium/premium-2.jpg', alt: 'Back View' },
        { url: 'assets/premium/premium-1.jpg', alt: 'Side View' },
        { url: 'assets/premium/premium-2.jpg', alt: 'Detail View' }
      ],
      price: 711,
      originalPrice: 799,
      clubPrice: 695,
      sizes: [
        { name: '2-3Y', stock: 1 },
        { name: '3-4Y', stock: 3 },
        { name: '4-5Y', stock: 1 },
        { name: '5-6Y', stock: 3 },
        { name: '7-8Y', stock: 5 },
        { name: '9-10Y', stock: 5 }
      ],
      sizeAndFit: [
        'Regular Fit',
        'The model (height 6\') is wearing size M'
      ],
      materialCare: [
        '100% Cotton',
        'Machine wash',
        'Do not bleach',
        'Tumble dry low'
      ],
      productDetails: [
        'Round neck',
        'Short sleeves',
        'Printed branding',
        'Cotton knit fabric'
      ],
      sizeChartImage: 'assets/images/size-chart.jpg'
    };
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

  calculateClubSavings(): number {
    if (this.product) {
      return this.product.price - this.product.clubPrice;
    }
    return 0;
  }

  calculateEarnPoints(): number {
    if (this.product) {
      return Math.floor(this.product.clubPrice * 0.05); // 5% points
    }
    return 0;
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