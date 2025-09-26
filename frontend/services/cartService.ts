/**
 * Cart Service - Handles all cart-related operations
 */

export interface CartItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  itemName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  specialInstructions?: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  promoCode?: string;
  discount: number;
}

class CartService {
  private cart: Cart = {
    id: 'cart_' + Date.now(),
    items: [],
    subtotal: 0,
    deliveryFee: 0,
    tax: 0,
    total: 0,
    discount: 0,
  };

  private listeners: ((cart: Cart) => void)[] = [];

  // Subscribe to cart changes
  subscribe(callback: (cart: Cart) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify all listeners of cart changes
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.cart));
  }

  // Add item to cart
  addItem(item: Omit<CartItem, 'quantity'>, quantity: number = 1): boolean {
    try {
      const existingItemIndex = this.cart.items.findIndex(
        cartItem => cartItem.id === item.id
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        this.cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        this.cart.items.push({ ...item, quantity });
      }

      this.calculateTotals();
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return false;
    }
  }

  // Remove item from cart
  removeItem(itemId: string): boolean {
    try {
      this.cart.items = this.cart.items.filter(item => item.id !== itemId);
      this.calculateTotals();
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      return false;
    }
  }

  // Update item quantity
  updateItemQuantity(itemId: string, quantity: number): boolean {
    try {
      if (quantity <= 0) {
        return this.removeItem(itemId);
      }

      const itemIndex = this.cart.items.findIndex(item => item.id === itemId);
      if (itemIndex >= 0) {
        this.cart.items[itemIndex].quantity = quantity;
        this.calculateTotals();
        this.notifyListeners();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating item quantity:', error);
      return false;
    }
  }

  // Apply promo code
  applyPromoCode(promoCode: string): { success: boolean; message: string; discount?: number } {
    try {
      const promoCodes = {
        'SAVE10': { discount: 10, minOrder: 20 },
        'NEWUSER': { discount: 15, minOrder: 25 },
        'FREESHIP': { discount: 0, freeShipping: true, minOrder: 30 },
        'WEEKEND20': { discount: 20, minOrder: 40 },
      };

      const promo = promoCodes[promoCode as keyof typeof promoCodes];
      
      if (!promo) {
        return { success: false, message: 'Invalid promo code' };
      }

      if (this.cart.subtotal < promo.minOrder) {
        return { 
          success: false, 
          message: `Minimum order of $${promo.minOrder} required` 
        };
      }

      this.cart.promoCode = promoCode;
      
      if ('freeShipping' in promo && promo.freeShipping) {
        this.cart.deliveryFee = 0;
      }
      
      this.cart.discount = (this.cart.subtotal * promo.discount) / 100;
      this.calculateTotals();
      this.notifyListeners();

      return { 
        success: true, 
        message: `${promo.discount}% discount applied!`,
        discount: promo.discount
      };
    } catch (error) {
      console.error('Error applying promo code:', error);
      return { success: false, message: 'Error applying promo code' };
    }
  }

  // Remove promo code
  removePromoCode(): void {
    this.cart.promoCode = undefined;
    this.cart.discount = 0;
    this.calculateTotals();
    this.notifyListeners();
  }

  // Calculate cart totals
  private calculateTotals(): void {
    this.cart.subtotal = this.cart.items.reduce(
      (total, item) => total + (item.price * item.quantity), 
      0
    );
    
    // Calculate delivery fee based on subtotal
    if (this.cart.subtotal === 0) {
      this.cart.deliveryFee = 0;
    } else if (this.cart.subtotal >= 30) {
      this.cart.deliveryFee = 0; // Free delivery over $30
    } else {
      this.cart.deliveryFee = 2.99;
    }

    // Calculate tax (8.5%)
    this.cart.tax = (this.cart.subtotal - this.cart.discount) * 0.085;
    
    // Calculate total
    this.cart.total = this.cart.subtotal - this.cart.discount + this.cart.deliveryFee + this.cart.tax;
  }

  // Get cart data
  getCart(): Cart {
    return { ...this.cart };
  }

  // Get cart item count
  getItemCount(): number {
    return this.cart.items.reduce((count, item) => count + item.quantity, 0);
  }

  // Clear cart
  clearCart(): void {
    this.cart = {
      id: 'cart_' + Date.now(),
      items: [],
      subtotal: 0,
      deliveryFee: 0,
      tax: 0,
      total: 0,
      discount: 0,
    };
    this.notifyListeners();
  }

  // Check if cart is empty
  isEmpty(): boolean {
    return this.cart.items.length === 0;
  }

  // Reorder from previous order
  reorderItems(orderItems: CartItem[]): boolean {
    try {
      this.clearCart();
      orderItems.forEach(item => {
        this.addItem(item, item.quantity);
      });
      return true;
    } catch (error) {
      console.error('Error reordering items:', error);
      return false;
    }
  }
}

// Export singleton instance
export const cartService = new CartService();