import { metaData as metaDataType, dataType } from "../types";
class NodeOperations {
  metaData: metaDataType;
  id: string;
  parentNodeIds: Array<string>;
  treeData: dataType;

  constructor(
    metaData: metaDataType,
    id: string,
    parentNodeIds: string[],
    treeData: dataType
  ) {
    this.metaData = metaData;
    this.id = id;
    this.parentNodeIds = parentNodeIds;
    this.treeData = treeData;
  }

  getFlattenedData(treeNodeModifier?: Function) {
    const { treeData, metaData } = this;
    if (treeData.length && metaData) {
      const newMetaData: metaDataType = {};

      const treeDataToMetaData = (treeData: dataType) => {
        treeData.forEach((treeNode) => {
          const modifiedObject = treeNodeModifier
            ? treeNodeModifier(treeNode)
            : {
                ...treeNode,
                isChecked: metaData[treeNode?.id]?.isChecked || false,
                isNodeExpanded: metaData[treeNode?.id]?.isNodeExpanded || false,
                isSemiChecked: metaData[treeNode?.id]?.isSemiChecked || false,
                childrenIds: treeNode?.children?.map((item) => item.id),
                children: undefined,
              };
          newMetaData[treeNode?.id] = modifiedObject;
          if (treeNode?.children?.length) {
            treeDataToMetaData(treeNode?.children);
          }
        });
      };

      treeDataToMetaData(treeData);

      return newMetaData;
    } else {
      return {};
    }
  }

  getIndivisualCheckBoxClickedData({
    modifiedData,
    clickedObjectModifier,
  }: {
    modifiedData?: Object;
    clickedObjectModifier?: Function;
  }) {
    const data: any = modifiedData || this.getFlattenedData();
    const { id } = this;

    return {
      ...data,
      [id]: clickedObjectModifier
        ? clickedObjectModifier(data[id])
        : {
            ...data[id],
            isChecked: !data[id]?.isChecked,
            isNodeExpanded: !data[id]?.isChecked,
            isSemiChecked: false,
          },
    };
  }

  getChildrenClickedData({
    modifiedData,
    childObjectsModifier,
  }: {
    modifiedData?: Object;
    childObjectsModifier?: Function;
  }) {
    const indivisualCheckedData =
      modifiedData || this.getIndivisualCheckBoxClickedData({});
    const { id } = this;

    const childrenChecker = (childrenIds: Array<string>) => {
      childrenIds?.forEach((childId) => {
        indivisualCheckedData[childId] = childObjectsModifier
          ? childObjectsModifier(indivisualCheckedData[childId])
          : {
              ...indivisualCheckedData[childId],
              isChecked: indivisualCheckedData[id]?.isChecked,
              isSemiChecked: false,
            };

        if (indivisualCheckedData[childId]?.childrenIds?.length) {
          childrenChecker(indivisualCheckedData[childId]?.childrenIds);
        }
      });
    };

    childrenChecker(indivisualCheckedData[id]?.childrenIds);

    return indivisualCheckedData;
  }

  getAllParentCheckedData({
    modifiedData,
    parentObjectsModifier,
  }: {
    modifiedData?: Object;
    parentObjectsModifier?: Function;
  }) {
    const { parentNodeIds } = this;
    const modData = modifiedData || this.getChildrenClickedData({});

    if (parentNodeIds?.length) {
      for (let i = parentNodeIds.length - 1; i >= 0; i--) {
        const parentNodeId = parentNodeIds[i];
        const childrenCount = modData[parentNodeId]?.childrenIds?.length;
        let checkedCount = 0;
        let semiCheckedCount = 0;

        modData[parentNodeId]?.childrenIds?.forEach((childId: string) => {
          if (modData[childId]?.isChecked) {
            checkedCount += 1;
          }
          if (modData[childId]?.isSemiChecked) {
            semiCheckedCount += 1;
          }
        });

        if (parentObjectsModifier) {
          modData[parentNodeId] = parentObjectsModifier({
            parentBoxData: modData[parentNodeId],
            checkedChildrenCount: checkedCount,
            childrenCount,
            semiCheckedCount,
          });
        } else {
          if (checkedCount === 0) {
            modData[parentNodeId].isChecked = false;
            modData[parentNodeId].isSemiChecked = false;
          } else if (checkedCount === childrenCount && semiCheckedCount == 0) {
            modData[parentNodeId].isChecked = true;
            modData[parentNodeId].isSemiChecked = false;
          } else if (checkedCount < childrenCount || semiCheckedCount > 0) {
            modData[parentNodeId].isChecked = true;
            modData[parentNodeId].isSemiChecked = true;
          }
        }
      }
    }

    return modData;
  }

  defaultClickOperation() {
    const flatData = this.getFlattenedData();
    const indiVisualClickedData = this.getIndivisualCheckBoxClickedData({
      modifiedData: flatData,
    });
    const childrenClickedData = this.getChildrenClickedData({
      modifiedData: indiVisualClickedData,
    });
    const parentsClickedData = this.getAllParentCheckedData({
      modifiedData: childrenClickedData,
    });

    return parentsClickedData;
  }
}

export { NodeOperations };
