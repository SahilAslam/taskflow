'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card as CardType } from '@/types';
import { cn } from '@/lib/utils';
import { AlignLeft, CheckSquare, MessageSquare, Paperclip, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface CardItemProps {
  card: CardType;
  isOverlay?: boolean;
}

const PRIORITIES = {
  urgent: { color: 'bg-ef4444', border: 'border-red-500/50' },
  high: { color: 'bg-f97316', border: 'border-orange-500/50' },
  medium: { color: 'bg-eab308', border: 'border-yellow-500/50' },
  low: { color: 'bg-3b82f6', border: 'border-blue-500/50' },
  none: { color: 'bg-transparent', border: 'border-white/10' },
};

export function CardItem({ card, isOverlay }: CardItemProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { type: 'Card', card },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="w-full h-[80px] opacity-30 bg-white/5 border border-primary/50 border-dashed rounded-lg"
      />
    );
  }

  const hasChecklist = card.checklist?.length > 0;
  const completedChecklists = card.checklist?.filter(c => c.completed).length || 0;
  const checklistDone = hasChecklist && completedChecklists === card.checklist.length;
  
  const priorityStyle = PRIORITIES[card.priority as keyof typeof PRIORITIES] || PRIORITIES.none;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative flex flex-col gap-2 rounded-lg bg-card/60 border hover:border-white/20 p-3 shadow-sm transition-colors text-sm hover:ring-1 hover:ring-primary/20",
        !isOverlay && "cursor-grab active:cursor-grabbing",
        isOverlay && "cursor-grabbing rotate-3 shadow-xl ring-2 ring-primary/50 opacity-100 z-50",
        priorityStyle.border,
        card.coverColor && "border-t-[6px]" // If colored
      )}
      style={card.coverColor ? { borderTopColor: card.coverColor, ...style } : style}
    >
      {/* Labels */}
      {card.labels?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {card.labels.map((label, idx) => (
            <span key={idx} className="h-2 w-8 rounded-full" style={{ backgroundColor: label.color }} title={label.text} />
          ))}
        </div>
      )}

      {/* Title */}
      <div className="font-medium text-foreground tracking-tight leading-tight line-clamp-2">
        {card.title}
      </div>

      {/* Badges Layout */}
      {(card.description || hasChecklist || card.comments?.length > 0 || card.attachments?.length > 0 || card.dueDate || card.assignees?.length > 0 || card.priority !== 'none') && (
        <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-3">
            {/* Priority Indicator */}
            {card.priority !== 'none' && (
              <div 
                className={cn("w-2 h-2 rounded-full", priorityStyle.color)} 
                title={`Priority: ${card.priority}`}
              />
            )}
            
            {/* Description Icon */}
            {card.description && <AlignLeft className="h-3.5 w-3.5" />}
            
            {/* Checklist */}
            {hasChecklist && (
              <div className={cn("flex items-center gap-1.5", checklistDone && "text-emerald-400")}>
                <CheckSquare className="h-3.5 w-3.5" />
                <span>{completedChecklists}/{card.checklist.length}</span>
              </div>
            )}
            
            {/* Comments */}
            {card.comments?.length > 0 && (
              <div className="flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{card.comments.length}</span>
              </div>
            )}

            {/* Attachments */}
            {card.attachments?.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Paperclip className="h-3.5 w-3.5" />
                <span>{card.attachments.length}</span>
              </div>
            )}

            {/* Due Date */}
            {card.dueDate && (
              <div className={cn("flex items-center gap-1.5", new Date(card.dueDate) < new Date() && "text-destructive")}>
                <Clock className="h-3.5 w-3.5" />
                <span>{format(new Date(card.dueDate), 'MMM d')}</span>
              </div>
            )}
          </div>

          {/* Assignees */}
          {card.assignees?.length > 0 && (
            <div className="flex items-center -space-x-1.5 shrink-0">
              {card.assignees.slice(0, 3).map((user) => (
                <Avatar key={user._id} className="h-5 w-5 border border-background">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-[10px] bg-primary/20">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              ))}
              {card.assignees.length > 3 && (
                <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-medium border border-background">
                  +{card.assignees.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
