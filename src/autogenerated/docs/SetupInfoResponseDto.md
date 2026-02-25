# SetupInfoResponseDto

## Properties

| Name             | Type        | Description                                                                                             | Notes                  |
| ---------------- | ----------- | ------------------------------------------------------------------------------------------------------- | ---------------------- |
| **installUrl**   | **string**  | URL to redirect the user to for GitHub App installation                                                 | [default to undefined] |
| **configured**   | **boolean** | Whether the GitHub App is fully configured                                                              | [default to undefined] |
| **callbackPath** | **string**  | Path the user must set as \&quot;Setup URL\&quot; in their GitHub App settings (append to their domain) | [default to undefined] |

## Example

```typescript
import { SetupInfoResponseDto } from './api';

const instance: SetupInfoResponseDto = {
  installUrl,
  configured,
  callbackPath,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
