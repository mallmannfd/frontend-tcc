import React from 'react';
import { Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';

const specs = {
  squareHeight: 20,
};

// export interface TableData

export interface TableData {
  id: string;
  name: string;
  fields: string[];
  xPosition: number;
  yPosition: number;
  connections: string[];
}

export interface TableShapeData extends TableData {
  handleDragMove: (evt: Konva.KonvaEventObject<DragEvent>) => any;
}

export default (data: TableShapeData) => {
  const { id, name, fields, xPosition, yPosition, handleDragMove } = data;

  return (
    <Layer
      id={id}
      x={xPosition}
      y={yPosition}
      width={100}
      onDragMove={handleDragMove}
      draggable
    >
      <div>
        <Rect width={100} height={specs.squareHeight} stroke="black" />
        <Text
          width={100}
          height={specs.squareHeight}
          align="center"
          text={name}
          verticalAlign="middle"
        />
      </div>
      {fields &&
        fields.map((field, index) => {
          const position = index + 1;
          return (
            <div id={index.toString()}>
              <Rect
                y={specs.squareHeight * position}
                width={100}
                height={specs.squareHeight}
                stroke="black"
              />

              <Text
                y={specs.squareHeight * position}
                x={5}
                width={100}
                height={specs.squareHeight}
                align="left"
                text={field}
                verticalAlign="middle"
              />
            </div>
          );
        })}
    </Layer>
  );
};
