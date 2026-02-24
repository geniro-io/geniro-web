import { CopyOutlined } from '@ant-design/icons';
import { App, Avatar, Tooltip } from 'antd';
import React from 'react';

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
    const { message } = App.useApp();

    const handleCopy = async () => {
      if (!copyContent) return;

      try {
        await navigator.clipboard.writeText(copyContent);
        message.success('Message copied to clipboard');
      } catch (_error) {
        message.error('Failed to copy message');
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
      backgroundColor: isHuman ? '#f0f8ff' : '#f3f3f3',
      borderRadius: '5px',
      padding: '8px 24px 8px 12px',
      wordBreak: 'break-word',
      minWidth: '100px',
      maxWidth: '100%',
      overflowX: 'auto',
      position: 'relative',
    };

    const mergedBubbleStyle = {
      ...baseBubbleStyle,
      ...(copyContent ? null : { padding: '8px 12px' }),
      ...bubbleStyle,
    };

    const ContentWrapper = (
      <div
        style={{
          maxWidth: '90%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isHuman ? 'flex-end' : 'flex-start',
        }}>
        <div style={mergedBubbleStyle}>{children}</div>
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
              <Tooltip title="Copy message">
                <CopyOutlined
                  onClick={handleCopy}
                  style={{
                    cursor: 'pointer',
                    fontSize: '11px',
                    color: '#9ca3af',
                    position: 'relative',
                    top: '2px',
                  }}
                />
              </Tooltip>
            )}
          </div>
        )}
      </div>
    );

    return (
      <div style={mergedContainer}>
        {!isHuman && (
          <Tooltip title={avatarTooltip} placement="right">
            <Avatar src={avatarSrc} style={{ flexShrink: 0 }} size={27}>
              {avatarLabel}
            </Avatar>
          </Tooltip>
        )}
        {ContentWrapper}
        {isHuman && (
          <Tooltip title={avatarTooltip} placement="left">
            <Avatar
              src={avatarSrc}
              style={{ backgroundColor: avatarColor, flexShrink: 0 }}
              size={27}>
              {avatarLabel}
            </Avatar>
          </Tooltip>
        )}
      </div>
    );
  },
);
ChatBubble.displayName = 'ChatBubble';
