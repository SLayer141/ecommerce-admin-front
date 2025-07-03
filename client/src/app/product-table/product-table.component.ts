import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
    this.http.get<Product[]>('http://localhost:3000/api/products')
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
    this.http.delete(`http://localhost:3000/api/products/${id}`)
      .subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
          console.log('Product deleted:', id);
        },
        error: (err) => console.error('Failed to delete product:', err)
      });
  }
}
