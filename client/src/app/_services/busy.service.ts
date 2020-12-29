import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  countLoadingAnimation = 0;

  constructor(private spinner: NgxSpinnerService) { }

  showLoadingAnimation(){
    this.countLoadingAnimation++;
    this.spinner.show(undefined, {
      type: "fire",
      size: "large",
      bdColor: "rgba(255, 255, 255, 0.5)",
      color: "#F3969A",
    });
  }

  hideLoadingAnimation(){
    this.countLoadingAnimation--;
    if(this.countLoadingAnimation <= 0){
      this.countLoadingAnimation = 0;
      this.spinner.hide();
    }
  }
}
