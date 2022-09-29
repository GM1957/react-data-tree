
# React Data Tree

Highly customizable node tree component with flatten data structure to interact intensly and easily



![](https://github.com/GM1957/react-data-tree/blob/main/assets/example.gif)
## Installation

Install the library using your favorite dependency manager:

```bash
  npm install react-data-tree --save
```

Or using yarn:

```bash
  yarn add react-data-tree
```
        
## Usage/Examples

```javascript
import React from "react";
import { NodeTreeView, NodeOperations } from "react-data-tree";
import { AiOutlineCheckSquare, AiOutlineMinusSquare } from "react-icons/ai";

function App() {
  const [metaData, setMetaData] = React.useState({});
  const data = [
    {
      id: "unique-id-1",
      name: "Carmelita Rose",
      children: [
        {
          id: "unique-id-1-1",
          name: "Ilmi Carlitos",
        },
        {
          id: "unique-id-1-2",
          name: "Mojgan Cateline",
          children: [
            {
              id: "unique-id-1-2-1",
              name: "Ida Erich",
              children: [
                {
                  id: "unique-id-1-2-1-1",
                  name: "Ilmi Carlitos",
                },
                {
                  id: "unique-id-1-2-1-2",
                  name: "Mojgan Cateline",
                  children: [
                    {
                      id: "unique-id-1-2-1-2-1",
                      name: "Ida Erich",
                    },
                    {
                      id: "unique-id-1-2-1-2-2",
                      name: "Olimpia Bertrand",
                    },
                  ],
                },
              ],
            },
            {
              id: "unique-id-1-2-2",
              name: "Olimpia Bertrand",
            },
          ],
        },
      ],
    },
    {
      id: "unique-id-2",
      name: "Terezija Paulus",
      children: [
        {
          id: "unique-id-2-1",
          name: "Shemu'el Sneha",
        },
      ],
    },
  ];

  
  const CustomNodeComponent = ({ nodeData, parentNodeIds, isLastNode }) => {
    return (
      <div
        style={{ display: "flex", alignItems: "center", paddingLeft: "10px" }}
      >
        <div
          style={{
            padding: "1px",
            border: "solid 1px blue",
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMetaData((oldData) => {
              const operations = new NodeOperations(
                oldData,
                nodeData?.id,
                parentNodeIds,
                data
              );
              return operations.defaultClickOperation();
            });
          }}
        >
          {metaData[nodeData?.id]?.isChecked ? (
            metaData[nodeData?.id]?.isSemiChecked ? (
              <AiOutlineMinusSquare />
            ) : (
              <AiOutlineCheckSquare />
            )
          ) : (
            <div className="p-2"></div>
          )}
        </div>

        <div
          style={{
            padding: "5px",
            marginLeft: "5px",
          }}
        >
          {nodeData.name}
        </div>
        <div
          onClick={() => {
            setMetaData((ldData) => {
              const oldData = JSON.parse(JSON.stringify(ldData));
              return {
                ...oldData,
                [nodeData?.id]: {
                  ...oldData[nodeData?.id],
                  isNodeExpanded: !(
                    oldData && oldData[nodeData?.id]?.isNodeExpanded
                  ),
                },
              };
            });
          }}
          style={{ cursor: "pointer", marginLeft: "10px" }}
        >
          {!isLastNode ? (
            metaData[nodeData?.id]?.isNodeExpanded ? (
              <div>{"^"}</div>
            ) : (
              <div>{">"}</div>
            )
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div>
      <NodeTreeView
        metaData={metaData}
        NodeComponent={CustomNodeComponent}
        data={data}
      />
    </div>
  );
}

export default App;

```


## API Reference

#### Through metaData state we can control the whole node tree, on clicking operations with the methods from NodeOperations we can get status of all nodes 

### metaData

| key | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `isChecked` | `boolean` | current clicked node selection status |
| `isSemiChecked` | `boolean` | if all nested nodes are not selected of a parent node |
| `isNodeExpanded` | `boolean` | is node expanded / nested nodes are visible status |
| `childrenIds` | `[string]` | children ids of a parent |
| `children` | `undefined` | children is a reserved key which will be always undefined |


### data

```
type mainDataNode = {
  id: string;
  children?: dataType;
  [key: string]: any;
};

type data = Array<mainDataNode>

```

### NodeComponent

#### make your custom node component, you will get some necessary details in props 

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `nodeData` | `mainDataNode` | all node details which you gave in json such as id,name except `children` |
| `parentNodeIds` | `[parent node id]` | this array will contain all parents id of a node in outside to inside manner |
| `isLastNode` | `boolean` | is current node is the deepest node |


### Class `NodeOperations`

```new```  ```NodeOperations(metaData, id, parentNodeIds, treeData)```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `metaData` | `React state` |  { uniqueNodeKey: { state details for the perticular node }} |
| `id` | `Unique node id` | id should be always unique |
| `parentNodeIds` | `[parent node id]` | this array will contain all parents id of a node in outside to inside manner |
| `treeData` | `JSON` | recursive json data which |



### Methods

- `getFlattenedData()` will convert json tree data into metaData structure
  we can pass custom node modifier function as a parameter `getFlattenedData(treeNodeModifier)` which takes nodeDetails (mainDataNode) as input

- `getIndivisualCheckBoxClickedData({})` by default it will make `isChecked=true` of clicked node, also we can provide metaData and custom node modifier with it `getIndivisualCheckBoxClickedData({ modifiedData, clickedObjectModifier })`

- `getChildrenClickedData({})` by default it will make `isChecked=true` for all children of current node also we can provide metaData and custom children modifier with it `getChildrenClickedData({ modifiedData, childObjectsModifier })`

- `getAllParentCheckedData({})` by default it will make `isChecked=true` for all parent of current node also it calculates and makes `isSemiChecked=true` conditionally, we can provide metaData and custom parent modifier with it `getAllParentCheckedData({ modifiedData, parentObjectsModifier })`

- `defaultClickOperation()` executes a click operation from provided data in the class and using above mentiond methods in default environment 
