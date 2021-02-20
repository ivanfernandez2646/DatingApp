import { formatCurrency } from '@angular/common';
import { OnDestroy, ViewChildren } from '@angular/core';
import { QueryList } from '@angular/core';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { ToastrService } from 'ngx-toastr';
import { CreateMessage } from 'src/app/_models/create-message';
import { Message } from 'src/app/_models/message';
import { MessageHubService } from 'src/app/_services/message-hub.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollBar', {static: true}) scrollBar: ElementRef;
  @ViewChild('inputMessage', {static: true}) inputMessage: ElementRef;
  @ViewChildren('messageContainers') messageContainers: QueryList<ElementRef>;
  @ViewChild('sendMessageForm') sendMessageForm: NgForm;
  @Input() recipientUsername: string;

  createMessage: CreateMessage;
  messages: Message[];
  currentMessagesLengthContainer: number = undefined;
  isSendingMessage: boolean;

  constructor(public messageHubService: MessageHubService) {
    this.createMessage = new CreateMessage();
  }

  ngOnInit(): void {
    this.createMessage.recipientUsername = this.recipientUsername;
    this.messageHubService.onCreateHubConnection(this.recipientUsername);
    this.messageHubService.message$.subscribe(res => {
      this.messages = res;
      this.createMessage.content = "";
    });
  }

  ngAfterViewInit(): void {
    this.messageContainers.changes.subscribe((list: QueryList<ElementRef>) => {
      if(this.currentMessagesLengthContainer == undefined){
        this.currentMessagesLengthContainer = list.length;
        this.scrollDownMessages();
      }else{
        if(this.currentMessagesLengthContainer < list.length){
          this.scrollDownMessages();
          this.currentMessagesLengthContainer = list.length;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.messageHubService.onStopHubConnection();
  }

  sendMessage(){
    // this.messageService.sendMessage(this.createMessage).subscribe(res => {
    //   this.messages.push(res);
    //   this.sendMessageForm.reset();
    // }, error => {
    //   this.toastr.error(error);
    // })
    this.isSendingMessage = true;
    this.messageHubService.hubConnection.invoke("OnSendMessage", 
      this.createMessage.content).finally(() => this.isSendingMessage = false);
  }

  scrollDownMessages(){
    this.scrollBar.nativeElement.scrollTo(0, this.scrollBar.nativeElement.scrollHeight);
  }
}
