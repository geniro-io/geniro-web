# LiteLlmModelInfoItemDto

## Properties

| Name                    | Type        | Description                          | Notes                             |
| ----------------------- | ----------- | ------------------------------------ | --------------------------------- |
| **id**                  | **string**  | LiteLLM database model ID            | [default to undefined]            |
| **modelName**           | **string**  | Model alias (display name)           | [default to undefined]            |
| **providerModel**       | **string**  | Underlying provider model identifier | [default to undefined]            |
| **apiBase**             | **string**  | Custom API base URL                  | [optional] [default to undefined] |
| **customLlmProvider**   | **string**  | Provider override                    | [optional] [default to undefined] |
| **supportsToolCalling** | **boolean** |                                      | [optional] [default to undefined] |
| **supportsStreaming**   | **boolean** |                                      | [optional] [default to undefined] |
| **supportsReasoning**   | **boolean** |                                      | [optional] [default to undefined] |

## Example

```typescript
import { LiteLlmModelInfoItemDto } from './api';

const instance: LiteLlmModelInfoItemDto = {
  id,
  modelName,
  providerModel,
  apiBase,
  customLlmProvider,
  supportsToolCalling,
  supportsStreaming,
  supportsReasoning,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
