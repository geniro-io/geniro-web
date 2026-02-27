# CreateProjectDto

## Properties

| Name            | Type                        | Description | Notes                             |
| --------------- | --------------------------- | ----------- | --------------------------------- |
| **name**        | **string**                  |             | [default to undefined]            |
| **description** | **string**                  |             | [optional] [default to undefined] |
| **icon**        | **string**                  |             | [optional] [default to undefined] |
| **color**       | **string**                  |             | [optional] [default to undefined] |
| **settings**    | **{ [key: string]: any; }** |             | [optional] [default to undefined] |

## Example

```typescript
import { CreateProjectDto } from './api';

const instance: CreateProjectDto = {
  name,
  description,
  icon,
  color,
  settings,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
