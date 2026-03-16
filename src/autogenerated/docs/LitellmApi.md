# LitellmApi

All URIs are relative to _http://localhost_

| Method                                          | HTTP request                                    | Description                                                  |
| ----------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------ |
| [**createCredential**](#createcredential)       | **POST** /api/v1/litellm/credentials            | Create a new named credential                                |
| [**createModel**](#createmodel)                 | **POST** /api/v1/litellm/models                 | Add a new LiteLLM model                                      |
| [**deleteCredential**](#deletecredential)       | **DELETE** /api/v1/litellm/credentials/{name}   | Delete a named credential                                    |
| [**deleteModel**](#deletemodel)                 | **DELETE** /api/v1/litellm/models/{id}          | Delete a LiteLLM model by database ID                        |
| [**getModelDefaults**](#getmodeldefaults)       | **GET** /api/v1/litellm/model-defaults          |                                                              |
| [**listCredentials**](#listcredentials)         | **GET** /api/v1/litellm/credentials             | List saved LiteLLM credentials                               |
| [**listModels**](#listmodels)                   | **GET** /api/v1/litellm/models                  |                                                              |
| [**listModelsInfo**](#listmodelsinfo)           | **GET** /api/v1/litellm/models/info             | List all LiteLLM models with full config (admin)             |
| [**listProviders**](#listproviders)             | **GET** /api/v1/litellm/providers               | List available LLM providers                                 |
| [**testModel**](#testmodel)                     | **POST** /api/v1/litellm/models/test            | Test a registered model connection                           |
| [**testModelConnection**](#testmodelconnection) | **POST** /api/v1/litellm/models/test-connection | Test a model connection with inline config (no registration) |
| [**updateModel**](#updatemodel)                 | **PATCH** /api/v1/litellm/models                | Update an existing LiteLLM model                             |

# **createCredential**

> createCredential(createLiteLlmCredentialDto)

### Example

```typescript
import { LitellmApi, Configuration, CreateLiteLlmCredentialDto } from './api';

const configuration = new Configuration();
const apiInstance = new LitellmApi(configuration);

let createLiteLlmCredentialDto: CreateLiteLlmCredentialDto; //

const { status, data } = await apiInstance.createCredential(
  createLiteLlmCredentialDto,
);
```

### Parameters

| Name                           | Type                           | Description | Notes |
| ------------------------------ | ------------------------------ | ----------- | ----- |
| **createLiteLlmCredentialDto** | **CreateLiteLlmCredentialDto** |             |       |

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **201**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createModel**

> createModel(createLiteLlmModelDto)

### Example

```typescript
import { LitellmApi, Configuration, CreateLiteLlmModelDto } from './api';

const configuration = new Configuration();
const apiInstance = new LitellmApi(configuration);

let createLiteLlmModelDto: CreateLiteLlmModelDto; //

const { status, data } = await apiInstance.createModel(createLiteLlmModelDto);
```

### Parameters

| Name                      | Type                      | Description | Notes |
| ------------------------- | ------------------------- | ----------- | ----- |
| **createLiteLlmModelDto** | **CreateLiteLlmModelDto** |             |       |

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **201**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteCredential**

> deleteCredential()

### Example

```typescript
import { LitellmApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new LitellmApi(configuration);

let name: string; // (default to undefined)

const { status, data } = await apiInstance.deleteCredential(name);
```

### Parameters

| Name     | Type         | Description | Notes                 |
| -------- | ------------ | ----------- | --------------------- |
| **name** | [**string**] |             | defaults to undefined |

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteModel**

> deleteModel()

### Example

```typescript
import { LitellmApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new LitellmApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.deleteModel(id);
```

### Parameters

| Name   | Type         | Description | Notes                 |
| ------ | ------------ | ----------- | --------------------- |
| **id** | [**string**] |             | defaults to undefined |

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getModelDefaults**

> ModelDefaultsDto getModelDefaults()

### Example

```typescript
import { LitellmApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new LitellmApi(configuration);

const { status, data } = await apiInstance.getModelDefaults();
```

### Parameters

This endpoint does not have any parameters.

### Return type

**ModelDefaultsDto**

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

# **listCredentials**

> LiteLlmCredentialsResponseDto listCredentials()

### Example

```typescript
import { LitellmApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new LitellmApi(configuration);

const { status, data } = await apiInstance.listCredentials();
```

### Parameters

This endpoint does not have any parameters.

### Return type

**LiteLlmCredentialsResponseDto**

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

# **listModels**

> Array<LiteLlmModelDto> listModels()

### Example

```typescript
import { LitellmApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new LitellmApi(configuration);

const { status, data } = await apiInstance.listModels();
```

### Parameters

This endpoint does not have any parameters.

### Return type

**Array<LiteLlmModelDto>**

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

# **listModelsInfo**

> Array<LiteLlmModelInfoItemDto> listModelsInfo()

### Example

```typescript
import { LitellmApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new LitellmApi(configuration);

const { status, data } = await apiInstance.listModelsInfo();
```

### Parameters

This endpoint does not have any parameters.

### Return type

**Array<LiteLlmModelInfoItemDto>**

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

# **listProviders**

> LiteLlmProvidersResponseDto listProviders()

### Example

```typescript
import { LitellmApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new LitellmApi(configuration);

const { status, data } = await apiInstance.listProviders();
```

### Parameters

This endpoint does not have any parameters.

### Return type

**LiteLlmProvidersResponseDto**

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

# **testModel**

> TestModelResponseDto testModel(testModelRequestDto)

### Example

```typescript
import { LitellmApi, Configuration, TestModelRequestDto } from './api';

const configuration = new Configuration();
const apiInstance = new LitellmApi(configuration);

let testModelRequestDto: TestModelRequestDto; //

const { status, data } = await apiInstance.testModel(testModelRequestDto);
```

### Parameters

| Name                    | Type                    | Description | Notes |
| ----------------------- | ----------------------- | ----------- | ----- |
| **testModelRequestDto** | **TestModelRequestDto** |             |       |

### Return type

**TestModelResponseDto**

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

# **testModelConnection**

> TestModelResponseDto testModelConnection(testModelConnectionDto)

### Example

```typescript
import { LitellmApi, Configuration, TestModelConnectionDto } from './api';

const configuration = new Configuration();
const apiInstance = new LitellmApi(configuration);

let testModelConnectionDto: TestModelConnectionDto; //

const { status, data } = await apiInstance.testModelConnection(
  testModelConnectionDto,
);
```

### Parameters

| Name                       | Type                       | Description | Notes |
| -------------------------- | -------------------------- | ----------- | ----- |
| **testModelConnectionDto** | **TestModelConnectionDto** |             |       |

### Return type

**TestModelResponseDto**

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

# **updateModel**

> updateModel(updateLiteLlmModelDto)

### Example

```typescript
import { LitellmApi, Configuration, UpdateLiteLlmModelDto } from './api';

const configuration = new Configuration();
const apiInstance = new LitellmApi(configuration);

let updateLiteLlmModelDto: UpdateLiteLlmModelDto; //

const { status, data } = await apiInstance.updateModel(updateLiteLlmModelDto);
```

### Parameters

| Name                      | Type                      | Description | Notes |
| ------------------------- | ------------------------- | ----------- | ----- |
| **updateLiteLlmModelDto** | **UpdateLiteLlmModelDto** |             |       |

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)
