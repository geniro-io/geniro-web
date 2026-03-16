# UpdateLiteLlmModelDtoLitellmParams

## Properties

| Name                      | Type                           | Description                           | Notes                             |
| ------------------------- | ------------------------------ | ------------------------------------- | --------------------------------- |
| **model**                 | **string**                     | Provider model ID, e.g. openai/gpt-4o | [optional] [default to undefined] |
| **apiKey**                | **string**                     | Provider API key                      | [optional] [default to undefined] |
| **apiBase**               | **string**                     | Custom API base URL                   | [optional] [default to undefined] |
| **customLlmProvider**     | **string**                     |                                       | [optional] [default to undefined] |
| **maxTokens**             | **number**                     |                                       | [optional] [default to undefined] |
| **temperature**           | **number**                     |                                       | [optional] [default to undefined] |
| **requestTimeout**        | **number**                     |                                       | [optional] [default to undefined] |
| **customHeaders**         | **{ [key: string]: string; }** |                                       | [optional] [default to undefined] |
| **litellmCredentialName** | **string**                     | Named credential reference            | [optional] [default to undefined] |

## Example

```typescript
import { UpdateLiteLlmModelDtoLitellmParams } from './api';

const instance: UpdateLiteLlmModelDtoLitellmParams = {
  model,
  apiKey,
  apiBase,
  customLlmProvider,
  maxTokens,
  temperature,
  requestTimeout,
  customHeaders,
  litellmCredentialName,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
