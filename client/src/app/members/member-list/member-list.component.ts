import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { PaginationHeader, UserParams } from 'src/app/_models/pagination';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[];
  paginationHeader: PaginationHeader;

  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    console.log(this.paginationHeader)
    this.memberService.getMembers(this.paginationHeader?.pageNumber, this.paginationHeader?.pageSize).subscribe(res => {
      this.members = res.body;
      if(this.paginationHeader === undefined){
        this.paginationHeader = res.pagination;
      }
    }, err => {
      console.log(err);
    })
  }

  pageChanged(event: any): void {
    this.paginationHeader.pageNumber = event.page;
    this.loadMembers();
  }
}