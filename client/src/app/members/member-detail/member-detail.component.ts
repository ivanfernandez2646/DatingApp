import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { MemberService } from 'src/app/_services/member.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('tabSetDetails', {static: true}) tabSetDetails: TabsetComponent;

  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  tabSetActive: TabDirective;
  messages: Message[];
  firstTime: boolean = true;

  constructor(private route: ActivatedRoute,
    private messageService: MessageService,
    public presenceService: PresenceService,
    private memberService: MemberService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.member = this.route.snapshot.data['member'];
      if(params?.get("tab") === "3")
        this.selectTab(3);
        this.galleryImages = this.getImages();
    })

    this.galleryOptions = [
      {
        width: '500px',
        height: '400px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
      },
    ]
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

  selectTab(tabId: number) {
    this.tabSetDetails.tabs[tabId].active = true;
    if(tabId == 3 && this.firstTime){
      this.loadMessageThread();
      this.firstTime = false;
    }
  }

  onSelect(data: TabDirective): void {
    this.tabSetActive = data;
    if(data.heading == "Messages" && this.firstTime){
      this.loadMessageThread();
      this.firstTime = false;
    }
  }

  loadMessageThread(){
    this.messageService.getMessageThread(this.member.userName).subscribe(res => {
      this.messages = res;
    })
  }

  addLike(username: string){
    this.memberService.addLike(username).subscribe(() => {
      this.toastr.success("Like added successfully");
    })
  }
}
