import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  CustomerShowcaseItem,
  OrderCustomerInfo,
  CardGalleryPhoto,
  CardPricingMatrix,
  SocialNetworkId,
  OrderRecord
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMER_SHOWCASE,
  INITIAL_CARD_PHOTOS,
  INITIAL_CARD_PRICING
} from '../data/initialProducts';

interface CatalogContextType {
  products: Product[];
  updateProduct: (updated: Product) => void;
  resetProductsToDefault: () => void;
  addNewProduct: (newProduct: Product) => void;
  deleteProduct: (id: string) => void;

  // NFC Card Gallery Photos
  cardPhotos: CardGalleryPhoto[];
  addCardPhoto: (photo: Omit<CardGalleryPhoto, 'id'>) => void;
  removeCardPhoto: (id: string) => void;
  updateCardPhoto: (updated: CardGalleryPhoto) => void;
  selectedPhotoForZoom: CardGalleryPhoto | null;
  setSelectedPhotoForZoom: (photo: CardGalleryPhoto | null) => void;

  // NFC Card Pricing Matrix
  cardPricing: CardPricingMatrix;
  updateCardPricing: (pricing: CardPricingMatrix) => void;

  // Custom NFC Card Configurator Modal
  isCardConfiguratorOpen: boolean;
  configuratorPreselect?: SocialNetworkId;
  openCardConfigurator: (preselect?: SocialNetworkId) => void;
  closeCardConfigurator: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotalDA: number;
  cartTotalCount: number;

  // Product Sheet Modal
  selectedProduct: Product | null;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;

  // Customer Reviews
  showcaseItems: CustomerShowcaseItem[];
  addShowcaseItem: (item: Omit<CustomerShowcaseItem, 'id'>) => void;
  removeShowcaseItem: (id: string) => void;
  lightboxItem: CustomerShowcaseItem | null;
  setLightboxItem: (item: CustomerShowcaseItem | null) => void;

  // Admin & Orders
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  orderHistory: OrderRecord[];
  recordOrder: (order: OrderRecord) => void;
  updateOrderStatus: (id: string, status: OrderRecord['status']) => void;

  // WhatsApp
  generateWhatsAppUrl: (items: CartItem[], customerInfo?: OrderCustomerInfo) => string;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

const STORAGE_KEY_PRODUCTS = 'tapelix_catalog_products_v2';
const STORAGE_KEY_CART = 'tapelix_cart_v2';
const STORAGE_KEY_SHOWCASE = 'tapelix_showcase_v2';
const STORAGE_KEY_CARD_PHOTOS = 'tapelix_card_photos_v2';
const STORAGE_KEY_CARD_PRICING = 'tapelix_card_pricing_v2';
const STORAGE_KEY_ORDERS = 'tapelix_orders_v2';

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PRODUCTS;
  });

  const [cardPhotos, setCardPhotos] = useState<CardGalleryPhoto[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CARD_PHOTOS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CARD_PHOTOS;
  });

  const [cardPricing, setCardPricing] = useState<CardPricingMatrix>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CARD_PRICING);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CARD_PRICING;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [showcaseItems, setShowcaseItems] = useState<CustomerShowcaseItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SHOWCASE);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CUSTOMER_SHOWCASE;
  });

  const [orderHistory, setOrderHistory] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<CustomerShowcaseItem | null>(null);
  const [selectedPhotoForZoom, setSelectedPhotoForZoom] = useState<CardGalleryPhoto | null>(null);

  const [isCardConfiguratorOpen, setIsCardConfiguratorOpen] = useState(false);
  const [configuratorPreselect, setConfiguratorPreselect] = useState<SocialNetworkId | undefined>(undefined);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CARD_PHOTOS, JSON.stringify(cardPhotos));
  }, [cardPhotos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CARD_PRICING, JSON.stringify(cardPricing));
  }, [cardPricing]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SHOWCASE, JSON.stringify(showcaseItems));
  }, [showcaseItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orderHistory));
  }, [orderHistory]);

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedProduct?.id === updated.id) {
      setSelectedProduct(updated);
    }
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const resetProductsToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    setCardPhotos(INITIAL_CARD_PHOTOS);
    setCardPricing(INITIAL_CARD_PRICING);
    localStorage.removeItem(STORAGE_KEY_PRODUCTS);
    localStorage.removeItem(STORAGE_KEY_CARD_PHOTOS);
    localStorage.removeItem(STORAGE_KEY_CARD_PRICING);
  };

  const addNewProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const addCardPhoto = (photo: Omit<CardGalleryPhoto, 'id'>) => {
    const newP: CardGalleryPhoto = {
      ...photo,
      id: `card-photo-${Date.now()}`
    };
    setCardPhotos((prev) => [newP, ...prev]);
  };

  const removeCardPhoto = (id: string) => {
    setCardPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const updateCardPhoto = (updated: CardGalleryPhoto) => {
    setCardPhotos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const updateCardPricing = (pricing: CardPricingMatrix) => {
    setCardPricing(pricing);
  };

  const openCardConfigurator = (preselect?: SocialNetworkId) => {
    setConfiguratorPreselect(preselect);
    setIsCardConfiguratorOpen(true);
  };

  const closeCardConfigurator = () => {
    setIsCardConfiguratorOpen(false);
    setConfiguratorPreselect(undefined);
  };

  const addToCart = (item: CartItem) => {
    const itemKey = `${item.productId}-${Object.entries(item.selectedOptions).sort().join('_')}-${item.selectedNetworks ? item.selectedNetworks.sort().join('_') : ''}`;

    const existingIndex = cart.findIndex((c) => {
      const cKey = `${c.productId}-${Object.entries(c.selectedOptions).sort().join('_')}-${c.selectedNetworks ? c.selectedNetworks.sort().join('_') : ''}`;
      return cKey === itemKey;
    });

    if (existingIndex > -1) {
      setCart((prev) =>
        prev.map((c, i) =>
          i === existingIndex ? { ...c, quantity: c.quantity + item.quantity } : c
        )
      );
    } else {
      setCart((prev) => [...prev, item]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const clearCart = () => setCart([]);

  const cartTotalDA = cart.reduce((acc, item) => acc + item.priceDA * item.quantity, 0);
  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const openProductModal = (product: Product) => {
    const current = products.find((p) => p.id === product.id) || product;
    setSelectedProduct(current);
  };

  const closeProductModal = () => setSelectedProduct(null);

  const addShowcaseItem = (item: Omit<CustomerShowcaseItem, 'id'>) => {
    setShowcaseItems((prev) => [{ ...item, id: `showcase-${Date.now()}` }, ...prev]);
  };

  const removeShowcaseItem = (id: string) => {
    setShowcaseItems((prev) => prev.filter((item) => item.id !== id));
  };

  const recordOrder = (order: OrderRecord) => {
    setOrderHistory((prev) => [order, ...prev]);
  };

  const updateOrderStatus = (id: string, status: OrderRecord['status']) => {
    setOrderHistory((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const generateWhatsAppUrl = (items: CartItem[], customerInfo?: OrderCustomerInfo) => {
    const phone = '213782308820';
    const total = items.reduce((acc, item) => acc + item.priceDA * item.quantity, 0);

    let message = `Bonjour TAPELIX 👋\nJe souhaite passer commande sur tapelix.dz :\n\n`;

    items.forEach((item, index) => {
      message += `*${index + 1}. ${item.name}* (x${item.quantity})\n`;
      message += `• Prix unitaire : ${item.priceDA.toLocaleString('fr-DZ')} DA\n`;

      if (item.selectedNetworks && item.selectedNetworks.length > 0) {
        message += `• Réseaux configurés : ${item.selectedNetworks.map((n) => n.toUpperCase()).join(' + ')}\n`;
      }

      if (item.targetHandles) {
        Object.entries(item.targetHandles).forEach(([net, handle]) => {
          if (handle) {
            message += `  - ${net} : ${handle}\n`;
          }
        });
      }

      const optionsEntries = Object.entries(item.selectedOptions);
      if (optionsEntries.length > 0) {
        optionsEntries.forEach(([key, val]) => {
          message += `• ${key} : ${val}\n`;
        });
      }

      if (item.customerNote) {
        message += `• Remarque : ${item.customerNote}\n`;
      }
      message += `• Sous-total : ${(item.priceDA * item.quantity).toLocaleString('fr-DZ')} DA\n\n`;
    });

    message += `💰 *TOTAL : ${total.toLocaleString('fr-DZ')} DA*\n\n`;

    if (customerInfo && (customerInfo.fullName || customerInfo.phone || customerInfo.wilaya)) {
      message += `📋 *Coordonnées client :*\n`;
      if (customerInfo.fullName) message += `• Nom : ${customerInfo.fullName}\n`;
      if (customerInfo.phone) message += `• Téléphone : ${customerInfo.phone}\n`;
      if (customerInfo.wilaya) message += `• Wilaya / Adresse : ${customerInfo.wilaya}\n`;
      if (customerInfo.notes) message += `• Note : ${customerInfo.notes}\n`;
      message += `\n`;
    }

    message += `Merci de me confirmer la prise en charge et le délai d’expédition.`;

    // Also record in internal order history
    recordOrder({
      id: `cmd-${Date.now()}`,
      date: new Date().toLocaleDateString('fr-DZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      customerName: customerInfo?.fullName || 'Client Web',
      phone: customerInfo?.phone || '0782308820',
      wilaya: customerInfo?.wilaya || 'Algérie',
      itemsSummary: items.map((it) => `${it.quantity}x ${it.name}`).join(', '),
      totalDA: total,
      status: 'Reçue sur WhatsApp'
    });

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <CatalogContext.Provider
      value={{
        products,
        updateProduct,
        resetProductsToDefault,
        addNewProduct,
        deleteProduct,
        cardPhotos,
        addCardPhoto,
        removeCardPhoto,
        updateCardPhoto,
        selectedPhotoForZoom,
        setSelectedPhotoForZoom,
        cardPricing,
        updateCardPricing,
        isCardConfiguratorOpen,
        configuratorPreselect,
        openCardConfigurator,
        closeCardConfigurator,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotalDA,
        cartTotalCount,
        selectedProduct,
        openProductModal,
        closeProductModal,
        showcaseItems,
        addShowcaseItem,
        removeShowcaseItem,
        lightboxItem,
        setLightboxItem,
        isAdminOpen,
        setIsAdminOpen,
        orderHistory,
        recordOrder,
        updateOrderStatus,
        generateWhatsAppUrl
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog must be used within a CatalogProvider');
  return context;
};
