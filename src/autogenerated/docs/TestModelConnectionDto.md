# TestModelConnectionDto

## Properties

| Name                      | Type       | Description                                       | Notes                             |
| ------------------------- | ---------- | ------------------------------------------------- | --------------------------------- |
| **litellmModel**          | **string** | LiteLLM model string, e.g. openai/gpt-4o          | [default to undefined]            |
| **apiKey**                | **string** | Provider API key                                  | [optional] [default to undefined] |
| **apiBase**               | **string** | Custom API base URL                               | [optional] [default to undefined] |
| **litellmCredentialName** | **string** | Named credential reference (resolved server-side) | [optional] [default to undefined] |

## Example

```typescript
import { TestModelConnectionDto } from './api';

const instance: TestModelConnectionDto = {
  litellmModel,
  apiKey,
  apiBase,
  litellmCredentialName,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
