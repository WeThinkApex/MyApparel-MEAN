import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface ProductDetail {
  brand: string;
  title: string;
  imageUrl: string;
  price: number;
  originalPrice: number;
  sizes: { size: string, inStock: boolean }[];
  deliveryInfo: string;
  description: string;
  materialCare: string[];
  specifications: string[];
}

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: ProductDetail | undefined;
  selectedSize: string = '';
  pincode: string = '';
  
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Get the product ID from route params
    this.route.params.subscribe(params => {
      const productId = params['id'];
      // In a real app, you would fetch product details from a service
      this.loadProductDetails(productId);
    });
  }

  loadProductDetails(productId: string) {
    // Simulate API call - replace with actual API call
    this.product = {
      brand: 'Mark & Mia',
      title: 'High Low Sequined Party Frock with Bow Applique - Peach',
      imageUrl: 'assets/premium/premium-1.jpg',
      price: 1799,
      originalPrice: 3599,
      sizes: [
        { size: '2Y', inStock: true },
        { size: '3Y', inStock: true },
        { size: '4Y', inStock: false },
        { size: '5Y', inStock: true }
      ],
      deliveryInfo: 'Get it by Saturday, Jan 11',
      description: 'Beautiful party frock for special occasions',
      materialCare: [
        '100% Cotton',
        'Machine wash',
        'Wash with similar colors'
      ],
      specifications: [
        'Regular fit',
        'Short sleeves',
        'Round neck',
        'Suitable for all occasions'
      ]
    };
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }

  checkDelivery() {
    // Implement pincode check logic
    console.log('Checking delivery for pincode:', this.pincode);
  }

  addToCart() {
    if (!this.selectedSize) {
      // Show error message
      return;
    }
    // Implement add to cart logic
    console.log('Adding to cart:', this.product?.title, 'Size:', this.selectedSize);
  }
}