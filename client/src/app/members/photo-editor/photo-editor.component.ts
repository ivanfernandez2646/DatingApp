import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Photo } from 'src/app/_models/Photo';
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
        const photoResult: Photo = JSON.parse(res);
        this.member.photos.push(photoResult);

        if (photoResult.isMain){
          this.user.photoUrl = photoResult.url;
          this.accountService.setCurrentUser(this.user);
          this.member.photoUrl = photoResult.url;
        }
      }
    }
  }

  fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photoId: number){
    this.memberService.setMainPhoto(photoId).subscribe((photoResult: Photo) => {
      this.user.photoUrl = photoResult.url;
      this.accountService.setCurrentUser(this.user);
      this.member.photoUrl = photoResult.url;
      this.member.photos.find(p => p.isMain).isMain = false;
      this.member.photos.find(p => p.id == photoId).isMain = true;
      this.toastr.success("Main photo has been changed successfully");
    });
  }

  deletePhoto(photoId: number){
    this.memberService.deletePhoto(photoId).subscribe(() => {
        const photo = this.member.photos.findIndex(p => p.id == photoId);
        this.member.photos.splice(photo, 1);
        this.toastr.success("Photo has been removed successfully");
    })
  }
}
