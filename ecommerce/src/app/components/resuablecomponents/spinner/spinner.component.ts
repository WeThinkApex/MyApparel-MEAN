import { Component, OnInit } from '@angular/core';
import { ResuableService } from '../resuable.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
  isLoading: boolean = false;

  constructor(private loadingService: ResuableService) {}

  ngOnInit() {
    this.loadingService.isLoading$.subscribe(
      (isLoading) => {
        this.isLoading = isLoading;
      }
    );
  }
}