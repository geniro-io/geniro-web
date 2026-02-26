# UpdateProjectDto

## Properties

| Name            | Type                        | Description | Notes                             |
| --------------- | --------------------------- | ----------- | --------------------------------- |
| **name**        | **string**                  |             | [optional] [default to undefined] |
| **description** | **string**                  |             | [optional] [default to undefined] |
| **icon**        | **string**                  |             | [optional] [default to undefined] |
| **color**       | **string**                  |             | [optional] [default to undefined] |
| **settings**    | **{ [key: string]: any; }** |             | [optional] [default to undefined] |

## Example

```typescript
import { UpdateProjectDto } from './api';

const instance: UpdateProjectDto = {
  name,
  description,
  icon,
  color,
  settings,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
