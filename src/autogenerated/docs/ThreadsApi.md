# ThreadsApi

All URIs are relative to _http://localhost_

| Method                                                              | HTTP request                                                          | Description |
| ------------------------------------------------------------------- | --------------------------------------------------------------------- | ----------- |
| [**analyzeThread**](#analyzethread)                                 | **POST** /api/v1/threads/{threadId}/analyze                           |             |
| [**deleteThread**](#deletethread)                                   | **DELETE** /api/v1/threads/{threadId}                                 |             |
| [**exportThread**](#exportthread)                                   | **GET** /api/v1/threads/{threadId}/export                             |             |
| [**getThreadByExternalId**](#getthreadbyexternalid)                 | **GET** /api/v1/threads/external/{externalThreadId}                   |             |
| [**getThreadById**](#getthreadbyid)                                 | **GET** /api/v1/threads/{threadId}                                    |             |
| [**getThreadMessages**](#getthreadmessages)                         | **GET** /api/v1/threads/{threadId}/messages                           |             |
| [**getThreadUsageStatistics**](#getthreadusagestatistics)           | **GET** /api/v1/threads/{threadId}/usage-statistics                   |             |
| [**getThreads**](#getthreads)                                       | **GET** /api/v1/threads                                               |             |
| [**setThreadMetadata**](#setthreadmetadata)                         | **PUT** /api/v1/threads/{threadId}/metadata                           |             |
| [**setThreadMetadataByExternalId**](#setthreadmetadatabyexternalid) | **PUT** /api/v1/threads/external/{externalThreadId}/metadata          |             |
| [**stopThread**](#stopthread)                                       | **POST** /api/v1/threads/{threadId}/stop                              |             |
| [**stopThreadByExternalId**](#stopthreadbyexternalid)               | **POST** /api/v1/threads/external/{externalThreadId}/stop             |             |
| [**suggestAgentInstructions**](#suggestagentinstructions)           | **POST** /api/v1/graphs/{graphId}/nodes/{nodeId}/suggest-instructions |             |
| [**suggestGraphInstructions**](#suggestgraphinstructions)           | **POST** /api/v1/graphs/{graphId}/suggest-instructions                |             |
| [**suggestKnowledgeContent**](#suggestknowledgecontent)             | **POST** /api/v1/knowledge-docs/suggest                               |             |

# **analyzeThread**

> ThreadAnalysisResponseDto analyzeThread(threadAnalysisRequestDto)

### Example

```typescript
import { ThreadsApi, Configuration, ThreadAnalysisRequestDto } from './api';

const configuration = new Configuration();
const apiInstance = new ThreadsApi(configuration);

let threadId: string; // (default to undefined)
let threadAnalysisRequestDto: ThreadAnalysisRequestDto; //

const { status, data } = await apiInstance.analyzeThread(
  threadId,
  threadAnalysisRequestDto,
);
```

### Parameters

| Name                         | Type                         | Description | Notes                 |
| ---------------------------- | ---------------------------- | ----------- | --------------------- |
| **threadAnalysisRequestDto** | **ThreadAnalysisRequestDto** |             |                       |
| **threadId**                 | [**string**]                 |             | defaults to undefined |

### Return type

**ThreadAnalysisResponseDto**

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

# **deleteThread**

> deleteThread()

### Example

```typescript
import { ThreadsApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new ThreadsApi(configuration);

let threadId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteThread(threadId);
```

### Parameters

| Name         | Type         | Description | Notes                 |
| ------------ | ------------ | ----------- | --------------------- |
| **threadId** | [**string**] |             | defaults to undefined |

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

# **exportThread**

> exportThread()

### Example

```typescript
import { ThreadsApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new ThreadsApi(configuration);

let threadId: string; // (default to undefined)

const { status, data } = await apiInstance.exportThread(threadId);
```

### Parameters

| Name         | Type         | Description | Notes                 |
| ------------ | ------------ | ----------- | --------------------- |
| **threadId** | [**string**] |             | defaults to undefined |

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

# **getThreadByExternalId**

> ThreadDto getThreadByExternalId()

### Example

```typescript
import { ThreadsApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new ThreadsApi(configuration);

let externalThreadId: string; // (default to undefined)

const { status, data } =
  await apiInstance.getThreadByExternalId(externalThreadId);
```

### Parameters

| Name                 | Type         | Description | Notes                 |
| -------------------- | ------------ | ----------- | --------------------- |
| **externalThreadId** | [**string**] |             | defaults to undefined |

### Return type

**ThreadDto**

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

# **getThreadById**

> ThreadDto getThreadById()

### Example

```typescript
import { ThreadsApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new ThreadsApi(configuration);

let threadId: string; // (default to undefined)

const { status, data } = await apiInstance.getThreadById(threadId);
```

### Parameters

| Name         | Type         | Description | Notes                 |
| ------------ | ------------ | ----------- | --------------------- |
| **threadId** | [**string**] |             | defaults to undefined |

### Return type

**ThreadDto**

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

# **getThreadMessages**

> Array<ThreadMessageDto> getThreadMessages()

### Example

```typescript
import { ThreadsApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new ThreadsApi(configuration);

let threadId: string; // (default to undefined)
let nodeId: string; //Filter messages by node ID (agent node) (optional) (default to undefined)
let limit: number; //Maximum number of messages to return (optional) (default to 100)
let offset: number; //Number of messages to skip (optional) (default to 0)

const { status, data } = await apiInstance.getThreadMessages(
  threadId,
  nodeId,
  limit,
  offset,
);
```

### Parameters

| Name         | Type         | Description                             | Notes                            |
| ------------ | ------------ | --------------------------------------- | -------------------------------- |
| **threadId** | [**string**] |                                         | defaults to undefined            |
| **nodeId**   | [**string**] | Filter messages by node ID (agent node) | (optional) defaults to undefined |
| **limit**    | [**number**] | Maximum number of messages to return    | (optional) defaults to 100       |
| **offset**   | [**number**] | Number of messages to skip              | (optional) defaults to 0         |

### Return type

**Array<ThreadMessageDto>**

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

# **getThreadUsageStatistics**

> ThreadUsageStatisticsDto getThreadUsageStatistics()

### Example

```typescript
import { ThreadsApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new ThreadsApi(configuration);

let threadId: string; // (default to undefined)

const { status, data } = await apiInstance.getThreadUsageStatistics(threadId);
```

### Parameters

| Name         | Type         | Description | Notes                 |
| ------------ | ------------ | ----------- | --------------------- |
| **threadId** | [**string**] |             | defaults to undefined |

### Return type

**ThreadUsageStatisticsDto**

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

# **getThreads**

> Array<ThreadDto> getThreads()

### Example

```typescript
import { ThreadsApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new ThreadsApi(configuration);

let graphId: string; //Filter by graph ID (optional) (default to undefined)
let statuses: Array<'running' | 'done' | 'need_more_info' | 'stopped'>; //Filter by thread statuses (optional) (default to undefined)
let limit: number; //Maximum number of threads to return (optional) (default to 50)
let offset: number; //Number of threads to skip (optional) (default to 0)

const { status, data } = await apiInstance.getThreads(
  graphId,
  statuses,
  limit,
  offset,
);
```

### Parameters

| Name         | Type                                                                                                        | Description                         | Notes                            |
| ------------ | ----------------------------------------------------------------------------------------------------------- | ----------------------------------- | -------------------------------- |
| **graphId**  | [**string**]                                                                                                | Filter by graph ID                  | (optional) defaults to undefined |
| **statuses** | **Array<&#39;running&#39; &#124; &#39;done&#39; &#124; &#39;need_more_info&#39; &#124; &#39;stopped&#39;>** | Filter by thread statuses           | (optional) defaults to undefined |
| **limit**    | [**number**]                                                                                                | Maximum number of threads to return | (optional) defaults to 50        |
| **offset**   | [**number**]                                                                                                | Number of threads to skip           | (optional) defaults to 0         |

### Return type

**Array<ThreadDto>**

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

# **setThreadMetadata**

> ThreadDto setThreadMetadata(setThreadMetadataDto)

### Example

```typescript
import { ThreadsApi, Configuration, SetThreadMetadataDto } from './api';

const configuration = new Configuration();
const apiInstance = new ThreadsApi(configuration);

let threadId: string; // (default to undefined)
let setThreadMetadataDto: SetThreadMetadataDto; //

const { status, data } = await apiInstance.setThreadMetadata(
  threadId,
  setThreadMetadataDto,
);
```

### Parameters

| Name                     | Type                     | Description | Notes                 |
| ------------------------ | ------------------------ | ----------- | --------------------- |
| **setThreadMetadataDto** | **SetThreadMetadataDto** |             |                       |
| **threadId**             | [**string**]             |             | defaults to undefined |

### Return type

**ThreadDto**

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

# **setThreadMetadataByExternalId**

> ThreadDto setThreadMetadataByExternalId(setThreadMetadataDto)

### Example

```typescript
import { ThreadsApi, Configuration, SetThreadMetadataDto } from './api';

const configuration = new Configuration();
const apiInstance = new ThreadsApi(configuration);

let externalThreadId: string; // (default to undefined)
let setThreadMetadataDto: SetThreadMetadataDto; //

const { status, data } = await apiInstance.setThreadMetadataByExternalId(
  externalThreadId,
  setThreadMetadataDto,
);
```

### Parameters

| Name                     | Type                     | Description | Notes                 |
| ------------------------ | ------------------------ | ----------- | --------------------- |
| **setThreadMetadataDto** | **SetThreadMetadataDto** |             |                       |
| **externalThreadId**     | [**string**]             |             | defaults to undefined |

### Return type

**ThreadDto**

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

# **stopThread**

> ThreadDto stopThread()

### Example

```typescript
import { ThreadsApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new ThreadsApi(configuration);

let threadId: string; // (default to undefined)

const { status, data } = await apiInstance.stopThread(threadId);
```

### Parameters

| Name         | Type         | Description | Notes                 |
| ------------ | ------------ | ----------- | --------------------- |
| **threadId** | [**string**] |             | defaults to undefined |

### Return type

**ThreadDto**

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

# **stopThreadByExternalId**

> ThreadDto stopThreadByExternalId()

### Example

```typescript
import { ThreadsApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new ThreadsApi(configuration);

let externalThreadId: string; // (default to undefined)

const { status, data } =
  await apiInstance.stopThreadByExternalId(externalThreadId);
```

### Parameters

| Name                 | Type         | Description | Notes                 |
| -------------------- | ------------ | ----------- | --------------------- |
| **externalThreadId** | [**string**] |             | defaults to undefined |

### Return type

**ThreadDto**

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

# **suggestAgentInstructions**

> SuggestAgentInstructionsResponseDto suggestAgentInstructions(suggestAgentInstructionsDto)

### Example

```typescript
import { ThreadsApi, Configuration, SuggestAgentInstructionsDto } from './api';

const configuration = new Configuration();
const apiInstance = new ThreadsApi(configuration);

let graphId: string; // (default to undefined)
let nodeId: string; // (default to undefined)
let suggestAgentInstructionsDto: SuggestAgentInstructionsDto; //

const { status, data } = await apiInstance.suggestAgentInstructions(
  graphId,
  nodeId,
  suggestAgentInstructionsDto,
);
```

### Parameters

| Name                            | Type                            | Description | Notes                 |
| ------------------------------- | ------------------------------- | ----------- | --------------------- |
| **suggestAgentInstructionsDto** | **SuggestAgentInstructionsDto** |             |                       |
| **graphId**                     | [**string**]                    |             | defaults to undefined |
| **nodeId**                      | [**string**]                    |             | defaults to undefined |

### Return type

**SuggestAgentInstructionsResponseDto**

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

# **suggestGraphInstructions**

> SuggestGraphInstructionsResponseDto suggestGraphInstructions(suggestGraphInstructionsDto)

### Example

```typescript
import { ThreadsApi, Configuration, SuggestGraphInstructionsDto } from './api';

const configuration = new Configuration();
const apiInstance = new ThreadsApi(configuration);

let graphId: string; // (default to undefined)
let suggestGraphInstructionsDto: SuggestGraphInstructionsDto; //

const { status, data } = await apiInstance.suggestGraphInstructions(
  graphId,
  suggestGraphInstructionsDto,
);
```

### Parameters

| Name                            | Type                            | Description | Notes                 |
| ------------------------------- | ------------------------------- | ----------- | --------------------- |
| **suggestGraphInstructionsDto** | **SuggestGraphInstructionsDto** |             |                       |
| **graphId**                     | [**string**]                    |             | defaults to undefined |

### Return type

**SuggestGraphInstructionsResponseDto**

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

# **suggestKnowledgeContent**

> KnowledgeContentSuggestionResponseDto suggestKnowledgeContent(knowledgeContentSuggestionRequestDto)

### Example

```typescript
import {
  ThreadsApi,
  Configuration,
  KnowledgeContentSuggestionRequestDto,
} from './api';

const configuration = new Configuration();
const apiInstance = new ThreadsApi(configuration);

let knowledgeContentSuggestionRequestDto: KnowledgeContentSuggestionRequestDto; //

const { status, data } = await apiInstance.suggestKnowledgeContent(
  knowledgeContentSuggestionRequestDto,
);
```

### Parameters

| Name                                     | Type                                     | Description | Notes |
| ---------------------------------------- | ---------------------------------------- | ----------- | ----- |
| **knowledgeContentSuggestionRequestDto** | **KnowledgeContentSuggestionRequestDto** |             |       |

### Return type

**KnowledgeContentSuggestionResponseDto**

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
