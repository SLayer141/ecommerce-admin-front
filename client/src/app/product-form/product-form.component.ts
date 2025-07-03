import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

interface Product {
  id?: number;
  sku: string;
  name: string;
  price: number;
  images: string[];
}

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
  product: Product = {
    sku: '',
    name: '',
    price: 0,
    images: []
  };

  imagePreviews: string[] = [];
  selectedFiles: File[] = [];
  validationErrors: string[] = [];
  successMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: string): void {
    this.http.get<Product>(environment.apiUrl + 'api/products/' + id).subscribe(product => {
      this.product = product;
      // Always use correct URLs for existing images
      this.imagePreviews = (product.images || []).map(img => img.startsWith('http') ? img : environment.apiUrl.replace(/\/$/, '') + img);
      this.selectedFiles = [];
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFiles = Array.from(input.files);
      // Keep previews for existing images, add new previews for uploads
      this.imagePreviews = (this.product.images || []).map(img => img.startsWith('http') ? img : environment.apiUrl.replace(/\/$/, '') + img);
      Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  validateForm(): boolean {
    this.validationErrors = [];
    if (!this.product.sku) {
      this.validationErrors.push('SKU is required.');
    } else if (!/^[0-9]+$/.test(this.product.sku)) {
      this.validationErrors.push('SKU must be numeric.');
    }
    if (!this.product.name) {
      this.validationErrors.push('Name is required.');
    }
    if (!this.product.price) {
      this.validationErrors.push('Price is required.');
    }
    if (!this.selectedFiles.length && !(this.product.images && this.product.images.length)) {
      this.validationErrors.push('At least one image is required.');
    }
    return this.validationErrors.length === 0;
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }
    const formData = new FormData();
    formData.append('sku', this.product.sku);
    formData.append('name', this.product.name);
    formData.append('price', this.product.price.toString());
    // Only send existing image paths for images that are not data URLs
    const existingImages = (this.product.images || []).filter(img => typeof img === 'string' && !img.startsWith('data:'));
    formData.append('images', JSON.stringify(existingImages));
    this.selectedFiles.forEach(file => {
      formData.append('images', file);
    });
    if (this.product.id) {
      // Edit mode: PUT
      this.http.put<Product>(environment.apiUrl + 'api/products/' + this.product.id, formData)
        .subscribe({
          next: (response) => {
            this.successMessage = 'Product updated successfully!';
            setTimeout(() => this.successMessage = '', 3000);
            // Reload product to refresh previews
            this.loadProduct(this.product.id!.toString());
            this.selectedFiles = [];
          },
          error: (err) => {
            console.error('Failed to update product:', err);
          }
        });
    } else {
      // Create mode: POST
      this.http.post<Product>(environment.apiUrl + 'api/products', formData)
        .subscribe({
          next: (response) => {
            this.successMessage = 'Product saved successfully!';
            setTimeout(() => this.successMessage = '', 3000);
            this.resetForm();
            this.imagePreviews = [];
            this.selectedFiles = [];
            this.goBack();
          },
          error: (err) => {
            console.error('Failed to save product:', err);
          }
        });
    }
  }

  resetForm(): void {
    this.product = {
      sku: '',
      name: '',
      price: 0,
      images: []
    };
    this.imagePreviews = [];
  }

  goBack(): void {
    this.router.navigate(['/product-table']);
  }

  removeImage(index: number): void {
    // Determine if the image is an existing image or a new upload
    const isExisting = this.product.images && index < this.product.images.length;
    this.imagePreviews.splice(index, 1);
    if (isExisting) {
      this.product.images.splice(index, 1);
    } else {
      // Remove from selectedFiles (new uploads)
      this.selectedFiles.splice(index - (this.product.images ? this.product.images.length : 0), 1);
    }
  }
}