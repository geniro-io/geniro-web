# GraphsApi

All URIs are relative to _http://localhost_

| Method                                                    | HTTP request                                                          | Description |
| --------------------------------------------------------- | --------------------------------------------------------------------- | ----------- |
| [**analyzeThread**](#analyzethread)                       | **POST** /api/v1/threads/{threadId}/analyze                           |             |
| [**createGraph**](#creategraph)                           | **POST** /api/v1/graphs                                               |             |
| [**deleteGraph**](#deletegraph)                           | **DELETE** /api/v1/graphs/{id}                                        |             |
| [**destroyGraph**](#destroygraph)                         | **POST** /api/v1/graphs/{id}/destroy                                  |             |
| [**executeTrigger**](#executetrigger)                     | **POST** /api/v1/graphs/{graphId}/triggers/{triggerId}/execute        |             |
| [**findGraphById**](#findgraphbyid)                       | **GET** /api/v1/graphs/{id}                                           |             |
| [**getAllGraphs**](#getallgraphs)                         | **GET** /api/v1/graphs                                                |             |
| [**getCompiledNodes**](#getcompilednodes)                 | **GET** /api/v1/graphs/{id}/nodes                                     |             |
| [**getGraphsPreview**](#getgraphspreview)                 | **GET** /api/v1/graphs/preview                                        |             |
| [**runGraph**](#rungraph)                                 | **POST** /api/v1/graphs/{id}/run                                      |             |
| [**suggestAgentInstructions**](#suggestagentinstructions) | **POST** /api/v1/graphs/{graphId}/nodes/{nodeId}/suggest-instructions |             |
| [**suggestGraphInstructions**](#suggestgraphinstructions) | **POST** /api/v1/graphs/{graphId}/suggest-instructions                |             |
| [**suggestKnowledgeContent**](#suggestknowledgecontent)   | **POST** /api/v1/knowledge-docs/suggest                               |             |
| [**updateGraph**](#updategraph)                           | **PUT** /api/v1/graphs/{id}                                           |             |

# **analyzeThread**

> ThreadAnalysisResponseDto analyzeThread(threadAnalysisRequestDto)

### Example

```typescript
import { GraphsApi, Configuration, ThreadAnalysisRequestDto } from './api';

const configuration = new Configuration();
const apiInstance = new GraphsApi(configuration);

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

# **createGraph**

> GraphDto createGraph(createGraphDto)

### Example

```typescript
import { GraphsApi, Configuration, CreateGraphDto } from './api';

const configuration = new Configuration();
const apiInstance = new GraphsApi(configuration);

let createGraphDto: CreateGraphDto; //

const { status, data } = await apiInstance.createGraph(createGraphDto);
```

### Parameters

| Name               | Type               | Description | Notes |
| ------------------ | ------------------ | ----------- | ----- |
| **createGraphDto** | **CreateGraphDto** |             |       |

### Return type

**GraphDto**

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

# **deleteGraph**

> deleteGraph()

### Example

```typescript
import { GraphsApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new GraphsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.deleteGraph(id);
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

# **destroyGraph**

> GraphDto destroyGraph()

### Example

```typescript
import { GraphsApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new GraphsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.destroyGraph(id);
```

### Parameters

| Name   | Type         | Description | Notes                 |
| ------ | ------------ | ----------- | --------------------- |
| **id** | [**string**] |             | defaults to undefined |

### Return type

**GraphDto**

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

# **executeTrigger**

> ExecuteTriggerResponseDto executeTrigger(executeTriggerDto)

### Example

```typescript
import { GraphsApi, Configuration, ExecuteTriggerDto } from './api';

const configuration = new Configuration();
const apiInstance = new GraphsApi(configuration);

let graphId: string; // (default to undefined)
let triggerId: string; // (default to undefined)
let executeTriggerDto: ExecuteTriggerDto; //

const { status, data } = await apiInstance.executeTrigger(
  graphId,
  triggerId,
  executeTriggerDto,
);
```

### Parameters

| Name                  | Type                  | Description | Notes                 |
| --------------------- | --------------------- | ----------- | --------------------- |
| **executeTriggerDto** | **ExecuteTriggerDto** |             |                       |
| **graphId**           | [**string**]          |             | defaults to undefined |
| **triggerId**         | [**string**]          |             | defaults to undefined |

### Return type

**ExecuteTriggerResponseDto**

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

# **findGraphById**

> GraphDto findGraphById()

### Example

```typescript
import { GraphsApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new GraphsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.findGraphById(id);
```

### Parameters

| Name   | Type         | Description | Notes                 |
| ------ | ------------ | ----------- | --------------------- |
| **id** | [**string**] |             | defaults to undefined |

### Return type

**GraphDto**

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

# **getAllGraphs**

> Array<GraphDto> getAllGraphs()

### Example

```typescript
import { GraphsApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new GraphsApi(configuration);

let ids: Array<string>; //Filter graphs by IDs (comma-separated or repeated params) (optional) (default to undefined)

const { status, data } = await apiInstance.getAllGraphs(ids);
```

### Parameters

| Name    | Type                    | Description                                               | Notes                            |
| ------- | ----------------------- | --------------------------------------------------------- | -------------------------------- |
| **ids** | **Array&lt;string&gt;** | Filter graphs by IDs (comma-separated or repeated params) | (optional) defaults to undefined |

### Return type

**Array<GraphDto>**

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

# **getCompiledNodes**

> Array<GraphNodeWithStatusDto> getCompiledNodes()

### Example

```typescript
import { GraphsApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new GraphsApi(configuration);

let id: string; // (default to undefined)
let threadId: string; // (optional) (default to undefined)
let runId: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.getCompiledNodes(
  id,
  threadId,
  runId,
);
```

### Parameters

| Name         | Type         | Description | Notes                            |
| ------------ | ------------ | ----------- | -------------------------------- |
| **id**       | [**string**] |             | defaults to undefined            |
| **threadId** | [**string**] |             | (optional) defaults to undefined |
| **runId**    | [**string**] |             | (optional) defaults to undefined |

### Return type

**Array<GraphNodeWithStatusDto>**

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

# **getGraphsPreview**

> Array<GraphPreviewDto> getGraphsPreview()

### Example

```typescript
import { GraphsApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new GraphsApi(configuration);

let ids: Array<string>; //Filter graphs by IDs (comma-separated or repeated params) (optional) (default to undefined)

const { status, data } = await apiInstance.getGraphsPreview(ids);
```

### Parameters

| Name    | Type                    | Description                                               | Notes                            |
| ------- | ----------------------- | --------------------------------------------------------- | -------------------------------- |
| **ids** | **Array&lt;string&gt;** | Filter graphs by IDs (comma-separated or repeated params) | (optional) defaults to undefined |

### Return type

**Array<GraphPreviewDto>**

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

# **runGraph**

> GraphDto runGraph()

### Example

```typescript
import { GraphsApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new GraphsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.runGraph(id);
```

### Parameters

| Name   | Type         | Description | Notes                 |
| ------ | ------------ | ----------- | --------------------- |
| **id** | [**string**] |             | defaults to undefined |

### Return type

**GraphDto**

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
import { GraphsApi, Configuration, SuggestAgentInstructionsDto } from './api';

const configuration = new Configuration();
const apiInstance = new GraphsApi(configuration);

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
import { GraphsApi, Configuration, SuggestGraphInstructionsDto } from './api';

const configuration = new Configuration();
const apiInstance = new GraphsApi(configuration);

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
  GraphsApi,
  Configuration,
  KnowledgeContentSuggestionRequestDto,
} from './api';

const configuration = new Configuration();
const apiInstance = new GraphsApi(configuration);

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

# **updateGraph**

> UpdateGraphResponseDto updateGraph(updateGraphDto)

### Example

```typescript
import { GraphsApi, Configuration, UpdateGraphDto } from './api';

const configuration = new Configuration();
const apiInstance = new GraphsApi(configuration);

let id: string; // (default to undefined)
let updateGraphDto: UpdateGraphDto; //

const { status, data } = await apiInstance.updateGraph(id, updateGraphDto);
```

### Parameters

| Name               | Type               | Description | Notes                 |
| ------------------ | ------------------ | ----------- | --------------------- |
| **updateGraphDto** | **UpdateGraphDto** |             |                       |
| **id**             | [**string**]       |             | defaults to undefined |

### Return type

**UpdateGraphResponseDto**

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
