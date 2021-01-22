import { Component, OnInit } from '@angular/core';
import { LikeParams } from '../_models/like-params';
import { Member } from '../_models/member';
import { PaginationHeader } from '../_models/pagination';
import { MemberService } from '../_services/member.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  likeMembers: Partial<Member[]>;
  likeParams: LikeParams;
  paginationHeader: PaginationHeader;

  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
    this.likeParams = new LikeParams();
    this.getUserLikes();
  }

  getUserLikes(){
    this.memberService.getUserLikes(this.likeParams).subscribe(res => {
      this.likeMembers = res.body;
      this.likeParams.pageNumber = res.pagination.pageNumber;
      this.likeParams.pageSize = res.pagination.pageSize;
      this.paginationHeader = res.pagination;
    }, error => {
      console.log(error);
    })
  }

  pageChanged(event: any){
    this.likeParams.pageNumber = event.page;
    this.getUserLikes();
  }
}
