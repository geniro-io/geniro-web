# CreateLiteLlmModelDto

## Properties

| Name              | Type                                                                            | Description                    | Notes                             |
| ----------------- | ------------------------------------------------------------------------------- | ------------------------------ | --------------------------------- |
| **modelName**     | **string**                                                                      | Display name / alias           | [default to undefined]            |
| **litellmParams** | [**CreateLiteLlmModelDtoLitellmParams**](CreateLiteLlmModelDtoLitellmParams.md) |                                | [default to undefined]            |
| **tags**          | **Array&lt;string&gt;**                                                         | Routing tags for this model    | [optional] [default to undefined] |
| **modelInfo**     | **{ [key: string]: any; }**                                                     | Additional model info metadata | [optional] [default to undefined] |

## Example

```typescript
import { CreateLiteLlmModelDto } from './api';

const instance: CreateLiteLlmModelDto = {
  modelName,
  litellmParams,
  tags,
  modelInfo,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
