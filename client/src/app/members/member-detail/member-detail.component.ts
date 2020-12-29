import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/_models/member';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private memberService: MemberService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.galleryOptions = [
      {
        width: '500px',
        height: '400px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
      },
    ]
      
    this.memberService.getMember(this.route.snapshot.paramMap.get("username"))
      .subscribe(member => {
        this.member = member;
        this.galleryImages = this.getImages(); 
      });
  }

  getImages(): NgxGalleryImage[] {
    let images: NgxGalleryImage[] = [];

    for(const img of this.member.photos){
      images.push({
        small: img.url,
        medium: img.url,
        big: img.url,
      })
    }

    return images;
  }
}
