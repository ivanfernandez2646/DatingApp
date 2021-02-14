import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrls: ['./test-errors.component.css']
})
export class TestErrorsComponent implements OnInit {
  baseUrl = environment.apiRoute;
  validationErrors: string[];

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
  }

  get400BadRequest(){
    this.httpClient.get(this.baseUrl + "buggy/bad-request").subscribe(res => {
      console.log(res);
    }, error => {
      //console.log(error);
    });
  }

  get401Unauthorized(){
    this.httpClient.get(this.baseUrl + "buggy/auth").subscribe(res => {
      console.log(res);
    }, error => {
      //console.log(error);
    });
  }

  get404NotFound(){
    this.httpClient.get(this.baseUrl + "buggy/not-found").subscribe(res => {
      //console.log(res);
    }, error => {
      //console.log(error);
    });
  }

  get500ServerError(){
    this.httpClient.get(this.baseUrl + "buggy/server-error").subscribe(res => {
      console.log(res);
    }, error => {
      //console.log(error);
    });
  }

  get400BadRequestValidation(){
    this.httpClient.post(this.baseUrl + "account/register", {}).subscribe(res => {
      //console.log(res);
    }, error => {
      this.validationErrors = error;
    });
  }
}
