# ThreadDto

## Properties

| Name                 | Type                                                             | Description                       | Notes                             |
| -------------------- | ---------------------------------------------------------------- | --------------------------------- | --------------------------------- |
| **id**               | **string**                                                       | Thread ID                         | [default to undefined]            |
| **graphId**          | **string**                                                       | Graph ID                          | [default to undefined]            |
| **externalThreadId** | **string**                                                       | External thread ID from LangChain | [default to undefined]            |
| **lastRunId**        | **string**                                                       |                                   | [optional] [default to undefined] |
| **createdAt**        | **string**                                                       |                                   | [default to undefined]            |
| **updatedAt**        | **string**                                                       |                                   | [default to undefined]            |
| **metadata**         | **{ [key: string]: any; }**                                      |                                   | [optional] [default to undefined] |
| **source**           | **string**                                                       |                                   | [optional] [default to undefined] |
| **name**             | **string**                                                       |                                   | [optional] [default to undefined] |
| **status**           | **string**                                                       | Thread execution status           | [default to undefined]            |
| **agents**           | [**Array&lt;ThreadDtoAgentsInner&gt;**](ThreadDtoAgentsInner.md) |                                   | [optional] [default to undefined] |

## Example

```typescript
import { ThreadDto } from './api';

const instance: ThreadDto = {
  id,
  graphId,
  externalThreadId,
  lastRunId,
  createdAt,
  updatedAt,
  metadata,
  source,
  name,
  status,
  agents,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
