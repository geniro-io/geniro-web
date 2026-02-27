# GitRepositoryDto

## Properties

| Name              | Type       | Description                                          | Notes                  |
| ----------------- | ---------- | ---------------------------------------------------- | ---------------------- |
| **id**            | **string** | Repository ID                                        | [default to undefined] |
| **owner**         | **string** | Repository owner (GitHub username or organization)   | [default to undefined] |
| **repo**          | **string** | Repository name                                      | [default to undefined] |
| **url**           | **string** | HTTPS URL of the repository                          | [default to undefined] |
| **provider**      | **string** | Git repository host provider                         | [default to undefined] |
| **defaultBranch** | **string** | Default branch of the repository (e.g. main, master) | [default to undefined] |
| **createdBy**     | **string** | User ID who cloned the repository                    | [default to undefined] |
| **projectId**     | **string** |                                                      | [default to undefined] |
| **createdAt**     | **string** |                                                      | [default to undefined] |
| **updatedAt**     | **string** |                                                      | [default to undefined] |

## Example

```typescript
import { GitRepositoryDto } from './api';

const instance: GitRepositoryDto = {
  id,
  owner,
  repo,
  url,
  provider,
  defaultBranch,
  createdBy,
  projectId,
  createdAt,
  updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
