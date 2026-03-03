import { Copy } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../../../components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/ui/tooltip';

interface ChatBubbleProps {
  isHuman: boolean;
  avatarLabel: string;
  avatarColor: string;
  avatarSrc?: string;
  avatarTooltip?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  bubbleStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  copyContent?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = React.memo(
  ({
    isHuman,
    avatarLabel,
    avatarColor,
    avatarSrc,
    avatarTooltip,
    children,
    footer,
    bubbleStyle,
    containerStyle,
    copyContent,
  }) => {
    const handleCopy = async () => {
      if (!copyContent) return;

      try {
        await navigator.clipboard.writeText(copyContent);
        toast.success('Message copied to clipboard');
      } catch (_error) {
        toast.error('Failed to copy message');
      }
    };

    const baseContainer: React.CSSProperties = {
      display: 'flex',
      justifyContent: isHuman ? 'flex-end' : 'flex-start',
      alignItems: 'flex-start',
      gap: '8px',
      width: '100%',
    };

    const mergedContainer = { ...baseContainer, ...containerStyle };

    const baseBubbleStyle: React.CSSProperties = {
      borderRadius: '12px',
      padding: '12px 16px',
      wordBreak: 'break-word',
      minWidth: '100px',
      maxWidth: '100%',
      overflowX: 'auto',
      position: 'relative',
      ...(!isHuman
        ? {
            backgroundColor: 'var(--muted)',
            color: 'var(--foreground)',
          }
        : {}),
    };

    const bubbleClassName = isHuman
      ? 'bg-blue-50 text-blue-900 border border-blue-100'
      : '';

    const mergedBubbleStyle = {
      ...baseBubbleStyle,
      ...bubbleStyle,
    };

    const avatarElement = (
      <Avatar
        className="shrink-0"
        style={{
          width: 27,
          height: 27,
          ...(!isHuman ? {} : { backgroundColor: avatarColor }),
        }}>
        {avatarSrc && <AvatarImage src={avatarSrc} />}
        <AvatarFallback
          className="text-[10px]"
          style={isHuman ? { backgroundColor: avatarColor } : undefined}>
          {avatarLabel}
        </AvatarFallback>
      </Avatar>
    );

    const ContentWrapper = (
      <div
        style={{
          maxWidth: '76%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isHuman ? 'flex-end' : 'flex-start',
        }}>
        <div className={bubbleClassName} style={mergedBubbleStyle}>
          {children}
        </div>
        {(footer || copyContent) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '4px',
            }}>
            {footer}
            {copyContent && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Copy
                    onClick={handleCopy}
                    style={{
                      cursor: 'pointer',
                      width: 11,
                      height: 11,
                      color: 'var(--muted-foreground)',
                      position: 'relative',
                      top: '2px',
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>Copy message</TooltipContent>
              </Tooltip>
            )}
          </div>
        )}
      </div>
    );

    return (
      <div style={mergedContainer}>
        {!isHuman &&
          (avatarTooltip ? (
            <Tooltip>
              <TooltipTrigger asChild>{avatarElement}</TooltipTrigger>
              <TooltipContent side="right">{avatarTooltip}</TooltipContent>
            </Tooltip>
          ) : (
            avatarElement
          ))}
        {ContentWrapper}
        {isHuman &&
          (avatarTooltip ? (
            <Tooltip>
              <TooltipTrigger asChild>{avatarElement}</TooltipTrigger>
              <TooltipContent side="left">{avatarTooltip}</TooltipContent>
            </Tooltip>
          ) : (
            avatarElement
          ))}
      </div>
    );
  },
);
ChatBubble.displayName = 'ChatBubble';
