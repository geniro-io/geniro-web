import { formatDistanceToNow } from 'date-fns';
import { Folder, MessageCircle, Network, Pencil, Trash2 } from 'lucide-react';

import { Button } from './button';
import { Card } from './card';

export interface ProjectCardProps {
  name: string;
  icon?: string | null;
  color?: string | null;
  description?: string | null;
  graphCount: number;
  threadCount: number;
  updatedAt: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ProjectCard({
  name,
  icon,
  color,
  description,
  graphCount,
  threadCount,
  updatedAt,
  onClick,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const accentColor = color ?? '#3B82F6';

  return (
    <Card
      className="p-4 gap-1 hover:shadow-lg transition-shadow relative overflow-hidden cursor-pointer"
      onClick={onClick}>
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: accentColor }}
      />
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
            style={{
              backgroundColor: `${accentColor}20`,
              color: accentColor,
            }}>
            {icon ?? (
              <Folder className="w-5 h-5" style={{ color: accentColor }} />
            )}
          </div>
          <h3 className="text-sm font-semibold">{name}</h3>
        </div>
        {(onEdit ?? onDelete) && (
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={onEdit}>
                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                onClick={onDelete}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}
      <div className="space-y-1 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1">
            <Network className="w-3.5 h-3.5" />
            {graphCount} graphs
          </span>
          <span>&bull;</span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            {threadCount} threads
          </span>
        </div>
        <div className="text-xs">
          {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
        </div>
      </div>
    </Card>
  );
}
