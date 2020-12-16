import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  @HostListener('window:beforeunload', ['$event'])
    onWindowClose($event){
      $event.returnValue = false;
    }
  member: Member;

  constructor(private memberService: MemberService, private route: ActivatedRoute, 
    private toastr: ToastrService) { }

  ngOnInit(): void {
    let username = this.route.snapshot.paramMap.get("username");
    this.memberService.getMember(username).subscribe(res => this.member = res);
  }

  submitEditForm(){
    this.memberService.updateMember(this.member).subscribe(() => {
      this.editForm.reset(this.member);
      this.toastr.success("Profile updated successfully");
    });
  }
}
