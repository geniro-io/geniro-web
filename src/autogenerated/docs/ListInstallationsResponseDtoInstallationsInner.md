# ListInstallationsResponseDtoInstallationsInner

## Properties

| Name               | Type        | Description                        | Notes                  |
| ------------------ | ----------- | ---------------------------------- | ---------------------- |
| **id**             | **string**  | Installation record ID             | [default to undefined] |
| **installationId** | **number**  | GitHub installation ID             | [default to undefined] |
| **accountLogin**   | **string**  | GitHub org/user login              | [default to undefined] |
| **accountType**    | **string**  | Account type: Organization or User | [default to undefined] |
| **isActive**       | **boolean** | Whether the installation is active | [default to undefined] |
| **createdAt**      | **string**  |                                    | [default to undefined] |

## Example

```typescript
import { ListInstallationsResponseDtoInstallationsInner } from './api';

const instance: ListInstallationsResponseDtoInstallationsInner = {
  id,
  installationId,
  accountLogin,
  accountType,
  isActive,
  createdAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
