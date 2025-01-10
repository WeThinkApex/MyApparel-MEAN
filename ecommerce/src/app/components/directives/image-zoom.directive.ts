import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[imageZoom]'
})
export class ImageZoomDirective implements OnInit, OnDestroy, OnChanges {
  @Input() zoomLevel: number = 2;
  @Input() imageUrl: string = ''; // Add this line
  @Output() zoomState = new EventEmitter<boolean>();
  private image: HTMLImageElement;
  private zoomedContainer: HTMLDivElement | any
  private zoomedImage: HTMLImageElement | any
  private isZoomed: boolean = false;
  constructor(private el: ElementRef) {
    this.image = this.el.nativeElement;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['imageUrl'] && !changes['imageUrl'].firstChange) {
      if (this.zoomedImage) {
        this.zoomedImage.src = this.image.src;
      }
    }
  }

  ngOnInit() {
    // Create zoomed container
    this.zoomedContainer = document.createElement('div');
    this.zoomedContainer.className = 'zoomed-container';
    this.zoomedContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 100%;
      width: 100%;
      height: 100%;
      overflow: hidden;
      opacity: 0;
      margin-left: 20px;
      border: 1px solid #e0e0e0;
      display: none; /* Add this line */
      background-color: white;
      transition: opacity 0.3s ease;
    `;

    // Create zoomed image
    this.zoomedImage = document.createElement('img');
    this.zoomedImage.src = this.image.src;
    this.zoomedImage.style.cssText = `
      position: absolute;
      max-width: none;
      max-height: none;
      transform-origin: 0 0;
      transform: scale(${this.zoomLevel});
    `;

    // Setup container
    this.zoomedContainer.appendChild(this.zoomedImage);
    this.image.parentElement?.appendChild(this.zoomedContainer);
    this.image.style.cursor = 'crosshair';
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.isZoomed = true;
    this.zoomState.emit(true); 
    this.zoomedContainer.style.opacity = '1';
    this.zoomedContainer.style.display = 'block'; 
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isZoomed = false;
    this.zoomState.emit(false);
    this.zoomedContainer.style.opacity = '0';
    this.zoomedContainer.style.display = 'none'; 
  }

 

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (!this.isZoomed) return;

    const rect = this.image.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate percentages
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    // Move zoomed image
    this.zoomedImage.style.transform = `
      scale(${this.zoomLevel}) 
      translate(${-xPercent}%, ${-yPercent}%)
    `;
  }

  ngOnDestroy() {
    this.zoomedContainer?.remove();
  }
}