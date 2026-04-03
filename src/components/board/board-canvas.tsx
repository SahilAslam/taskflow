'use client';

import { useBoardStore } from '@/store/useBoardStore';
import { useMemo, useState } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragStartEvent, 
  DragOverEvent, 
  DragEndEvent 
} from '@dnd-kit/core';
import { 
  SortableContext, 
  arrayMove, 
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';
import { ListItem } from './list-item';
import { CardItem } from './card-item';
import { listsApi, cardsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function BoardCanvas({ boardId }: { boardId: string }) {
  const { lists, cards, setLists, setCards, addList, moveCard } = useBoardStore();
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { type } = active.data.current || {};
    if (type === 'List') setActiveListId(active.id as string);
    if (type === 'Card') setActiveCardId(active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;
    
    if (activeType !== 'Card') return;

    const activeCardListId = active.data.current?.sortable?.containerId;
    const overListId = overType === 'Card' ? over.data.current?.sortable?.containerId : over.id;

    if (!activeCardListId || !overListId || activeCardListId === overListId) return;

    const overIndex = overType === 'Card' 
      ? (cards[overListId] || []).findIndex((c) => c._id === over.id)
      : cards[overListId]?.length || 0;

    moveCard(active.id as string, activeCardListId, overListId, overIndex);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveListId(null);
    setActiveCardId(null);
    
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type;
    
    if (activeType === 'List') {
      if (active.id === over.id) return;
      
      const oldIndex = lists.findIndex((l) => l._id === active.id);
      const newIndex = lists.findIndex((l) => l._id === over.id);
      
      const newLists = arrayMove(lists, oldIndex, newIndex);
      // Optimistic update
      setLists(newLists.map((l, i) => ({ ...l, position: i * 1000 })));
      
      try {
        await listsApi.reorder(boardId, newLists.map((l) => l._id));
      } catch (err) {
        // Rollback on fail (ideally implemented with a saved previous state)
      }
    }

    if (activeType === 'Card') {
      const activeListId = active.data.current?.sortable?.containerId;
      const overListId = over.data.current?.type === 'Card' ? over.data.current?.sortable?.containerId : over.id;

      if (!activeListId || !overListId) return;

      const activeListCards = cards[activeListId] || [];
      const overListCards = cards[overListId] || [];

      const oldIndex = activeListCards.findIndex((c) => c._id === active.id);
      let newIndex = over.data.current?.type === 'Card' 
        ? overListCards.findIndex((c) => c._id === over.id)
        : overListCards.length;

      if (activeListId === overListId && oldIndex !== newIndex) {
         const newCardsArr = arrayMove(activeListCards, oldIndex, newIndex);
         setCards(activeListId, newCardsArr);
         
         const newPosition = newIndex * 1000;
         cardsApi.move({ cardId: String(active.id), newListId: String(activeListId), newPosition, boardId }).catch(console.error);
      } else if (activeListId !== overListId) {
         // Already handled by dragOver optimistically, just need to fire API
         const newPosition = newIndex * 1000;
         cardsApi.move({ cardId: String(active.id), newListId: String(overListId), newPosition, boardId }).catch(console.error);
      }
    }
  };

  const handleAddList = async () => {
    if (!newListTitle.trim()) {
      setIsAddingList(false);
      return;
    }
    
    try {
      const res = await listsApi.create({ title: newListTitle, boardId });
      addList(res.data.list);
      setNewListTitle('');
      setIsAddingList(false);
    } catch (err) {
      console.error(err);
    }
  };

  const listIds = useMemo(() => lists.map((l) => l._id), [lists]);
  const activeList = useMemo(() => lists.find((l) => l._id === activeListId), [activeListId, lists]);
  
  // Find active card for overlay across all lists
  const activeCard = useMemo(() => {
    if (!activeCardId) return null;
    for (const listId in cards) {
      const c = cards[listId]?.find((c) => c._id === activeCardId);
      if (c) return c;
    }
    return null;
  }, [activeCardId, cards]);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="h-full w-full overflow-x-auto overflow-y-hidden p-6 scrollbar-thin scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30 pt-4">
        <div className="flex h-full gap-4 items-start">
          <SortableContext items={listIds} strategy={horizontalListSortingStrategy}>
            {lists.map((list) => (
              <ListItem key={list._id} list={list} cards={cards[list._id] || []} boardId={boardId} />
            ))}
          </SortableContext>
          
          {/* Add List Button */}
          <div className="shrink-0 w-[280px]">
            {isAddingList ? (
              <div className="bg-card/40 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-lg">
                <Input 
                  autoFocus
                  placeholder="Enter list title..." 
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
                  className="bg-white/5 border-white/10 mb-3"
                />
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleAddList}>Add List</Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsAddingList(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground bg-white/5 hover:bg-white/10 border border-white/10 border-dashed h-12"
                onClick={() => setIsAddingList(true)}
              >
                <Plus className="h-4 w-4 mr-2" /> Add another list
              </Button>
            )}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeListId && activeList ? <ListItem list={activeList} cards={cards[activeList._id] || []} boardId={boardId} isOverlay /> : null}
        {activeCardId && activeCard ? <CardItem card={activeCard} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
