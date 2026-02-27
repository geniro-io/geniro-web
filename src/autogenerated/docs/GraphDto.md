# GraphDto

## Properties

| Name               | Type                                                    | Description                                           | Notes                             |
| ------------------ | ------------------------------------------------------- | ----------------------------------------------------- | --------------------------------- |
| **id**             | **string**                                              |                                                       | [default to undefined]            |
| **name**           | **string**                                              |                                                       | [default to undefined]            |
| **description**    | **string**                                              |                                                       | [optional] [default to undefined] |
| **error**          | **string**                                              |                                                       | [optional] [default to undefined] |
| **version**        | **string**                                              |                                                       | [default to undefined]            |
| **targetVersion**  | **string**                                              | Target version after all queued revisions are applied | [default to undefined]            |
| **schema**         | [**CreateGraphDtoSchema**](CreateGraphDtoSchema.md)     |                                                       | [default to undefined]            |
| **status**         | **string**                                              |                                                       | [default to undefined]            |
| **metadata**       | [**CreateGraphDtoMetadata**](CreateGraphDtoMetadata.md) |                                                       | [optional] [default to undefined] |
| **runningThreads** | **number**                                              | Number of threads currently in running state          | [optional] [default to 0]         |
| **totalThreads**   | **number**                                              | Total number of threads for this graph                | [optional] [default to 0]         |
| **createdAt**      | **string**                                              |                                                       | [default to undefined]            |
| **updatedAt**      | **string**                                              |                                                       | [default to undefined]            |
| **temporary**      | **boolean**                                             |                                                       | [optional] [default to false]     |
| **projectId**      | **string**                                              |                                                       | [optional] [default to undefined] |

## Example

```typescript
import { GraphDto } from './api';

const instance: GraphDto = {
  id,
  name,
  description,
  error,
  version,
  targetVersion,
  schema,
  status,
  metadata,
  runningThreads,
  totalThreads,
  createdAt,
  updatedAt,
  temporary,
  projectId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
