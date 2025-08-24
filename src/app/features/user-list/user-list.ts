import { Component, DestroyRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Product } from '../../shared/interfaces/product.interface';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { UsersList } from '../../core/services/users-list';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RippleModule } from 'primeng/ripple';
import { EditorModule } from 'primeng/editor';
import { User } from '../../shared/interfaces/user.interface';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { ToolbarModule } from 'primeng/toolbar'; 
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [ToastModule, TableModule, FormsModule, InputTextModule, TagModule, CommonModule, ButtonModule,ToolbarModule,
            IconFieldModule,InputIconModule, RippleModule, EditorModule, PaginatorModule, SelectModule, FileUploadModule,
            DynamicDialogModule, DialogModule, ConfirmDialogModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
  providers: [MessageService] 
})
export class UserList implements OnInit{
  @ViewChild('dt') dt!: Table;
  @ViewChild('userForm') userForm!: NgForm;

  loading = signal<boolean>(true);
  userDialog = signal<boolean>(false);
  submitted = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  user: Partial<User> = {};
  searchValue: string = '';
  users = signal<User[]>([]);
  clonedUsers: { [s: number]: User } = {};


  messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  userList = inject(UsersList);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  ngOnInit() {
    this.loadUsers()
  }
  loadUsers() {
    this.loading.set(true);
    const page1$ = this.userList.getuserList(1);
    const page2$ = this.userList.getuserList(2);
    forkJoin([page1$, page2$]).subscribe((([responsePage1, responsePage2]) => {
      const allUsers = [...responsePage1.data, ...responsePage2.data];
      this.users.set(allUsers);         
      this.loading.set(false);
    }));
  }

onRowEditSave(user: User, index: number) {
 this.userList.updateUser(user).pipe(
    takeUntilDestroyed(this.destroyRef) // <-- ADD THIS LINE
  ).subscribe({
    next: () => {
      this.users.update(currentUsers => {
        delete this.clonedUsers[user.id];
        const index = currentUsers.findIndex(u => u.id === this.user.id);
        const newUsers = [...currentUsers];
        newUsers[index] = this.user as User;
          return newUsers;
        });
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Updated' });
        this.hideDialog();
      },
    error: () => {
      this.onRowEditCancel(user, index); 
    }
  })
  
}
saveUser(){
  if (this.userForm?.invalid) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields' });
    return; 
  }
  this.isSaving.set(true); 
this.userList.createUser(this.user).pipe(
      takeUntilDestroyed(this.destroyRef) 
    ).subscribe({
      next: (newUserFromApi) => {
        console.log('User created successfully:', newUserFromApi);
        this.users.update(currentUsers => [newUserFromApi, ...currentUsers]);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Created' });
          this.hideDialog(); 
        },
        error: () => {
          this.isSaving.set(false);
         }
      })
}

onImageUpload(event: any, targetUser?: User) {
  const file = event.files?.[0];
  const userToUpdate = targetUser || this.user;
  if (!userToUpdate) {
    console.error('handleImageUpload was called, but no target user could be determined.');
    this.messageService.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Could not identify user to update.' 
    });
    return;
  }
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
      userToUpdate.avatar = e.target.result as string;
      this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Image ready to be saved.' });
      }
    };
    reader.readAsDataURL(file);
  }
}
hideDialog() {
  this.isSaving.set(false);
  this.userDialog.set(false);
  this.submitted.set(false);
  this.userForm?.reset();
  this.user = {};
}
clear(table: Table) {
  table.clear();
  this.searchValue = '';
}
concateName(user:User){
  return user.first_name + user.last_name;
}

viewUser(user:User){
    this.router.navigate([user.id], { relativeTo: this.route,  state: { user: user } });
}
openNew(){
  this.user = {};
  this.submitted.set(false);
  this.userDialog.set(true);
}
onRowEditCancel(user: User, index: number) {
  const originalUser = this.clonedUsers[user.id];
  if (originalUser) {
    this.users.update(currentUsers => {
        const updatedUsers = [...currentUsers];
        updatedUsers[index] = originalUser;
        return updatedUsers;
    });
    delete this.clonedUsers[user.id];
  }
 }
 onRowEditInit(user: User) {
  this.clonedUsers[user.id] = { ...user };
}

}
