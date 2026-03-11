# ThreadMessageDtoMessage

## Properties

| Name                 | Type                                                                                                           | Description                             | Notes                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------- | --------------------------------- |
| **role**             | **string**                                                                                                     | Message role                            | [default to undefined]            |
| **content**          | **{ [key: string]: any; }**                                                                                    | Parsed tool result as JSON              | [default to undefined]            |
| **runId**            | **string**                                                                                                     |                                         | [optional] [default to undefined] |
| **additionalKwargs** | **{ [key: string]: any; }**                                                                                    | Additional message metadata             | [optional] [default to undefined] |
| **id**               | **string**                                                                                                     | Message ID                              | [optional] [default to undefined] |
| **toolCalls**        | [**Array&lt;ThreadMessageDtoMessageOneOf1ToolCallsInner&gt;**](ThreadMessageDtoMessageOneOf1ToolCallsInner.md) | Tool calls in the message               | [optional] [default to undefined] |
| **name**             | **string**                                                                                                     | Tool name                               | [default to undefined]            |
| **toolCallId**       | **string**                                                                                                     | Tool call ID                            | [default to undefined]            |
| **title**            | **string**                                                                                                     | Optional human-readable tool call title | [optional] [default to undefined] |

## Example

```typescript
import { ThreadMessageDtoMessage } from './api';

const instance: ThreadMessageDtoMessage = {
  role,
  content,
  runId,
  additionalKwargs,
  id,
  toolCalls,
  name,
  toolCallId,
  title,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
