import { formatCurrency } from '@angular/common';
import { ViewChildren } from '@angular/core';
import { QueryList } from '@angular/core';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CreateMessage } from 'src/app/_models/create-message';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollBar', {static: true}) scrollBar: ElementRef;
  @ViewChildren('messageContainers') messageContainers: QueryList<ElementRef>;
  @ViewChild('sendMessageForm') sendMessageForm: NgForm;
  @Input() messages: Message[];
  @Input() recipientUsername: string;

  createMessage: CreateMessage;

  constructor(private messageService: MessageService, private toastr: ToastrService) {
    this.createMessage = new CreateMessage();
  }

  ngOnInit(): void {
    this.createMessage.recipientUsername = this.recipientUsername;
  }

  ngAfterViewInit(): void {
    this.messageContainers.changes.subscribe((list: QueryList<ElementRef>) => {
      this.scrollDownMessages();
    });
  }

  sendMessage(){
    this.messageService.sendMessage(this.createMessage).subscribe(res => {
      this.messages.push(res);
      this.sendMessageForm.reset();
    }, error => {
      this.toastr.error(error);
    })
  }

  scrollDownMessages(){
    this.scrollBar.nativeElement.scrollTo(0, this.scrollBar.nativeElement.scrollHeight);
  }
}
