import { useState, useEffect } from 'react';

// ==========================================
// TYPES
// ==========================================
export type ItemCategory = 'frame' | 'theme' | 'booster' | 'special';
export type ItemState = 'equipped' | 'inactive' | 'expired';

export interface InventoryItem {
  id: string;
  frameId?: string;
  name: string;
  category: ItemCategory;
  categoryName: string;
  state: ItemState;
  quantity?: number;
  expiry?: string;
  imageSource?: any;
  artworkColor?: string;
}

export type TransactionType = 'earn' | 'spend';
export type TransactionSource = 'mission' | 'streak' | 'achievement' | 'shop_booster' | 'shop_cosmetic';

export interface Transaction {
  id: string;
  type: TransactionType;
  source: TransactionSource;
  title: string;
  subtitle: string;
  amount: number;
  time: string;
}

export interface EconomyState {
  coins: number;
  inventory: InventoryItem[];
  transactions: Transaction[];
}

// ==========================================
// INITIAL MOCK DATA
// ==========================================
const INITIAL_STATE: EconomyState = {
  coins: 2450,
  inventory: [
    {
      id: 'frame_golden_wordsmith',
      frameId: 'frame_golden_wordsmith',
      name: 'Bậc Thầy Hoàng Kim',
      category: 'frame',
      categoryName: 'Avatar Frame',
      state: 'equipped',
      imageSource: require('../assets/images/frames/frame_golden_wordsmith.png'),
      artworkColor: 'text-yellow-600 bg-yellow-50 border-yellow-200'
    },
    {
      id: 'frame_fire_streak',
      frameId: 'frame_fire_streak',
      name: 'Ngọn Lửa Bất Diệt',
      category: 'frame',
      categoryName: 'Avatar Frame',
      state: 'inactive',
      imageSource: require('../assets/images/frames/frame_fire_streak.png'),
      artworkColor: 'text-orange-600 bg-orange-50 border-orange-200'
    },
    {
      id: 'frame_bronze_learner',
      frameId: 'frame_bronze_learner',
      name: 'Khung Đồng Mở Lối',
      category: 'frame',
      categoryName: 'Avatar Frame',
      state: 'inactive',
      imageSource: require('../assets/images/frames/frame_bronze_learner.png'),
      artworkColor: 'text-amber-700 bg-amber-50 border-amber-200'
    },
    {
      id: 'frame_silver_scholar',
      frameId: 'frame_silver_scholar',
      name: 'Học Giả Bạc',
      category: 'frame',
      categoryName: 'Avatar Frame',
      state: 'inactive',
      imageSource: require('../assets/images/frames/frame_silver_scholar.png'),
      artworkColor: 'text-sky-600 bg-sky-50 border-sky-200'
    },
    {
      id: 'frame_night_owl',
      frameId: 'frame_night_owl',
      name: 'Cú Đêm Chăm Học',
      category: 'frame',
      categoryName: 'Avatar Frame',
      state: 'inactive',
      imageSource: require('../assets/images/frames/frame_night_owl.png'),
      artworkColor: 'text-purple-600 bg-purple-50 border-purple-200'
    },
    {
      id: 'item_xp_booster',
      name: 'Nhân Đôi KN',
      category: 'booster',
      categoryName: 'Booster',
      state: 'inactive',
      quantity: 2,
      imageSource: require('../assets/images/shop/icon1_clean.png'),
      artworkColor: 'text-warning-500 bg-warning-50 border-warning-200'
    },
    {
      id: 'item_streak_freeze',
      name: 'Bảo Hiểm Chuỗi',
      category: 'booster',
      categoryName: 'Booster',
      state: 'inactive',
      quantity: 1,
      imageSource: require('../assets/images/shop/icon5_clean.png'),
      artworkColor: 'text-sky-500 bg-sky-50 border-sky-200'
    }
  ],
  transactions: [
    {
      id: 'tx1',
      type: 'earn',
      source: 'mission',
      title: 'Thưởng nhiệm vụ',
      subtitle: 'Hoàn thành nhiệm vụ ngày',
      amount: 50,
      time: '2 giờ trước'
    },
    {
      id: 'tx2',
      type: 'spend',
      source: 'shop_booster',
      title: 'Thẻ X2 Kinh Nghiệm',
      subtitle: 'Mua từ Cửa hàng',
      amount: 250,
      time: 'Hôm qua'
    },
    {
      id: 'tx3',
      type: 'earn',
      source: 'streak',
      title: 'Thưởng chuỗi 10 ngày',
      subtitle: 'Duy trì học tập',
      amount: 100,
      time: 'Hôm qua'
    },
    {
      id: 'tx4',
      type: 'spend',
      source: 'shop_cosmetic',
      title: 'Mũ ảo thuật gia',
      subtitle: 'Trang bị cho Snapy',
      amount: 500,
      time: '3 ngày trước'
    },
    {
      id: 'tx5',
      type: 'earn',
      source: 'achievement',
      title: 'Huy hiệu "Chăm Chỉ"',
      subtitle: 'Phần thưởng thành tựu',
      amount: 200,
      time: 'Tuần trước'
    }
  ]
};

// ==========================================
// PERSISTENCE HELPER (WEB / LOCALSTORAGE)
// ==========================================
const STORAGE_KEY = 'snapvocab_economy_v3';

function loadPersistedState(): EconomyState {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      // ignore fallback to initial
    }
  }
  return INITIAL_STATE;
}

function savePersistedState(newState: EconomyState) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      // ignore
    }
  }
}

// ==========================================
// REACTIVE STORE SINGLETON
// ==========================================
let state: EconomyState = loadPersistedState();
const listeners = new Set<() => void>();

function notify() {
  savePersistedState(state);
  listeners.forEach(fn => fn());
}

export const economyStore = {
  getState(): EconomyState {
    return state;
  },

  getCoins(): number {
    return state.coins;
  },

  getItem(id: string): InventoryItem | undefined {
    return state.inventory.find(item => item.id === id);
  },

  getItemQuantity(id: string): number {
    const item = state.inventory.find(i => i.id === id);
    return item?.quantity ?? (item ? 1 : 0);
  },

  isItemOwned(id: string): boolean {
    return state.inventory.some(i => i.id === id);
  },

  purchaseItem(item: {
    id: string;
    name: string;
    category: ItemCategory;
    categoryName?: string;
    price: number;
    isConsumable: boolean;
    imageSource: any;
  }): { success: boolean; message?: string } {
    if (state.coins < item.price) {
      return { success: false, message: 'Không đủ Coin' };
    }

    const newCoins = state.coins - item.price;
    const existingIndex = state.inventory.findIndex(i => i.id === item.id);

    let updatedInventory = [...state.inventory];
    if (existingIndex >= 0) {
      if (item.isConsumable) {
        // Increment quantity for consumables
        const current = updatedInventory[existingIndex];
        updatedInventory[existingIndex] = {
          ...current,
          quantity: (current.quantity || 1) + 1
        };
      }
    } else {
      // Add new item
      updatedInventory.push({
        id: item.id,
        frameId: item.category === 'frame' ? item.id : undefined,
        name: item.name,
        category: item.category,
        categoryName: item.categoryName || (item.category === 'frame' ? 'Avatar Frame' : item.category === 'theme' ? 'Giao diện' : 'Booster'),
        state: 'inactive',
        quantity: item.isConsumable ? 1 : undefined,
        imageSource: item.imageSource
      });
    }

    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      type: 'spend',
      source: item.category === 'booster' ? 'shop_booster' : 'shop_cosmetic',
      title: item.name,
      subtitle: 'Mua từ Cửa hàng',
      amount: item.price,
      time: 'Vừa xong'
    };

    state = {
      coins: newCoins,
      inventory: updatedInventory,
      transactions: [newTx, ...state.transactions]
    };

    notify();
    return { success: true };
  },

  toggleEquip(targetItemId: string) {
    const targetItem = state.inventory.find(i => i.id === targetItemId);
    if (!targetItem || targetItem.state === 'expired') return;

    state = {
      ...state,
      inventory: state.inventory.map(item => {
        // Exclusivity rule: unequip other frames if equipping a frame
        if (targetItem.state === 'inactive' && targetItem.category === 'frame' && item.category === 'frame' && item.id !== targetItem.id) {
          return { ...item, state: 'inactive' };
        }
        if (item.id === targetItemId) {
          return { ...item, state: item.state === 'equipped' ? 'inactive' : 'equipped' };
        }
        return item;
      })
    };
    notify();
  },

  equipFrame(frameId: string) {
    const existing = state.inventory.find(i => (i.frameId === frameId || i.id === frameId) && i.category === 'frame');
    if (existing) {
      state = {
        ...state,
        inventory: state.inventory.map(item => {
          if (item.category === 'frame') {
            return { ...item, state: item.id === existing.id ? 'equipped' : 'inactive' };
          }
          return item;
        })
      };
      notify();
    } else {
      state = {
        ...state,
        inventory: [
          ...state.inventory.map(item => item.category === 'frame' ? { ...item, state: 'inactive' as const } : item),
          {
            id: frameId,
            frameId: frameId,
            name: frameId,
            category: 'frame',
            categoryName: 'Avatar Frame',
            state: 'equipped',
          }
        ]
      };
      notify();
    }
  }
};

// React hook for reactive subscription
export function useEconomyState(): [EconomyState, typeof economyStore] {
  const [currentState, setCurrentState] = useState<EconomyState>(economyStore.getState());

  useEffect(() => {
    const listener = () => setCurrentState(economyStore.getState());
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return [currentState, economyStore];
}
