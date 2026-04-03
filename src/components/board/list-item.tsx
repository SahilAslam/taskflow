'use client';

import { useMemo, useState } from 'react';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { List, Card as CardType } from '@/types';
import { CardItem } from './card-item';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Plus } from 'lucide-react';
import { cardsApi, listsApi } from '@/lib/api';
import { useBoardStore } from '@/store/useBoardStore';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ListItemProps {
  list: List;
  cards: CardType[];
  boardId: string;
  isOverlay?: boolean;
}

export function ListItem({ list, cards, boardId, isOverlay }: ListItemProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: list._id,
    data: { type: 'List', list },
  });

  const { addCard, removeList } = useBoardStore();
  
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isEditingListTitle, setIsEditingListTitle] = useState(false);
  const [listTitle, setListTitle] = useState(list.title);

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const cardIds = useMemo(() => cards.map((c) => c._id), [cards]);

  const handleAddCard = async () => {
    if (!newCardTitle.trim()) {
      setIsAddingCard(false);
      return;
    }
    try {
      const res = await cardsApi.create({ title: newCardTitle, listId: list._id, boardId });
      addCard(res.data.card);
      setNewCardTitle('');
      setIsAddingCard(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateListTitle = async () => {
    if (!listTitle.trim() || listTitle === list.title) {
      setIsEditingListTitle(false);
      setListTitle(list.title);
      return;
    }
    try {
      await listsApi.update(list._id, { title: listTitle });
      setIsEditingListTitle(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteList = async () => {
    try {
      await listsApi.delete(list._id);
      removeList(list._id);
    } catch (err) {
      console.error(err);
    }
  };

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="shrink-0 w-[280px] h-full opacity-30 bg-white/5 border-2 border-primary/50 border-dashed rounded-xl"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "shrink-0 w-[280px] max-h-full flex flex-col bg-card/40 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg relative",
        isOverlay && "cursor-grabbing rotate-2 shadow-2xl opacity-100 ring-2 ring-primary bg-card/80 z-50",
      )}
    >
      {/* List Header */}
      <div 
        {...attributes} 
        {...listeners} 
        className={cn(
          "p-3 flex items-center justify-between group",
          !isOverlay && "cursor-grab active:cursor-grabbing"
        )}
      >
        <div className="flex-1 font-semibold text-sm mr-2 w-full">
          {isEditingListTitle ? (
             <Input 
                autoFocus
                value={listTitle}
                onChange={(e) => setListTitle(e.target.value)}
                onBlur={handleUpdateListTitle}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdateListTitle()}
                className="h-7 text-sm px-2 bg-background border-white/10 border"
                onPointerDown={(e) => e.stopPropagation()} // Prevent drag when focusing input
             />
          ) : (
            <div 
              className="px-2 py-1 cursor-text truncate text-foreground/90 font-medium tracking-tight rounded-md hover:bg-white/5"
              onClick={() => setIsEditingListTitle(true)}
              onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking
            >
              {listTitle}
            </div>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onPointerDown={(e) => e.stopPropagation()} />}>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass border-white/10">
            <DropdownMenuItem onClick={() => setIsAddingCard(true)}>Add card...</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={handleDeleteList}>
              Delete list
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Cards Area */}
      <div className="flex-1 p-2 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10 flex flex-col gap-2 min-h-[50px]">
        <SortableContext id={list._id} items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <CardItem key={card._id} card={card} />
          ))}
        </SortableContext>
        
        {isAddingCard && (
           <div className="p-2 bg-card border border-primary/30 rounded-lg shadow-sm">
              <Input 
                autoFocus
                placeholder="Enter a title for this card..." 
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCard()}
                className="bg-background/50 border-white/10 mb-2 h-8 text-sm"
              />
              <div className="flex items-center gap-1">
                <Button size="sm" onClick={handleAddCard} className="h-7 text-xs px-2">Add Card</Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setIsAddingCard(false)}>
                  <Plus className="h-4 w-4 rotate-45" />
                </Button>
              </div>
           </div>
        )}
      </div>

      {/* List Footer */}
      {!isAddingCard && (
        <div className="p-2 pt-0">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:bg-white/5 hover:text-foreground h-9 font-normal text-sm"
            onClick={() => setIsAddingCard(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add a card
          </Button>
        </div>
      )}
    </div>
  );
}
