import { create } from 'zustand';
import { Board, List, Card, User } from '@/types';

interface BoardState {
  currentBoard: Board | null;
  lists: List[];
  cards: Record<string, Card[]>; // Keyed by listId
  isLoading: boolean;
  
  // Actions
  setBoard: (board: Board) => void;
  setLists: (lists: List[]) => void;
  setCards: (listId: string, cards: Card[]) => void;
  setAllCards: (cards: Card[]) => void;
  setLoading: (loading: boolean) => void;
  
  // Optimistic Updates
  addList: (list: List) => void;
  updateList: (id: string, data: Partial<List>) => void;
  removeList: (id: string) => void;
  
  addCard: (card: Card) => void;
  updateCard: (id: string, data: Partial<Card>) => void;
  removeCard: (id: string, listId: string) => void;
  moveCard: (cardId: string, sourceListId: string, destListId: string, newIndex: number) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  currentBoard: null,
  lists: [],
  cards: {},
  isLoading: false,

  setBoard: (board) => set({ currentBoard: board }),
  setLists: (lists) => set({ lists: lists.sort((a, b) => a.position - b.position) }),
  setCards: (listId, listCards) => set((state) => ({ 
    cards: { ...state.cards, [listId]: listCards.sort((a, b) => a.position - b.position) } 
  })),
  setAllCards: (allCards) => {
    const grouped: Record<string, Card[]> = {};
    allCards.forEach(card => {
      if (!grouped[card.listId]) grouped[card.listId] = [];
      grouped[card.listId].push(card);
    });
    
    // Sort cards in each list
    Object.keys(grouped).forEach(listId => {
      grouped[listId].sort((a, b) => a.position - b.position);
    });
    
    set({ cards: grouped });
  },
  setLoading: (isLoading) => set({ isLoading }),

  addList: (list) => set((state) => ({ 
    lists: [...state.lists, list],
    cards: { ...state.cards, [list._id]: [] }
  })),
  
  updateList: (id, data) => set((state) => ({
    lists: state.lists.map((l) => (l._id === id ? { ...l, ...data } : l)),
  })),
  
  removeList: (id) => set((state) => {
    const newLists = state.lists.filter((l) => l._id !== id);
    const newCards = { ...state.cards };
    delete newCards[id];
    return { lists: newLists, cards: newCards };
  }),

  addCard: (card) => set((state) => {
    const listCards = [...(state.cards[card.listId] || []), card];
    return { cards: { ...state.cards, [card.listId]: listCards } };
  }),

  updateCard: (id, data) => set((state) => {
    const newCards = { ...state.cards };
    for (const listId in newCards) {
      const cardIndex = newCards[listId].findIndex(c => c._id === id);
      if (cardIndex !== -1) {
        newCards[listId][cardIndex] = { ...newCards[listId][cardIndex], ...data };
        break;
      }
    }
    return { cards: newCards };
  }),

  removeCard: (id, listId) => set((state) => {
    if (!state.cards[listId]) return state;
    return { 
      cards: { 
        ...state.cards, 
        [listId]: state.cards[listId].filter(c => c._id !== id) 
      } 
    };
  }),

  moveCard: (cardId, sourceListId, destListId, newIndex) => set((state) => {
    const newCards = { ...state.cards };
    
    newCards[destListId] = newCards[destListId] || [];
    newCards[sourceListId] = newCards[sourceListId] || [];

    const sourceCards = [...newCards[sourceListId]];
    const cardIndex = sourceCards.findIndex(c => c._id === cardId);
    
    if (cardIndex === -1) return state;

    const [movedCard] = sourceCards.splice(cardIndex, 1);
    movedCard.listId = destListId;

    if (sourceListId === destListId) {
      sourceCards.splice(newIndex, 0, movedCard);
      // Update positions
      sourceCards.forEach((c, idx) => c.position = idx * 1000);
      newCards[sourceListId] = sourceCards;
    } else {
      const destCards = [...(newCards[destListId] || [])];
      destCards.splice(newIndex, 0, movedCard);
      
      // Update positions
      destCards.forEach((c, idx) => c.position = idx * 1000);
      
      newCards[sourceListId] = sourceCards;
      newCards[destListId] = destCards;
    }

    return { cards: newCards };
  }),
}));
