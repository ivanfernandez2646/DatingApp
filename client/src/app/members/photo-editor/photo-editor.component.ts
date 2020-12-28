import { Component, Input, OnInit } from '@angular/core';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member;

  uploader: FileUploader;
  hasBaseDropZoneOver: boolean = false;
  user: User;

  constructor(private accountService: AccountService, private memberService: MemberService,
    private toastr: ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(res => this.user = res);
    this.initializeUploader();    
  }

  ngOnInit(): void {
  }

  initializeUploader(){
    this.uploader = new FileUploader({
      url: environment.apiRoute + "users/add-photo",
      authToken: "Bearer " + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10*1024*1024,
      itemAlias: 'Img',
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (file, res, status, headers) => {
      if(res){
        const memberResult = JSON.parse(res);
        this.member = memberResult;
      }
    }
  }

  fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photoId: number){
    this.memberService.setMainPhoto(photoId).subscribe((res: Member) => {
      this.user.photoUrl = res.photoUrl;
      this.accountService.setCurrentUser(this.user);
      this.member = res;
      this.toastr.success("Main photo has been changed successfully");
    });
  }
}
