# GithubAppApi

All URIs are relative to _http://localhost_

| Method                                        | HTTP request                                                    | Description |
| --------------------------------------------- | --------------------------------------------------------------- | ----------- |
| [**getSetupInfo**](#getsetupinfo)             | **GET** /api/v1/github-app/setup                                |             |
| [**linkInstallation**](#linkinstallation)     | **POST** /api/v1/github-app/installations/{installationId}/link |             |
| [**linkViaOAuthCode**](#linkviaoauthcode)     | **POST** /api/v1/github-app/oauth/link                          |             |
| [**listInstallations**](#listinstallations)   | **GET** /api/v1/github-app/installations                        |             |
| [**unlinkInstallation**](#unlinkinstallation) | **DELETE** /api/v1/github-app/installations/{installationId}    |             |

# **getSetupInfo**

> SetupInfoResponseDto getSetupInfo()

### Example

```typescript
import { GithubAppApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new GithubAppApi(configuration);

const { status, data } = await apiInstance.getSetupInfo();
```

### Parameters

This endpoint does not have any parameters.

### Return type

**SetupInfoResponseDto**

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

# **linkInstallation**

> LinkInstallationResponseDto linkInstallation()

### Example

```typescript
import { GithubAppApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new GithubAppApi(configuration);

let installationId: string; // (default to undefined)

const { status, data } = await apiInstance.linkInstallation(installationId);
```

### Parameters

| Name               | Type         | Description | Notes                 |
| ------------------ | ------------ | ----------- | --------------------- |
| **installationId** | [**string**] |             | defaults to undefined |

### Return type

**LinkInstallationResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **201**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **linkViaOAuthCode**

> LinkInstallationResponseDto linkViaOAuthCode(oAuthLinkRequestDto)

### Example

```typescript
import { GithubAppApi, Configuration, OAuthLinkRequestDto } from './api';

const configuration = new Configuration();
const apiInstance = new GithubAppApi(configuration);

let oAuthLinkRequestDto: OAuthLinkRequestDto; //

const { status, data } =
  await apiInstance.linkViaOAuthCode(oAuthLinkRequestDto);
```

### Parameters

| Name                    | Type                    | Description | Notes |
| ----------------------- | ----------------------- | ----------- | ----- |
| **oAuthLinkRequestDto** | **OAuthLinkRequestDto** |             |       |

### Return type

**LinkInstallationResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **201**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listInstallations**

> ListInstallationsResponseDto listInstallations()

### Example

```typescript
import { GithubAppApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new GithubAppApi(configuration);

const { status, data } = await apiInstance.listInstallations();
```

### Parameters

This endpoint does not have any parameters.

### Return type

**ListInstallationsResponseDto**

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

# **unlinkInstallation**

> UnlinkInstallationResponseDto unlinkInstallation()

### Example

```typescript
import { GithubAppApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new GithubAppApi(configuration);

let installationId: string; // (default to undefined)

const { status, data } = await apiInstance.unlinkInstallation(installationId);
```

### Parameters

| Name               | Type         | Description | Notes                 |
| ------------------ | ------------ | ----------- | --------------------- |
| **installationId** | [**string**] |             | defaults to undefined |

### Return type

**UnlinkInstallationResponseDto**

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
