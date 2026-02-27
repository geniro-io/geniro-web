# ProjectsApi

All URIs are relative to _http://localhost_

| Method                                  | HTTP request                     | Description |
| --------------------------------------- | -------------------------------- | ----------- |
| [**createProject**](#createproject)     | **POST** /api/v1/projects        |             |
| [**deleteProject**](#deleteproject)     | **DELETE** /api/v1/projects/{id} |             |
| [**findProjectById**](#findprojectbyid) | **GET** /api/v1/projects/{id}    |             |
| [**getAllProjects**](#getallprojects)   | **GET** /api/v1/projects         |             |
| [**updateProject**](#updateproject)     | **PUT** /api/v1/projects/{id}    |             |

# **createProject**

> ProjectDto createProject(createProjectDto)

### Example

```typescript
import { ProjectsApi, Configuration, CreateProjectDto } from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let createProjectDto: CreateProjectDto; //

const { status, data } = await apiInstance.createProject(createProjectDto);
```

### Parameters

| Name                 | Type                 | Description | Notes |
| -------------------- | -------------------- | ----------- | ----- |
| **createProjectDto** | **CreateProjectDto** |             |       |

### Return type

**ProjectDto**

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

# **deleteProject**

> deleteProject()

### Example

```typescript
import { ProjectsApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.deleteProject(id);
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
| **204**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **findProjectById**

> ProjectDto findProjectById()

### Example

```typescript
import { ProjectsApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.findProjectById(id);
```

### Parameters

| Name   | Type         | Description | Notes                 |
| ------ | ------------ | ----------- | --------------------- |
| **id** | [**string**] |             | defaults to undefined |

### Return type

**ProjectDto**

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

# **getAllProjects**

> Array<ProjectDto> getAllProjects()

### Example

```typescript
import { ProjectsApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

const { status, data } = await apiInstance.getAllProjects();
```

### Parameters

This endpoint does not have any parameters.

### Return type

**Array<ProjectDto>**

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

# **updateProject**

> ProjectDto updateProject(updateProjectDto)

### Example

```typescript
import { ProjectsApi, Configuration, UpdateProjectDto } from './api';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let id: string; // (default to undefined)
let updateProjectDto: UpdateProjectDto; //

const { status, data } = await apiInstance.updateProject(id, updateProjectDto);
```

### Parameters

| Name                 | Type                 | Description | Notes                 |
| -------------------- | -------------------- | ----------- | --------------------- |
| **updateProjectDto** | **UpdateProjectDto** |             |                       |
| **id**               | [**string**]         |             | defaults to undefined |

### Return type

**ProjectDto**

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
