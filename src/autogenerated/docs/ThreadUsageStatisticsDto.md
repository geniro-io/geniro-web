# ThreadUsageStatisticsDto

## Properties

| Name                 | Type                                                                                                  | Description                                                           | Notes                  |
| -------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ---------------------- |
| **total**            | [**ThreadUsageStatisticsDtoTotal**](ThreadUsageStatisticsDtoTotal.md)                                 |                                                                       | [default to undefined] |
| **requests**         | **number**                                                                                            | Total number of requests (messages with requestTokenUsage)            | [default to undefined] |
| **byNode**           | [**{ [key: string]: ThreadUsageStatisticsDtoByNodeValue; }**](ThreadUsageStatisticsDtoByNodeValue.md) | Usage statistics breakdown by node ID                                 | [default to undefined] |
| **byTool**           | [**Array&lt;ThreadUsageStatisticsDtoSchema0&gt;**](ThreadUsageStatisticsDtoSchema0.md)                | Usage statistics breakdown by tool name                               | [default to undefined] |
| **toolsAggregate**   | [**ThreadUsageStatisticsDtoToolsAggregate**](ThreadUsageStatisticsDtoToolsAggregate.md)               |                                                                       | [default to undefined] |
| **userMessageCount** | **number**                                                                                            | Number of user (human) messages in the thread                         | [default to undefined] |
| **modelsUsed**       | **Array&lt;string&gt;**                                                                               | Distinct LLM model identifiers used across all messages in the thread | [default to undefined] |

## Example

```typescript
import { ThreadUsageStatisticsDto } from './api';

const instance: ThreadUsageStatisticsDto = {
  total,
  requests,
  byNode,
  byTool,
  toolsAggregate,
  userMessageCount,
  modelsUsed,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
