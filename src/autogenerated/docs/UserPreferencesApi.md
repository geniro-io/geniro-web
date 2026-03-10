# UserPreferencesApi

All URIs are relative to _http://localhost_

| Method                                      | HTTP request                     | Description |
| ------------------------------------------- | -------------------------------- | ----------- |
| [**getPreferences**](#getpreferences)       | **GET** /api/v1/user-preferences |             |
| [**updatePreferences**](#updatepreferences) | **PUT** /api/v1/user-preferences |             |

# **getPreferences**

> UserPreferencesDto getPreferences()

### Example

```typescript
import { UserPreferencesApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new UserPreferencesApi(configuration);

const { status, data } = await apiInstance.getPreferences();
```

### Parameters

This endpoint does not have any parameters.

### Return type

**UserPreferencesDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updatePreferences**

> UserPreferencesDto updatePreferences(updateUserPreferencesDto)

### Example

```typescript
import {
  UserPreferencesApi,
  Configuration,
  UpdateUserPreferencesDto,
} from './api';

const configuration = new Configuration();
const apiInstance = new UserPreferencesApi(configuration);

let updateUserPreferencesDto: UpdateUserPreferencesDto; //

const { status, data } = await apiInstance.updatePreferences(
  updateUserPreferencesDto,
);
```

### Parameters

| Name                         | Type                         | Description | Notes |
| ---------------------------- | ---------------------------- | ----------- | ----- |
| **updateUserPreferencesDto** | **UpdateUserPreferencesDto** |             |       |

### Return type

**UserPreferencesDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)
