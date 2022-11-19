import React from 'react';
import { Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';
import { EntityData } from 'components/Home/components/EntityForm/types';

const specs = {
  squareHeight: 20,
};

// export interface TableData

export interface TableShapeData extends EntityData {
  handleDragMove?: (evt: Konva.KonvaEventObject<DragEvent>) => void;
  handleClick?: (evt: Konva.KonvaEventObject<MouseEvent>) => void;
}

export default (data: TableShapeData) => {
  const {
    id,
    name,
    xPosition,
    yPosition,
    handleDragMove,
    handleClick,
    columns,
  } = data;

  return (
    <Layer
      id={id}
      x={xPosition}
      y={yPosition}
      width={150}
      onDragMove={handleDragMove}
      onClick={handleClick}
      draggable
    >
      <div>
        <Rect width={150} height={specs.squareHeight} stroke="black" />
        <Text
          width={150}
          height={specs.squareHeight}
          align="center"
          text={name}
          verticalAlign="middle"
        />
      </div>
      {columns &&
        columns.map((field, index) => {
          const position = index + 1;
          return (
            <div id={index.toString()}>
              <Rect
                y={specs.squareHeight * position}
                width={150}
                height={specs.squareHeight}
                stroke="black"
              />

              <Text
                y={specs.squareHeight * position}
                x={5}
                width={150}
                height={specs.squareHeight}
                align="left"
                text={`${field.name}: ${field.type}`}
                verticalAlign="middle"
              />
            </div>
          );
        })}
    </Layer>
  );
};
