import React from "react";
import { nodeViewProps, checkboxTreePropType } from "../../types";

const NodeTreeViewComponent = (props: checkboxTreePropType) => {
  const {
    data,
    metaData,
    nodeProps,
    rootProps,
    nestedNodeProps,
    NodeComponent,
    nestedNodeWrapperProps,
  } = props;

  const NodeView = (props: nodeViewProps) => {
    const { nodeObj, parentNodeIds } = props;
    return (
      <div {...nodeProps}>
        <NodeComponent
          nodeData={nodeObj}
          parentNodeIds={parentNodeIds}
          isLastNode={nodeObj?.children?.length ? false : true}
        />
        <div
          style={{
            display: metaData[nodeObj?.id]?.isNodeExpanded ? "block" : "none",
          }}
          {...nestedNodeWrapperProps}
        >
          {nodeObj.children &&
            nodeObj?.children?.length > 0 &&
            nodeObj?.children?.map((item: any) => (
              <div
                style={{ marginLeft: "15px" }}
                key={`${item?.id}-nested-key`}
                {...nestedNodeProps}
              >
                <NodeView
                  nodeObj={item}
                  parentNodeIds={
                    parentNodeIds
                      ? [...parentNodeIds, nodeObj?.id]
                      : [nodeObj?.id]
                  }
                />
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div {...rootProps}>
      {data &&
        data.map((item: any) => {
          return (
            <div key={`${item?.id}-root-key`}>
              <NodeView nodeObj={item} />
            </div>
          );
        })}
    </div>
  );
};

const NodeTreeView = React.memo(NodeTreeViewComponent);
export { NodeTreeView };
