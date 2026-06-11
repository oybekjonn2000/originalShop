export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  subcategories?: SubCategory[];
}

export interface SubCategory {
  id: number;
  name: string;
  description?: string;
  category?: Category;
  childCategories?: ChildCategory[];
}

export interface ChildCategory {
  id: number;
  name: string;
  description?: string;
  subcategory?: SubCategory;
  products?: Product[];
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  fullDescription?: string;
  price: number;
  imageUrl?: string;
  imageUrls?: string[];
  stockQuantity: number;
  childCategory?: ChildCategory;
  brand?: any;
  isActive?: boolean;
  discount?: number;
  activeImageIndex?: number;
}
