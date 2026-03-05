# GraphPreviewDto

## Properties

| Name                 | Type                                                                                     | Description                                           | Notes                             |
| -------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------- | --------------------------------- |
| **id**               | **string**                                                                               |                                                       | [default to undefined]            |
| **name**             | **string**                                                                               |                                                       | [default to undefined]            |
| **description**      | **string**                                                                               |                                                       | [optional] [default to undefined] |
| **error**            | **string**                                                                               |                                                       | [optional] [default to undefined] |
| **version**          | **string**                                                                               |                                                       | [default to undefined]            |
| **targetVersion**    | **string**                                                                               | Target version after all queued revisions are applied | [default to undefined]            |
| **status**           | **string**                                                                               |                                                       | [default to undefined]            |
| **runningThreads**   | **number**                                                                               |                                                       | [optional] [default to 0]         |
| **totalThreads**     | **number**                                                                               |                                                       | [optional] [default to 0]         |
| **nodeCount**        | **number**                                                                               | Number of nodes in the graph schema                   | [optional] [default to 0]         |
| **edgeCount**        | **number**                                                                               | Number of edges in the graph schema                   | [optional] [default to 0]         |
| **agents**           | [**Array&lt;GraphPreviewDtoAgentsInner&gt;**](GraphPreviewDtoAgentsInner.md)             | Agent nodes present in the graph                      | [optional] [default to undefined] |
| **triggerNodes**     | [**Array&lt;GraphPreviewDtoTriggerNodesInner&gt;**](GraphPreviewDtoTriggerNodesInner.md) | Pre-computed trigger nodes from schema                | [default to undefined]            |
| **nodeDisplayNames** | **{ [key: string]: string; }**                                                           | Pre-computed node display names from metadata         | [default to undefined]            |
| **createdAt**        | **string**                                                                               |                                                       | [default to undefined]            |
| **updatedAt**        | **string**                                                                               |                                                       | [default to undefined]            |
| **temporary**        | **boolean**                                                                              |                                                       | [optional] [default to false]     |
| **projectId**        | **string**                                                                               |                                                       | [optional] [default to undefined] |

## Example

```typescript
import { GraphPreviewDto } from './api';

const instance: GraphPreviewDto = {
  id,
  name,
  description,
  error,
  version,
  targetVersion,
  status,
  runningThreads,
  totalThreads,
  nodeCount,
  edgeCount,
  agents,
  triggerNodes,
  nodeDisplayNames,
  createdAt,
  updatedAt,
  temporary,
  projectId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
