import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { Page } from '../../models/Page';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css'],
})
export class AdminManagementComponent implements OnInit {
  page: Page<User> | undefined;
  currentPage: number = 0;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  modalTitle: string = '';
  formAdmin: Partial<User> = {
    name: '',
    email: '',
    password: '',
  };
  toasts: {
    header: string;
    message: string;
    type: 'success' | 'error';
    delay?: number;
  }[] = [];
  pendingDeleteId: string | null = null;
  private toastTimeout: any = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getAdmins(this.currentPage, this.pageSize);
  }

  onPageSizeChange(newSize: string): void {
    this.pageSize = +newSize;
    this.currentPage = 0;
    this.getAdmins(this.currentPage, this.pageSize);
  }

  getAdmins(page: number, size: number): void {
    this.userService.getAllAdmins(page, size).subscribe((data) => {
      console.log('Received page data from backend:', data);
      this.page = data;
      this.currentPage = data.number;
    });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.modalTitle = 'Create New Admin';
    this.resetForm();
    this.isModalOpen = true;
  }

  openEditModal(admin: User): void {
    this.isEditMode = true;
    this.modalTitle = 'Edit Admin';
    this.formAdmin = { ...admin };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.resetForm();
  }

  resetForm(): void {
    this.formAdmin = {
      name: '',
      email: '',
      password: '',
    };
  }

  submitAdminForm(isValid: boolean): void {
    if (!isValid) return;

    if (this.isEditMode) {
      // Update Admin
      if (!this.formAdmin.id) return;
      this.userService
        .updateAdmin(this.formAdmin.id, {
          name: this.formAdmin.name || '',
          email: this.formAdmin.email || '',
        })
        .subscribe({
          next: () => {
            this.closeModal();
            this.getAdmins(this.currentPage, this.pageSize);
            this.showToast(
              'Success',
              'Admin updated successfully!',
              'success'
            );
          },
          error: (err) => {
            console.error('Error updating admin:', err);
            this.showToast('Error', 'Failed to update admin.', 'error');
          },
        });
    } else {
      // Create Admin
      this.userService
        .registerAdmin({
          name: this.formAdmin.name || '',
          email: this.formAdmin.email || '',
          password: this.formAdmin.password || '',
        })
        .subscribe({
          next: () => {
            this.closeModal();
            this.getAdmins(this.currentPage, this.pageSize);
            this.showToast(
              'Success',
              'Admin created successfully!',
              'success'
            );
          },
          error: (err) => {
            console.error('Error creating admin:', err);
            this.showToast('Error', 'Failed to create admin.', 'error');
          },
        });
    }
  }

  deleteAdmin(id: string): void {
    this.pendingDeleteId = id;
    this.showToast(
      'Confirm',
      'Are you sure you want to delete this admin?',
      'error',
      5000
    );
  }

  confirmDelete(): void {
    if (this.pendingDeleteId) {
      this.toasts = [];
      this.userService.deleteAdmin(this.pendingDeleteId).subscribe({
        next: () => {
          this.getAdmins(this.currentPage, this.pageSize);
          this.showToast('Success', 'Admin deleted successfully!', 'success');
          this.pendingDeleteId = null;
        },
        error: (err) => {
          console.error('Error deleting admin:', err);
          this.showToast('Error', 'Failed to delete admin.', 'error');
          this.pendingDeleteId = null;
        },
      });
    }
  }

  cancelDelete(): void {
    this.pendingDeleteId = null;
    this.toasts = [];
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
  }

  showToast(
    header: string,
    message: string,
    type: 'success' | 'error',
    delay: number = 3000
  ) {
    this.toasts = [];
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
    this.toasts.push({ header, message, type, delay });
    if (header !== 'Confirm') {
      this.toastTimeout = setTimeout(() => {
        this.toasts.shift();
        this.toastTimeout = null;
      }, delay);
    }
  }

  nextPage(): void {
    if (this.page && !this.page.last) {
      this.currentPage++;
      this.getAdmins(this.currentPage, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.page && !this.page.first) {
      this.currentPage--;
      this.getAdmins(this.currentPage, this.pageSize);
    }
  }

  goToPage(pageNumber: number): void {
    this.getAdmins(pageNumber, this.pageSize);
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'ROLE_SUPER_ADMIN':
        return 'bg-danger';
      case 'ROLE_ADMIN':
        return 'bg-primary';
      case 'ROLE_USER':
        return 'bg-secondary';
      default:
        return 'bg-info';
    }
  }
}
