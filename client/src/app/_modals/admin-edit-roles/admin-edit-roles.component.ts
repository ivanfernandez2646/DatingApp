import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-admin-edit-roles',
  templateUrl: './admin-edit-roles.component.html',
  styleUrls: ['./admin-edit-roles.component.css']
})
export class AdminEditRolesComponent implements OnInit {
  userRole: Partial<User>;
  @Output() closeModalUserRole = new EventEmitter<Partial<User>>();

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  onChangeRole(role: string){
    if(this.userRole.role?.find(r => r == role) == null){
      this.userRole.role.push(role);
    }else{
      this.userRole.role = this.userRole.role.filter(r => r !== role);
    }
  }

  onCloseModal(){
    this.closeModalUserRole.emit(this.userRole);
    this.bsModalRef.hide();
  }
}
