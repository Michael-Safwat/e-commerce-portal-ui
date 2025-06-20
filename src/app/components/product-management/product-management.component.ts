import {Component, OnInit} from '@angular/core';
import {Product} from "../../models/Product";
import {ProductService} from "../../services/product.service";
import {Page} from "../../models/Page";
import {Router} from "@angular/router";

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit{

  products: Product[] = [];
  currentPage: number = 0; // Backend typically uses 0-indexed pages
  pageSize: number = 10;   // Number of items per page
  totalProducts: number = 0;
  totalPages: number = 0;
  isLoading: boolean = false; // To show a loading indicator

  // Optional: Sorting parameters
  sortBy: string = 'name'; // Default sort by product name
  sortOrder: 'asc' | 'desc' = 'asc'; // Default sort order

  // Options for items per page (dropdown)
  pageSizeOptions: number[] = [5, 10, 20, 50];

  // Modal and form state
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  modalTitle: string = '';
  formProduct: Partial<Product> = {};
  selectedImageFile: File | null = null;

  // Toast state
  toasts: { header: string, message: string, type: 'success' | 'error', delay?: number }[] = [];

  pendingDeleteId: string | null = null;

  private toastTimeout: any = null;

  constructor(
    private productService: ProductService,
    private router: Router // Inject Router for navigation
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;

    this.productService.getAllProducts(this.currentPage, this.pageSize, this.sortBy, this.sortOrder)
      .subscribe({
        next: (response: Page<Product>) => {
          this.products = response.content;
          this.totalProducts = response.totalElements;
          this.totalPages = response.totalPages;
          this.currentPage = response.number; // Ensure currentPage is synced with backend's 0-indexed page number
          this.isLoading = false;
          console.log('Products loaded:', this.products);
          console.log('Pagination Info:', response);
        },
        error: () => {
          this.isLoading = false;
          this.showToast('Error', 'Failed to load products. Please try again later.', 'error');
        }
      });
  }

  // Pagination methods
  goToPage(pageNumber: number): void {
    if (pageNumber >= 0 && pageNumber < this.totalPages && pageNumber !== this.currentPage) {
      this.currentPage = pageNumber;
      this.loadProducts();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  // Handle page size change
  onPageSizeChange(event: Event): void {
    const newSize = +(event.target as HTMLSelectElement).value;
    if (newSize !== this.pageSize) {
      this.pageSize = newSize;
      this.currentPage = 0; // Reset to first page when page size changes
      this.loadProducts();
    }
  }

  // Handle sorting column click
  onSort(column: string): void {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'; // Toggle sort order
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc'; // Default to ascending for new sort column
    }
    this.loadProducts(); // Reload products with new sort order
  }

  // Router navigation for actions (e.g., edit)
  editProduct(productId: string): void {
    const product = this.products.find(p => p.id == productId);
    if (product) {
      this.openEditModal(product);
    }
  }

  // Open modal for creating a new product
  openCreateModal(): void {
    this.isEditMode = false;
    this.modalTitle = 'Add New Product';
    this.formProduct = {};
    this.selectedImageFile = null;
    this.isModalOpen = true;
  }

  // Open modal for editing an existing product
  openEditModal(product: Product): void {
    this.isEditMode = true;
    this.modalTitle = 'Edit Product';
    this.formProduct = { ...product };
    this.selectedImageFile = null;
    this.isModalOpen = true;
  }

  // Close the modal
  closeModal(): void {
    this.isModalOpen = false;
    this.formProduct = {};
    this.selectedImageFile = null;
  }

  // Handle file input change
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImageFile = input.files[0];
    }
  }

  // Handle form submission for create or edit
  submitProductForm(): void {
    if (this.isEditMode && this.formProduct.id) {
      // Update product (no image upload for update)
      this.productService.updateProduct(Number(this.formProduct.id), this.formProduct as Product).subscribe({
        next: () => {
          this.closeModal();
          this.loadProducts();
          this.showToast('Success', 'Product updated successfully!', 'success');
        },
        error: () => {
          this.showToast('Error', 'Failed to update product.', 'error');
        }
      });
    } else {
      // Create product (with image upload)
      const formData = new FormData();
      const productDTO = { ...this.formProduct };
      delete productDTO.id; // ID should not be sent for create
      formData.append('product', new Blob([JSON.stringify(productDTO)], { type: 'application/json' }));
      if (this.selectedImageFile) {
        formData.append('image', this.selectedImageFile);
      }
      this.productService.createProduct(formData).subscribe({
        next: () => {
          this.closeModal();
          this.loadProducts();
          this.showToast('Success', 'Product created successfully!', 'success');
        },
        error: () => {
          this.showToast('Error', 'Failed to create product.', 'error');
        }
      });
    }
  }

  // Enhanced delete logic with toast confirmation
  deleteProduct(productId: string): void {
    this.pendingDeleteId = productId;
    this.showToast('Confirm', 'Are you sure you want to delete this product?', 'error', 5000);
  }

  confirmDelete(): void {
    if (this.pendingDeleteId) {
      // Remove confirm toast immediately
      this.toasts = [];
      this.productService.deleteProduct(Number(this.pendingDeleteId)).subscribe({
        next: () => {
          this.loadProducts();
          this.showToast('Success', 'Product deleted successfully!', 'success');
          this.pendingDeleteId = null;
        },
        error: () => {
          this.showToast('Error', 'Failed to delete product.', 'error');
          this.pendingDeleteId = null;
        }
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

  // Helper to generate page numbers for the pagination control
  get pageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  showToast(header: string, message: string, type: 'success' | 'error', delay: number = 3000) {
    // Always clear any existing toast and timeout
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
}
