import { FC } from "react";

type mainDataNode = {
  id: string;
  children?: dataType;
  [key: string]: any;
};

export type dataType = Array<mainDataNode>;

export type checkboxTreePropType = {
  data: dataType;
  metaData: {
    [key: string]: {
      isNodeExpanded: boolean;
      [key: string]: any;
    };
  };
  NodeComponent: FC<{
    nodeData: any;
    parentNodeIds?: Array<string | number>;
    isLastNode: boolean;
  }>;
  nodeProps?: any;
  rootProps?: any;
  nestedNodeProps?: any;
  nestedNodeWrapperProps?: any;
};

export type nodeViewProps = {
  nodeObj: mainDataNode;
  parentNodeIds?: Array<string | number>;
};

export type metaData = {
  [key: string]: {
    isChecked: boolean;
    isSemiChecked: boolean;
    isNodeExpanded: boolean;
    childrenIds?: Array<string | number>;
    [key: string]: any;
  };
};

export type checkboxClickHandlerInputs = {
  metaData: metaData;
  id: string | number;
  parentNodeIds?: Array<string | number>;
  treeData: dataType;
};
