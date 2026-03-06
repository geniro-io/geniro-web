# OAuthLinkRequestDto

## Properties

| Name               | Type       | Description                                                                                                 | Notes                             |
| ------------------ | ---------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------- |
| **code**           | **string** | GitHub OAuth authorization code                                                                             | [default to undefined]            |
| **installationId** | **number** | Optional GitHub App installation ID hint — used when the user was redirected from a GitHub App install flow | [optional] [default to undefined] |

## Example

```typescript
import { OAuthLinkRequestDto } from './api';

const instance: OAuthLinkRequestDto = {
  code,
  installationId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
