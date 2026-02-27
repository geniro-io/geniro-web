# AuthConfigResponseDto

## Properties

| Name         | Type       | Description                           | Notes                  |
| ------------ | ---------- | ------------------------------------- | ---------------------- |
| **provider** | **string** | Active auth provider                  | [default to undefined] |
| **issuer**   | **string** | Token issuer URL                      | [default to undefined] |
| **clientId** | **string** | OAuth client ID for the auth provider | [default to undefined] |

## Example

```typescript
import { AuthConfigResponseDto } from './api';

const instance: AuthConfigResponseDto = {
  provider,
  issuer,
  clientId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
