import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AdminEditRolesComponent } from 'src/app/_modals/admin-edit-roles/admin-edit-roles.component';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-admin-user-management',
  templateUrl: './admin-user-management.component.html',
  styleUrls: ['./admin-user-management.component.css']
})
export class AdminUserManagementComponent implements OnInit {
  userRoles: Partial<User[]>;
  bsModalRef: BsModalRef;

  constructor(private adminService: AdminService,
    private bsModalService: BsModalService) { }

  ngOnInit(): void {
    this.loadUserWithRoles();
  }

  loadUserWithRoles(){
    this.adminService.getUserWithRoles().subscribe(res => {
      this.userRoles = res;
    })
  }

  openModalWithComponent(userRole: Partial<User>) {
    const initialState = {
      userRole: JSON.parse(JSON.stringify(userRole))
    };
    this.bsModalRef = this.bsModalService.show(AdminEditRolesComponent, {initialState});
    this.bsModalRef.content?.closeModalUserRole.subscribe(res => {
      if(JSON.stringify(userRole.role.sort()) !== JSON.stringify(res.role.sort())){
        this.adminService.editRoles(res).subscribe(res => {
          userRole.role = [...res];
        });
      }
    });
  }
}
