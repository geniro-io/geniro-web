# SetupInfoResponseDto

## Properties

| Name                       | Type        | Description                                                                                             | Notes                             |
| -------------------------- | ----------- | ------------------------------------------------------------------------------------------------------- | --------------------------------- |
| **installUrl**             | **string**  | URL to redirect the user to for GitHub App installation                                                 | [default to undefined]            |
| **newInstallationUrl**     | **string**  | URL to install the GitHub App on a new organization                                                     | [default to undefined]            |
| **configured**             | **boolean** | Whether the GitHub App is fully configured                                                              | [default to undefined]            |
| **callbackPath**           | **string**  | Path the user must set as \&quot;Setup URL\&quot; in their GitHub App settings (append to their domain) | [default to undefined]            |
| **reconfigureUrlTemplate** | **string**  | URL template for reconfiguring a GitHub App installation (replace {id} with the installation ID)        | [optional] [default to undefined] |

## Example

```typescript
import { SetupInfoResponseDto } from './api';

const instance: SetupInfoResponseDto = {
  installUrl,
  newInstallationUrl,
  configured,
  callbackPath,
  reconfigureUrlTemplate,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
