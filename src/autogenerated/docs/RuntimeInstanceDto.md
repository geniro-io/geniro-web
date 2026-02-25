# RuntimeInstanceDto

## Properties

| Name                 | Type       | Description                             | Notes                  |
| -------------------- | ---------- | --------------------------------------- | ---------------------- |
| **id**               | **string** | Runtime instance ID                     | [default to undefined] |
| **graphId**          | **string** | Graph ID                                | [default to undefined] |
| **nodeId**           | **string** | Node ID                                 | [default to undefined] |
| **externalThreadId** | **string** | External thread ID (graphId:threadUUID) | [default to undefined] |
| **type**             | **string** | Runtime type                            | [default to undefined] |
| **status**           | **string** | Runtime instance status                 | [default to undefined] |
| **containerName**    | **string** | Container name                          | [default to undefined] |
| **lastUsedAt**       | **string** | Last used timestamp                     | [default to undefined] |
| **createdAt**        | **string** | Creation timestamp                      | [default to undefined] |
| **updatedAt**        | **string** | Last update timestamp                   | [default to undefined] |

## Example

```typescript
import { RuntimeInstanceDto } from './api';

const instance: RuntimeInstanceDto = {
  id,
  graphId,
  nodeId,
  externalThreadId,
  type,
  status,
  containerName,
  lastUsedAt,
  createdAt,
  updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
