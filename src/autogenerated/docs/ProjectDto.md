# ProjectDto

## Properties

| Name            | Type                        | Description | Notes                             |
| --------------- | --------------------------- | ----------- | --------------------------------- |
| **id**          | **string**                  |             | [default to undefined]            |
| **name**        | **string**                  |             | [default to undefined]            |
| **description** | **string**                  |             | [optional] [default to undefined] |
| **icon**        | **string**                  |             | [optional] [default to undefined] |
| **color**       | **string**                  |             | [optional] [default to undefined] |
| **settings**    | **{ [key: string]: any; }** |             | [default to undefined]            |
| **createdBy**   | **string**                  |             | [default to undefined]            |
| **createdAt**   | **string**                  |             | [default to undefined]            |
| **updatedAt**   | **string**                  |             | [default to undefined]            |

## Example

```typescript
import { ProjectDto } from './api';

const instance: ProjectDto = {
  id,
  name,
  description,
  icon,
  color,
  settings,
  createdBy,
  createdAt,
  updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
