# SystemApi

All URIs are relative to _http://localhost_

| Method                          | HTTP request                    | Description |
| ------------------------------- | ------------------------------- | ----------- |
| [**getSettings**](#getsettings) | **GET** /api/v1/system/settings |             |

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
