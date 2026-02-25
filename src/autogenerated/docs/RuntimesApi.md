# RuntimesApi

All URIs are relative to _http://localhost_

| Method                          | HTTP request             | Description |
| ------------------------------- | ------------------------ | ----------- |
| [**getRuntimes**](#getruntimes) | **GET** /api/v1/runtimes |             |

# **getRuntimes**

> Array<RuntimeInstanceDto> getRuntimes()

### Example

```typescript
import { RuntimesApi, Configuration } from './api';

const configuration = new Configuration();
const apiInstance = new RuntimesApi(configuration);

let threadId: string; //Filter by thread ID (default to undefined)
let status: 'Starting' | 'Running' | 'Stopping' | 'Stopped' | 'Failed'; //Filter by runtime instance status (optional) (default to undefined)

const { status, data } = await apiInstance.getRuntimes(threadId, status);
```

### Parameters

| Name         | Type                    | Description         | Notes                 |
| ------------ | ----------------------- | ------------------- | --------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- | -------------------------------- |
| **threadId** | [**string**]            | Filter by thread ID | defaults to undefined |
| **status**   | [\*\*&#39;Starting&#39; | &#39;Running&#39;   | &#39;Stopping&#39;    | &#39;Stopped&#39; | &#39;Failed&#39;**]**Array<&#39;Starting&#39; &#124; &#39;Running&#39; &#124; &#39;Stopping&#39; &#124; &#39;Stopped&#39; &#124; &#39;Failed&#39;>\*\* | Filter by runtime instance status | (optional) defaults to undefined |

### Return type

**Array<RuntimeInstanceDto>**

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
