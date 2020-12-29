import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
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
      if(this.editForm.dirty){
        $event.returnValue = false;
      }
    }
  member: Member;
  user: User;

  constructor(private memberService: MemberService, private route: ActivatedRoute, 
    private toastr: ToastrService, public accountService: AccountService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(res => this.user = res);
    }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    this.memberService.getMember(this.user.userName).subscribe(res => this.member = res);
  }

  submitEditForm(){
    this.memberService.updateMember(this.member).subscribe(() => {
      this.editForm.reset(this.member);
      this.toastr.success("Profile updated successfully");
    });
  }
}
