import React, { createContext, useContext, useReducer } from 'react';
import { CartItem, Size } from '../types';

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { _id: string; size: Size } }
  | { type: 'UPDATE_QUANTITY'; payload: { _id: string; size: Size; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        item => item._id === action.payload._id && item.size === action.payload.size
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item._id === action.payload._id && item.size === action.payload.size
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.prices[action.payload.size],
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.prices[action.payload.size],
      };
    }

    case 'REMOVE_ITEM': {
      const item = state.items.find(
        i => i._id === action.payload._id && i.size === action.payload.size
      );
      if (!item) return state;

      return {
        ...state,
        items: state.items.filter(
          i => !(i._id === action.payload._id && i.size === action.payload.size)
        ),
        total: state.total - item.prices[item.size] * item.quantity,
      };
    }

    case 'UPDATE_QUANTITY': {
      const item = state.items.find(
        i => i._id === action.payload._id && i.size === action.payload.size
      );
      if (!item) return state;

      const quantityDiff = action.payload.quantity - item.quantity;
      return {
        ...state,
        items: state.items.map(i =>
          i._id === action.payload._id && i.size === action.payload.size
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
        total: state.total + item.prices[item.size] * quantityDiff,
      };
    }

    case 'CLEAR_CART':
      return { items: [], total: 0 };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
