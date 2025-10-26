// Services
export {
  fetchAllProducts,
  fetchProductBySlug,
  fetchProductsByTerm,
  fetchProductById,
  fetchProductsByIds,
  fetchSkusByIds,
} from "./services/product";

// Types
export type { Product, Brand, Category, Characteristics } from "./types/product";
export type { PaginatedProducts } from "./types/paginetad-products";
export type { ProductImage } from "./types/product-image";
export type { ProductSku } from "./types/product-sku";

