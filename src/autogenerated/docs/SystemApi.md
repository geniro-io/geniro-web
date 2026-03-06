# SystemApi

All URIs are relative to _http://localhost_

| Method                              | HTTP request                    | Description                                                                                                                                                                                                              |
| ----------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [**getAuthConfig**](#getauthconfig) | **GET** /api/v1/system/config   | Public endpoint (no @OnlyForAuthorized) — intentionally unauthenticated. Returns OIDC provider config needed by the frontend before login. Only expose non-sensitive values here (provider type, issuer URL, client ID). |
| [**getSettings**](#getsettings)     | **GET** /api/v1/system/settings |                                                                                                                                                                                                                          |

# **getAuthConfig**

> AuthConfigResponseDto getAuthConfig()

### Example

```typescript
import { SystemApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new SystemApi(configuration);

const { status, data } = await apiInstance.getAuthConfig();
```

### Parameters

This endpoint does not have any parameters.

### Return type

**AuthConfigResponseDto**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getSettings**

> SystemSettingsResponseDto getSettings()

### Example

```typescript
import { SystemApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new SystemApi(configuration);

const { status, data } = await apiInstance.getSettings();
```

### Parameters

This endpoint does not have any parameters.

### Return type

**SystemSettingsResponseDto**

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
