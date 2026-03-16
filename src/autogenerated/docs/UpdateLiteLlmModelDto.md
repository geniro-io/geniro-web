# UpdateLiteLlmModelDto

## Properties

| Name              | Type                                                                            | Description                                  | Notes                             |
| ----------------- | ------------------------------------------------------------------------------- | -------------------------------------------- | --------------------------------- |
| **modelId**       | **string**                                                                      | LiteLLM database model ID from model_info.id | [default to undefined]            |
| **modelName**     | **string**                                                                      |                                              | [optional] [default to undefined] |
| **litellmParams** | [**UpdateLiteLlmModelDtoLitellmParams**](UpdateLiteLlmModelDtoLitellmParams.md) |                                              | [optional] [default to undefined] |
| **tags**          | **Array&lt;string&gt;**                                                         | Routing tags for this model                  | [optional] [default to undefined] |
| **modelInfo**     | **{ [key: string]: any; }**                                                     | Additional model info metadata               | [optional] [default to undefined] |

## Example

```typescript
import { UpdateLiteLlmModelDto } from './api';

const instance: UpdateLiteLlmModelDto = {
  modelId,
  modelName,
  litellmParams,
  tags,
  modelInfo,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
