import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock cart data
const cartItems = [
  {
    id: '1',
    name: 'Margherita Pizza',
    restaurant: 'Tony\'s Pizza Palace',
    price: 18.99,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&w=300',
    customizations: ['Extra Cheese', 'Thin Crust'],
  },
  {
    id: '2',
    name: 'Caesar Salad',
    restaurant: 'Tony\'s Pizza Palace',
    price: 12.99,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&w=300',
    customizations: ['No Croutons'],
  },
];

const promoOffers = [
  {
    id: '1',
    title: '20% OFF',
    description: 'On orders above $50',
    code: 'SAVE20',
    discount: 0.2,
    minOrder: 50,
  },
  {
    id: '2',
    title: 'Free Delivery',
    description: 'On your first order',
    code: 'FREEDEL',
    deliveryDiscount: true,
  },
];

export default function CartScreen() {
  const router = useRouter();
  const [cartData, setCartData] = useState(cartItems);
  const [appliedPromo, setAppliedPromo] = useState<any>(null);

  const updateQuantity = (id: string, change: number) => {
    setCartData(prev => 
      prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean) as any[]
    );
  };

  const removeItem = (id: string) => {
    setCartData(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 2.99;
  const tax = subtotal * 0.08; // 8% tax
  const promoDiscount = appliedPromo?.discount ? subtotal * appliedPromo.discount : 0;
  const deliveryDiscount = appliedPromo?.deliveryDiscount ? deliveryFee : 0;
  const total = subtotal + deliveryFee + tax - promoDiscount - deliveryDiscount;

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.restaurantName}>{item.restaurant}</Text>
        {item.customizations && item.customizations.length > 0 && (
          <View style={styles.customizations}>
            {item.customizations.map((custom: string, index: number) => (
              <Text key={index} style={styles.customizationText}>• {custom}</Text>
            ))}
          </View>
        )}
        <View style={styles.itemFooter}>
          <Text style={styles.itemPrice}>${item.price}</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.id, -1)}
            >
              <Ionicons name="remove" size={16} color="#FF6B35" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.id, 1)}
            >
              <Ionicons name="add" size={16} color="#FF6B35" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeItem(item.id)}
      >
        <Ionicons name="trash" size={16} color="#FF4444" />
      </TouchableOpacity>
    </View>
  );

  const renderPromoOffer = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.promoCard,
        appliedPromo?.id === item.id && styles.appliedPromo
      ]}
      onPress={() => {
        if (item.minOrder && subtotal < item.minOrder) return;
        setAppliedPromo(appliedPromo?.id === item.id ? null : item);
      }}
    >
      <View style={styles.promoInfo}>
        <Text style={styles.promoTitle}>{item.title}</Text>
        <Text style={styles.promoDescription}>{item.description}</Text>
        <Text style={styles.promoCode}>Code: {item.code}</Text>
      </View>
      <View style={styles.promoAction}>
        {appliedPromo?.id === item.id ? (
          <Ionicons name="checkmark-circle" size={24} color="#32CD32" />
        ) : (
          <Text style={styles.applyText}>
            {item.minOrder && subtotal < item.minOrder ? 
              `Min $${item.minOrder}` : 'Apply'
            }
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (cartData.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.emptyCart}>
          <Ionicons name="bag-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add some delicious food to get started!</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push('/(tabs)/home' as any)}
          >
            <Text style={styles.browseButtonText}>Browse Restaurants</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart ({cartData.length} items)</Text>
        <TouchableOpacity>
          <Ionicons name="trash-outline" size={24} color="#FF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View style={styles.section}>
          <FlatList
            data={cartData}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Add More Items */}
        <TouchableOpacity style={styles.addMoreButton}>
          <Ionicons name="add" size={20} color="#FF6B35" />
          <Text style={styles.addMoreText}>Add more items</Text>
        </TouchableOpacity>

        {/* Promo Offers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Offers</Text>
          <FlatList
            data={promoOffers}
            renderItem={renderPromoOffer}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Bill Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Details</Text>
          <View style={styles.billContainer}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Subtotal</Text>
              <Text style={styles.billValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Fee</Text>
              <Text style={[styles.billValue, deliveryDiscount > 0 && styles.strikethrough]}>
                ${deliveryFee.toFixed(2)}
              </Text>
            </View>
            {deliveryDiscount > 0 && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Delivery Discount</Text>
                <Text style={[styles.billValue, styles.discount]}>-${deliveryDiscount.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Tax & Fees</Text>
              <Text style={styles.billValue}>${tax.toFixed(2)}</Text>
            </View>
            {promoDiscount > 0 && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Promo Discount</Text>
                <Text style={[styles.billValue, styles.discount]}>-${promoDiscount.toFixed(2)}</Text>
              </View>
            )}
            <View style={[styles.billRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Info */}
        <View style={styles.section}>
          <View style={styles.deliveryInfo}>
            <Ionicons name="location" size={20} color="#FF6B35" />
            <View style={styles.deliveryDetails}>
              <Text style={styles.deliveryAddress}>123 Main Street, Apt 4B</Text>
              <Text style={styles.deliveryTime}>Estimated delivery: 25-35 min</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => router.push('/checkout' as any)}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          <Text style={styles.checkoutTotal}>${total.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  customizations: {
    marginBottom: 8,
  },
  customizationText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 12,
  },
  removeButton: {
    padding: 8,
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 12,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B35',
    borderStyle: 'dashed',
  },
  addMoreText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
    marginLeft: 8,
  },
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
  },
  appliedPromo: {
    borderColor: '#32CD32',
    backgroundColor: '#f0fff0',
  },
  promoInfo: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 2,
  },
  promoDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  promoCode: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  promoAction: {
    alignItems: 'center',
  },
  applyText: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  billContainer: {
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  billLabel: {
    fontSize: 14,
    color: '#666',
  },
  billValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  discount: {
    color: '#32CD32',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryDetails: {
    flex: 1,
    marginLeft: 12,
  },
  deliveryAddress: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  deliveryTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  changeText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
  },
  checkoutContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  checkoutButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  checkoutTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});