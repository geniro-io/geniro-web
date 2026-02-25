# LinkInstallationResponseDto

## Properties

| Name             | Type        | Description                                      | Notes                  |
| ---------------- | ----------- | ------------------------------------------------ | ---------------------- |
| **linked**       | **boolean** | Whether the installation was successfully linked | [default to undefined] |
| **accountLogin** | **string**  | GitHub org/user login where the app is installed | [default to undefined] |
| **accountType**  | **string**  | Account type: Organization or User               | [default to undefined] |

## Example

```typescript
import { LinkInstallationResponseDto } from './api';

const instance: LinkInstallationResponseDto = {
  linked,
  accountLogin,
  accountType,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
