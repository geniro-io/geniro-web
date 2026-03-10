# LiteLlmModelDto

## Properties

| Name                  | Type        | Description                           | Notes                  |
| --------------------- | ----------- | ------------------------------------- | ---------------------- |
| **id**                | **string**  | Model identifier                      | [default to undefined] |
| **ownedBy**           | **string**  | Owner of the model                    | [default to undefined] |
| **supportsEmbedding** | **boolean** | Whether this model supports embedding | [default to undefined] |

## Example

```typescript
import { LiteLlmModelDto } from './api';

const instance: LiteLlmModelDto = {
  id,
  ownedBy,
  supportsEmbedding,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
