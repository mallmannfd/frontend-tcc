import React from 'react';
import { Layer, Rect, Text } from 'react-konva';

const specs = {
  squareHeight: 20,
};

export interface TableData {
  name: string;
  fields: string[];
  xPosition: number;
  yPosition: number;
}

export default (data: TableData) => {
  const { name, fields, xPosition, yPosition } = data;

  return (
    <Layer x={xPosition} y={yPosition} width={100} draggable>
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
