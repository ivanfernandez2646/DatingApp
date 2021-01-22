import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { MessageParams } from '../_models/message-params';
import { PaginationHeader } from '../_models/pagination';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  paginationHeader: PaginationHeader;
  messageParams: MessageParams;

  constructor(private messageService: MessageService) {
    this.messageParams = new MessageParams();
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(){
    this.messageService.getMessages(this.messageParams).subscribe(res => {
      this.messages = res.body;
      this.messageParams.pageNumber = res.pagination.pageNumber;
      this.messageParams.pageSize = res.pagination.pageSize;
      this.paginationHeader = res.pagination;
    });
  }

  pageChanged(event: any){
    this.messageParams.pageNumber = event.page;
    this.loadMessages();
  }
  
  deleteMessage(event: any, messageId: number){
    event.stopPropagation();
    this.messageParams.messageId = messageId.toString();
    this.messageService.deleteMessage(this.messageParams).subscribe((res) => {
      this.messages = res.body;
      this.messageParams.pageNumber = res.pagination.pageNumber;
      this.messageParams.pageSize = res.pagination.pageSize;
      this.paginationHeader = res.pagination;
    });
  }
}
