# GitRepositoriesApi

All URIs are relative to _http://localhost_

| Method                                                        | HTTP request                                | Description |
| ------------------------------------------------------------- | ------------------------------------------- | ----------- |
| [**createRepository**](#createrepository)                     | **POST** /api/v1/git-repositories           |             |
| [**deleteRepository**](#deleterepository)                     | **DELETE** /api/v1/git-repositories/{id}    |             |
| [**getRepoIndexByRepositoryId**](#getrepoindexbyrepositoryid) | **GET** /api/v1/git-repositories/{id}/index |             |
| [**getRepoIndexes**](#getrepoindexes)                         | **GET** /api/v1/git-repositories/indexes    |             |
| [**getRepositories**](#getrepositories)                       | **GET** /api/v1/git-repositories            |             |
| [**getRepositoryById**](#getrepositorybyid)                   | **GET** /api/v1/git-repositories/{id}       |             |
| [**syncRepositories**](#syncrepositories)                     | **POST** /api/v1/git-repositories/sync      |             |
| [**triggerReindex**](#triggerreindex)                         | **POST** /api/v1/git-repositories/reindex   |             |
| [**updateRepository**](#updaterepository)                     | **PATCH** /api/v1/git-repositories/{id}     |             |

# **createRepository**

> GitRepositoryDto createRepository(createRepositoryDto)

### Example

```typescript
import { GitRepositoriesApi, Configuration, CreateRepositoryDto } from './api';

const configuration = new Configuration();
const apiInstance = new GitRepositoriesApi(configuration);

let createRepositoryDto: CreateRepositoryDto; //

const { status, data } =
  await apiInstance.createRepository(createRepositoryDto);
```

### Parameters

| Name                    | Type                    | Description | Notes |
| ----------------------- | ----------------------- | ----------- | ----- |
| **createRepositoryDto** | **CreateRepositoryDto** |             |       |

### Return type

**GitRepositoryDto**

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

# **deleteRepository**

> deleteRepository()

### Example

```typescript
import { GitRepositoriesApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new GitRepositoriesApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.deleteRepository(id);
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

# **getRepoIndexByRepositoryId**

> object getRepoIndexByRepositoryId()

### Example

```typescript
import { GitRepositoriesApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new GitRepositoriesApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getRepoIndexByRepositoryId(id);
```

### Parameters

| Name   | Type         | Description | Notes                 |
| ------ | ------------ | ----------- | --------------------- |
| **id** | [**string**] |             | defaults to undefined |

### Return type

**object**

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

# **getRepoIndexes**

> Array<RepoIndexDto> getRepoIndexes()

### Example

```typescript
import {
  GitRepositoriesApi,
  Configuration,
  GetRepoIndexesBranchesParameter,
} from './api';

const configuration = new Configuration();
const apiInstance = new GitRepositoriesApi(configuration);

let repositoryId: string; //Filter by repository ID (optional) (default to undefined)
let branch: string; //Filter by single branch name (optional) (default to undefined)
let branches: GetRepoIndexesBranchesParameter; //Filter by multiple branch names (comma-separated or repeated query param) (optional) (default to undefined)
let status: 'pending' | 'in_progress' | 'completed' | 'failed'; //Filter by status (optional) (default to undefined)
let limit: number; //Maximum number of indexes to return (optional) (default to 50)
let offset: number; //Number of indexes to skip (optional) (default to 0)

const { status, data } = await apiInstance.getRepoIndexes(
  repositoryId,
  branch,
  branches,
  status,
  limit,
  offset,
);
```

### Parameters

| Name             | Type                                | Description                                                               | Notes                            |
| ---------------- | ----------------------------------- | ------------------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------- | -------------------------------- |
| **repositoryId** | [**string**]                        | Filter by repository ID                                                   | (optional) defaults to undefined |
| **branch**       | [**string**]                        | Filter by single branch name                                              | (optional) defaults to undefined |
| **branches**     | **GetRepoIndexesBranchesParameter** | Filter by multiple branch names (comma-separated or repeated query param) | (optional) defaults to undefined |
| **status**       | [\*\*&#39;pending&#39;              | &#39;in_progress&#39;                                                     | &#39;completed&#39;              | &#39;failed&#39;**]**Array<&#39;pending&#39; &#124; &#39;in_progress&#39; &#124; &#39;completed&#39; &#124; &#39;failed&#39;>\*\* | Filter by status | (optional) defaults to undefined |
| **limit**        | [**number**]                        | Maximum number of indexes to return                                       | (optional) defaults to 50        |
| **offset**       | [**number**]                        | Number of indexes to skip                                                 | (optional) defaults to 0         |

### Return type

**Array<RepoIndexDto>**

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

# **getRepositories**

> Array<GitRepositoryDto> getRepositories()

### Example

```typescript
import { GitRepositoriesApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new GitRepositoriesApi(configuration);

let owner: string; //Filter by repository owner (optional) (default to undefined)
let repo: string; //Filter by repository name (optional) (default to undefined)
let provider: 'GITHUB'; //Filter by host provider (optional) (default to undefined)
let installationId: number; //Filter by GitHub App installation ID (optional) (default to undefined)
let limit: number; //Maximum number of repositories to return (optional) (default to 50)
let offset: number; //Number of repositories to skip (optional) (default to 0)

const { status, data } = await apiInstance.getRepositories(
  owner,
  repo,
  provider,
  installationId,
  limit,
  offset,
);
```

### Parameters

| Name               | Type                                              | Description                              | Notes                            |
| ------------------ | ------------------------------------------------- | ---------------------------------------- | -------------------------------- |
| **owner**          | [**string**]                                      | Filter by repository owner               | (optional) defaults to undefined |
| **repo**           | [**string**]                                      | Filter by repository name                | (optional) defaults to undefined |
| **provider**       | [**&#39;GITHUB&#39;**]**Array<&#39;GITHUB&#39;>** | Filter by host provider                  | (optional) defaults to undefined |
| **installationId** | [**number**]                                      | Filter by GitHub App installation ID     | (optional) defaults to undefined |
| **limit**          | [**number**]                                      | Maximum number of repositories to return | (optional) defaults to 50        |
| **offset**         | [**number**]                                      | Number of repositories to skip           | (optional) defaults to 0         |

### Return type

**Array<GitRepositoryDto>**

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

# **getRepositoryById**

> GitRepositoryDto getRepositoryById()

### Example

```typescript
import { GitRepositoriesApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new GitRepositoriesApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.getRepositoryById(id);
```

### Parameters

| Name   | Type         | Description | Notes                 |
| ------ | ------------ | ----------- | --------------------- |
| **id** | [**string**] |             | defaults to undefined |

### Return type

**GitRepositoryDto**

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

# **syncRepositories**

> SyncRepositoriesResponseDto syncRepositories()

### Example

```typescript
import { GitRepositoriesApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new GitRepositoriesApi(configuration);

const { status, data } = await apiInstance.syncRepositories();
```

### Parameters

This endpoint does not have any parameters.

### Return type

**SyncRepositoriesResponseDto**

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

# **triggerReindex**

> TriggerReindexResponseDto triggerReindex(triggerReindexDto)

### Example

```typescript
import { GitRepositoriesApi, Configuration, TriggerReindexDto } from './api';

const configuration = new Configuration();
const apiInstance = new GitRepositoriesApi(configuration);

let triggerReindexDto: TriggerReindexDto; //

const { status, data } = await apiInstance.triggerReindex(triggerReindexDto);
```

### Parameters

| Name                  | Type                  | Description | Notes |
| --------------------- | --------------------- | ----------- | ----- |
| **triggerReindexDto** | **TriggerReindexDto** |             |       |

### Return type

**TriggerReindexResponseDto**

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

# **updateRepository**

> GitRepositoryDto updateRepository(updateRepositoryDto)

### Example

```typescript
import { GitRepositoriesApi, Configuration, UpdateRepositoryDto } from './api';

const configuration = new Configuration();
const apiInstance = new GitRepositoriesApi(configuration);

let id: string; // (default to undefined)
let updateRepositoryDto: UpdateRepositoryDto; //

const { status, data } = await apiInstance.updateRepository(
  id,
  updateRepositoryDto,
);
```

### Parameters

| Name                    | Type                    | Description | Notes                 |
| ----------------------- | ----------------------- | ----------- | --------------------- |
| **updateRepositoryDto** | **UpdateRepositoryDto** |             |                       |
| **id**                  | [**string**]            |             | defaults to undefined |

### Return type

**GitRepositoryDto**

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
