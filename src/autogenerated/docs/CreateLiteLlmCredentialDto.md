# CreateLiteLlmCredentialDto

## Properties

| Name                 | Type                           | Description                                             | Notes                  |
| -------------------- | ------------------------------ | ------------------------------------------------------- | ---------------------- |
| **credentialName**   | **string**                     | Unique credential identifier                            | [default to undefined] |
| **credentialValues** | **{ [key: string]: string; }** | Key-value pairs, e.g. { api_key: \&quot;sk-...\&quot; } | [default to undefined] |

## Example

```typescript
import { CreateLiteLlmCredentialDto } from './api';

const instance: CreateLiteLlmCredentialDto = {
  credentialName,
  credentialValues,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
