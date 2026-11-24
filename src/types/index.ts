export type ProductCategory =
  | 'nfc-cards'
  | 'nfc-keychains'
  | 'nfc-table-stands'
  | 'digital-menu'
  | 'digital-cards'
  | 'creative-design';

export type SocialNetworkId = 'instagram' | 'tiktok' | 'facebook' | 'whatsapp';

export interface CardGalleryPhoto {
  id: string;
  title: string;
  networkTag: SocialNetworkId | 'custom' | 'multi';
  imageUrl: string;
  description?: string;
  modelType: string;
}

export interface CardPricingMatrix {
  oneNetwork: number;
  twoNetworks: number;
  threeNetworks: number;
  fourNetworks: number;
  customCard: number;
}

export interface ProductOption {
  name: string;
  choices: string[];
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  subtitle: string;
  description: string;
  howItWorks: string;
  priceDA: number;
  image: string;
  badge?: string;
  socialType?: 'instagram' | 'tiktok' | 'facebook' | 'whatsapp' | 'custom' | 'menu' | 'card' | 'design';
  options: ProductOption[];
  features?: string[];
  isService?: boolean;
  inStock?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  category: ProductCategory;
  priceDA: number;
  image: string;
  quantity: number;
  selectedOptions: Record<string, string>;
  selectedNetworks?: SocialNetworkId[];
  targetHandles?: Partial<Record<SocialNetworkId, string>>;
  customerNote?: string;
}

export interface CustomerShowcaseItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  clientType: string;
  dateAdded: string;
}

export interface OrderCustomerInfo {
  fullName: string;
  phone: string;
  wilaya: string;
  notes?: string;
}

export interface OrderRecord {
  id: string;
  date: string;
  customerName: string;
  phone: string;
  wilaya: string;
  itemsSummary: string;
  totalDA: number;
  status: 'Reçue sur WhatsApp' | 'En préparation' | 'Expédiée' | 'Livrée';
}
