import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor( private snackBar: MatSnackBar,) { }


  successSnackBar(msg:any){
    this.snackBar.open(msg, 'Close', {
      duration: 3000,
      panelClass: 'snackbar-success',
      verticalPosition: 'top'
    });
  }
  errorSnackBar(msg:any){
    this.snackBar.open(msg, 'Close', {
      duration: 3000,
      panelClass: 'snackbar-error',
      verticalPosition: 'top'
    });
  }
}
