import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  images: string[];
}

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css']
})
export class ProductTableComponent implements OnInit {
  products: Product[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.http.get<Product[]>(environment.apiUrl + 'api/products')
      .subscribe({
        next: (data) => this.products = data,
        error: (err) => console.error('Failed to load products:', err)
      });
  }

  addProduct(): void {
    this.router.navigate(['/product-form']);
  }

  editProduct(product: Product): void {
    this.router.navigate(['/product-form', product.id]);
  }

  deleteProduct(id: number): void {
    this.http.delete(environment.apiUrl + 'api/products/' + id)
      .subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
          console.log('Product deleted:', id);
        },
        error: (err) => console.error('Failed to delete product:', err)
      });
  }

  signOut(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
