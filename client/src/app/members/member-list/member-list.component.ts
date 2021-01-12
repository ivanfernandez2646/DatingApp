import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { PaginationHeader } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/user-params';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[];
  paginationHeader: PaginationHeader;
  userParams: UserParams;
  user: User;
  filterForm: FormGroup;

  constructor(private memberService: MemberService,
      private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.userParams = this.memberService.getUserParams();
    this.filterForm = this.fb.group({
      minAge: [this.userParams.minAge, 
                [Validators.required
                ,Validators.min(this.userParams.minAge)]],
      maxAge: [this.userParams.maxAge,
                [Validators.required
                ,Validators.max(this.userParams.maxAge)]],
      gender: [this.userParams.gender, Validators.required]
    });
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe(res => {
      this.members = res.body;
      this.userParams.pageNumber = res.pagination.pageNumber;
      this.userParams.pageSize = res.pagination.pageSize;
      this.paginationHeader = res.pagination;
    }, err => {
      console.log(err);
    })
  }

  pageChanged(event: any): void {
    this.userParams.pageNumber = event.page;
    this.loadMembers();
  }

  submitFilter() {
    this.userParams.minAge = this.filterForm.get("minAge").value;
    this.userParams.maxAge = this.filterForm.get("maxAge").value;
    this.userParams.gender = this.filterForm.get("gender").value;
    this.loadMembers();
  }

  resetFilter() {
    this.memberService.resetUserParams();
    this.userParams = this.memberService.getUserParams();
    this.filterForm.reset(this.userParams);
    this.loadMembers();
  }
}