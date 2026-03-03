import React from 'react';

import { Badge } from '../../../../components/ui/badge';
import { TAG_STYLE } from './blockStyles';
import type { ToolRenderStatus } from './threadMessagesTypes';

interface StatusTagProps {
  status: ToolRenderStatus;
  hasError?: boolean;
}

/** Renders the small status tag (done / error / stopped / running)
 *  used by SubagentBlock and CommunicationBlock headers. */
export const StatusTag: React.FC<StatusTagProps> = ({ status, hasError }) => {
  if (status === 'executed' && !hasError) {
    return (
      <Badge
        variant="outline"
        className="border-green-300 bg-green-50 text-green-700"
        style={TAG_STYLE}>
        done
      </Badge>
    );
  }
  if (status === 'executed' && hasError) {
    return (
      <Badge variant="destructive" style={TAG_STYLE}>
        error
      </Badge>
    );
  }
  if (status === 'stopped') {
    return (
      <Badge variant="outline" style={TAG_STYLE}>
        stopped
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="border-blue-300 bg-blue-50 text-blue-700"
      style={TAG_STYLE}>
      running
    </Badge>
  );
};

StatusTag.displayName = 'StatusTag';
