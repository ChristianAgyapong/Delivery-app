import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/design';

// Mock data for search results
const searchResults = [
  {
    id: '1',
    type: 'restaurant',
    name: 'Tony\'s Pizza Palace',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&w=200',
    rating: 4.5,
    cuisine: 'Italian',
    deliveryTime: '25-35 min',
  },
  {
    id: '2',
    type: 'food',
    name: 'Margherita Pizza',
    restaurant: 'Tony\'s Pizza Palace',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&w=200',
    price: 18.99,
  },
  {
    id: '3',
    type: 'restaurant',
    name: 'Burger Junction',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&w=200',
    rating: 4.2,
    cuisine: 'American',
    deliveryTime: '20-30 min',
  },
  {
    id: '4',
    type: 'food',
    name: 'Chicken Burger',
    restaurant: 'Burger Junction',
    image: 'https://images.unsplash.com/photo-1551615593-ef5fe247e8f7?ixlib=rb-4.0.3&w=200',
    price: 12.99,
  },
];

const popularSearches = [
  'Pizza', 'Burger', 'Sushi', 'Chinese', 'Italian', 'Thai', 'Mexican', 'Indian'
];

const recentSearches = [
  'Pizza nearby', 'Best burgers', 'Sushi delivery'
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchActive, setSearchActive] = useState(false);

  const filteredResults = searchResults.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.type === 'restaurant' && item.cuisine?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.type === 'food' && item.restaurant?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderSearchResult = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.resultItem}>
      <Image source={{ uri: item.image }} style={styles.resultImage} />
      <View style={styles.resultInfo}>
        <Text style={styles.resultName}>{item.name}</Text>
        {item.type === 'restaurant' ? (
          <View>
            <Text style={styles.resultSubtext}>{item.cuisine} • {item.deliveryTime}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.resultSubtext}>{item.restaurant}</Text>
            <Text style={styles.price}>${item.price}</Text>
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  const renderPopularSearch = (item: string) => (
    <TouchableOpacity 
      key={item}
      style={styles.popularItem}
      onPress={() => setSearchQuery(item)}
    >
      <Text style={styles.popularText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderRecentSearch = (item: string) => (
    <TouchableOpacity 
      key={item}
      style={styles.recentItem}
      onPress={() => setSearchQuery(item)}
    >
      <Ionicons name="time" size={16} color="#666" />
      <Text style={styles.recentText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for restaurants or food..."
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setSearchActive(text.length > 0);
            }}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              setSearchActive(false);
            }}>
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Results or Suggestions */}
      {searchActive && searchQuery.length > 0 ? (
        <FlatList
          data={filteredResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id}
          style={styles.resultsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.suggestionsContainer}>
          {/* Popular Searches */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Searches</Text>
            <View style={styles.popularContainer}>
              {popularSearches.map(renderPopularSearch)}
            </View>
          </View>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <View style={styles.recentContainer}>
                {recentSearches.map(renderRecentSearch)}
              </View>
            </View>
          )}

          {/* Quick Filters */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Filters</Text>
            <View style={styles.filtersContainer}>
              <TouchableOpacity style={styles.filterButton}>
                <Ionicons name="star" size={16} color={Colors.primary} />
                <Text style={styles.filterText}>Top Rated</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton}>
                <Ionicons name="time" size={16} color={Colors.primary} />
                <Text style={styles.filterText}>Fast Delivery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton}>
                <Ionicons name="pricetag" size={16} color={Colors.primary} />
                <Text style={styles.filterText}>Offers</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  resultsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  resultSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  price: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  suggestionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  popularContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  popularItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  popularText: {
    fontSize: 14,
    color: '#333',
  },
  recentContainer: {
    gap: 10,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  recentText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 5,
    fontWeight: '500',
  },
});