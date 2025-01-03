// carousel.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

export interface CarouselImage {
  url: string;
  alt: string;
  link?: string;
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  @ViewChild('carousel') carousel!: NgbCarousel;

  images: CarouselImage[] = [
    {
      url: 'assets/home/banner.jpg',
      alt: 'Mom & Kids Fashion 50% Off',
      link: '/fashion-sale'
    },
    {
      url: 'assets/home/banner-2.jpg',
      alt: 'Diaper Carnival Sale',
      link: '/diaper-sale'
    },
    {
      url: 'assets/home/banner-3.jpg',
      alt: 'Diaper Carnival Sale',
      link: '/diaper-sale'
    }
  ];

  ngOnInit(): void {
  }

  onSlideChange(event: any): void {
  }
}