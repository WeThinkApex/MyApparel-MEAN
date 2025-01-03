// premium-boutiques.component.ts
import { Component } from '@angular/core';

interface Product {
  brand: string;
  title: string;
  imageUrl: string;
  price: number;
  originalPrice: number;
  sizes: string[];
  deliveryInfo: string;
  link: string;
}

@Component({
  selector: 'app-premium-boutiques',
  templateUrl: './premium-boutiques.component.html',
  styleUrls: ['./premium-boutiques.component.css']
})
export class PremiumBoutiquesComponent {
  products: Product[] = [
    {
      brand: 'Mark & Mia',
      title: 'High Low Sequined Party Frock with Bow Applique - Peach',
      imageUrl: 'assets/premium/premium-1.jpg',
      price: 1799,
      originalPrice: 3599,
      sizes: ['2Y', '3Y', '4Y', '5Y', '6Y'],
      deliveryInfo: 'Get it Tuesday, Dec 19',
      link: '/product/high-low-sequined-party-frock',
      
    },
    {
      brand: 'Mark & Mia',
      title: 'Full Sleeves Party Suit Solid Colour - Blue',
      imageUrl: 'assets/premium/premium-2.jpg',
      price: 1499,
      originalPrice: 2999,
      sizes: ['2Y', '3Y', '4Y', '5Y', '6Y'],
      deliveryInfo: 'Get it Tuesday, Dec 19',
      link: '/product/full-sleeves-party-suit'
    },
    {
      brand: 'Mark & Mia',
      title: 'Full Sleeves Party Suit Solid Colour - Blue',
      imageUrl: 'assets/premium/premium-2.jpg',
      price: 1499,
      originalPrice: 2999,
      sizes: ['2Y', '3Y', '4Y', '5Y', '6Y'],
      deliveryInfo: 'Get it Tuesday, Dec 19',
      link: '/product/full-sleeves-party-suit'
    },
    {
      brand: 'Mark & Mia',
      title: 'Full Sleeves Party Suit Solid Colour - Blue',
      imageUrl: 'assets/premium/premium-2.jpg',
      price: 1499,
      originalPrice: 2999,
      sizes: ['2Y', '3Y', '4Y', '5Y', '6Y'],
      deliveryInfo: 'Get it Tuesday, Dec 19',
      link: '/product/full-sleeves-party-suit'
    },
    {
      brand: 'Mark & Mia',
      title: 'Full Sleeves Party Suit Solid Colour - Blue',
      imageUrl: 'assets/premium/premium-2.jpg',
      price: 1499,
      originalPrice: 2999,
      sizes: ['2Y', '3Y', '4Y', '5Y', '6Y'],
      deliveryInfo: 'Get it Tuesday, Dec 19',
      link: '/product/full-sleeves-party-suit'
    },
    {
      brand: 'Mark & Mia',
      title: 'Full Sleeves Party Suit Solid Colour - Blue',
      imageUrl: 'assets/premium/premium-2.jpg',
      price: 1499,
      originalPrice: 2999,
      sizes: ['2Y', '3Y', '4Y', '5Y', '6Y'],
      deliveryInfo: 'Get it Tuesday, Dec 19',
      link: '/product/full-sleeves-party-suit'
    },
    // Add more products as needed...
  ];

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
}