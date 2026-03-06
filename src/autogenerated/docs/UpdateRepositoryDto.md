# UpdateRepositoryDto

## Properties

| Name              | Type       | Description                      | Notes                             |
| ----------------- | ---------- | -------------------------------- | --------------------------------- |
| **url**           | **string** | HTTPS URL of the repository      | [optional] [default to undefined] |
| **defaultBranch** | **string** | Default branch of the repository | [optional] [default to undefined] |

## Example

```typescript
import { UpdateRepositoryDto } from './api';

const instance: UpdateRepositoryDto = {
  url,
  defaultBranch,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
