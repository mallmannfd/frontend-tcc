import React, { useState, useEffect } from 'react';
import { Stage, Line, Layer, Rect } from 'react-konva';
import Konva from 'konva';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import Table, { TableData } from 'components/Diagram/Table';
import * as S from '../components/Home/style';
import './App.css';

interface RectType {
  positionX: number;
  positionY: number;
  width: number;
  height: number;
}

interface NodeType extends RectType {
  id: string;
  table: TableData;
  connections: string[];
}

interface IConnectingLine {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

const Hello = () => {
  const [helperMenuOpen, setHelperMenuOpen] = useState(false);
  const [tables, setTables] = useState<TableData[]>([]);
  const [nome, setNome] = useState('');
  const [campo1, setCampo1] = useState('');
  const [campo2, setCampo2] = useState('');
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [connectingLines, setConnectingLines] = useState<IConnectingLine[]>([]);

  const findIndexByIdAndListWithIdAttribute = (
    id: string,
    list: any[]
  ): number => {
    return list?.findIndex((node) => node.id === id);
  };

  const calculateLineFromX = (node: NodeType): number => {
    return node.positionX + node.width;
  };

  const calculateLineFromY = (node: NodeType): number => {
    return node.positionY + node.height / 2;
  };

  const calculateLineToX = (node: NodeType): number => {
    return node.positionX;
  };

  const calculateLineToY = (node: NodeType): number => {
    return node.positionY + node.height / 2;
  };

  const generateNodesFromTables = (tablesData: TableData[]): NodeType[] => {
    return tablesData.map((tableData) => {
      return {
        id: tableData.id,
        table: tableData,
        positionX: tableData.xPosition,
        positionY: tableData.yPosition,
        width: 100,
        height: 20 + tableData.fields.length * 20,
        connections: tableData.connections,
      };
    });
  };

  useEffect(() => {
    const fetchTables: TableData[] = [
      {
        id: uuidv4(),
        fields: ['id', 'nome'],
        name: 'produtos',
        xPosition: 150,
        yPosition: 150,
        connections: [],
      },
      {
        id: uuidv4(),
        fields: ['id', 'nome'],
        name: 'tamanhos',
        xPosition: 450,
        yPosition: 150,
        connections: [],
      },
    ];

    fetchTables[0].connections.push(fetchTables[1].id);
    setTables(fetchTables);

    const nodesToFill: NodeType[] = generateNodesFromTables(fetchTables);
    setNodes(nodesToFill);

    const generateConnectionLines = () => {
      const newConnectionLines: IConnectingLine[] = [];

      nodesToFill?.forEach((node) => {
        if (node.connections.length > 0) {
          node.connections.forEach((destinationNodeId) => {
            // const connectionLine: IConnectingLine = {};

            const destinationNodeIndex = findIndexByIdAndListWithIdAttribute(
              destinationNodeId,
              nodesToFill
            );
            const destinationNode = nodesToFill[destinationNodeIndex];

            const connectionLine: IConnectingLine = {
              id: `${node.id}-to-${destinationNode.id}`,
              fromNodeId: node.id,
              toNodeId: destinationNode.id,
              fromX: calculateLineFromX(node),
              fromY: calculateLineFromY(node),
              toX: calculateLineToX(destinationNode),
              toY: calculateLineToY(destinationNode),
            };

            newConnectionLines.push(connectionLine);
          });
        }

        setConnectingLines(newConnectionLines);
      });
    };

    generateConnectionLines();
  }, []);

  const getNodesIdsConnectingWithMeById = (id: string): string[] => {
    const idlist: string[] = [];

    nodes.forEach((node) => {
      if (node.connections.indexOf(id) > -1) {
        idlist.push(node.id);
      }
    });

    return idlist;
  };

  const updateConnectionLinesByNodeId = (nodeId: string) => {
    const nodeIndex = findIndexByIdAndListWithIdAttribute(nodeId, nodes);
    const sourceNode: NodeType = nodes[nodeIndex];
    const myConnectionIds: string[] = sourceNode.connections;
    const nodesConnectingWithMeIds: string[] =
      getNodesIdsConnectingWithMeById(nodeId);

    const newConnectingLines = [...connectingLines];

    const updateInnerConnectionLineList = (
      fromNode: NodeType,
      toNode: NodeType
    ) => {
      const lineId = `${fromNode.id}-to-${toNode.id}`;
      const lineIndex = findIndexByIdAndListWithIdAttribute(
        lineId,
        newConnectingLines
      );

      newConnectingLines[lineIndex].fromX = calculateLineFromX(fromNode);
      newConnectingLines[lineIndex].fromY = calculateLineFromY(fromNode);
      newConnectingLines[lineIndex].toX = calculateLineToX(toNode);
      newConnectingLines[lineIndex].toY = calculateLineToY(toNode);
    };

    myConnectionIds.forEach((destinationNodeId) => {
      const destinationNodeIndex = findIndexByIdAndListWithIdAttribute(
        destinationNodeId,
        nodes
      );

      const destinationNode: NodeType = nodes[destinationNodeIndex];

      updateInnerConnectionLineList(sourceNode, destinationNode);
    });

    nodesConnectingWithMeIds.forEach((destinationNodeId) => {
      const destinationNodeIndex = findIndexByIdAndListWithIdAttribute(
        destinationNodeId,
        nodes
      );

      const destinationNode: NodeType = nodes[destinationNodeIndex];

      updateInnerConnectionLineList(destinationNode, sourceNode);
    });

    setConnectingLines(newConnectingLines);
  };

  const updatePosition = (evt: Konva.KonvaEventObject<DragEvent>) => {
    const nodeToUpdateId = evt.target.attrs.id;

    if (nodes !== null) {
      const nodeIndex: number = findIndexByIdAndListWithIdAttribute(
        nodeToUpdateId,
        nodes
      );
      nodes[nodeIndex].positionX = evt.target.attrs.x;
      nodes[nodeIndex].positionY = evt.target.attrs.y;

      setNodes(nodes);
      updateConnectionLinesByNodeId(nodeToUpdateId);
    }
  };

  const handleNovaTabelaButtonClick = () => {
    setHelperMenuOpen(!helperMenuOpen);
  };

  const handleAddTabelaButtonClick = () => {
    const table = {
      id: uuidv4(),
      name: nome,
      fields: [campo1, campo2],
      xPosition: 0,
      yPosition: tables && tables.length ? 100 * tables.length : 0,
      connections: [],
    };

    setNome('');
    setCampo1('');
    setCampo2('');

    const newTables = [...tables, table];
    const newNodes = generateNodesFromTables(newTables);
    setTables(newTables);
    setNodes(newNodes);
  };

  return (
    <div>
      <S.Main>
        <S.DiagramTools>
          <Button
            onClick={handleNovaTabelaButtonClick}
            variant="contained"
            fullWidth
            color="primary"
          >
            Nova Tabela
          </Button>
        </S.DiagramTools>
        <S.DiagramBoard>
          <Stage width={1000} height={800}>
            {/* {tables && */}
            {/* tables.length > 0 && */}
            {/* tables.map((table) => ( */}
            {/* <Table */}
            {/* name={table.name} */}
            {/* fields={table.fields} */}
            {/* xPosition={table.xPosition} */}
            {/* yPosition={table.yPosition} */}
            {/* /> */}
            {/* ))} */}
            {nodes &&
              nodes.length > 0 &&
              nodes.map((node) => (
                <Table
                  id={node.id}
                  name={node.table.name}
                  fields={node.table.fields}
                  xPosition={node.positionX}
                  yPosition={node.positionY}
                  handleDragMove={updatePosition}
                />
                // <Rect
                //   id={node.id}
                //   x={node.positionX}
                //   y={node.positionY}
                //   width={node.width}
                //   height={node.height}
                //   draggable
                //   stroke="black"
                //   onDragMove={updatePosition}
                // />
              ))}
            <Layer x={0} y={0} width={800} height={800}>
              {connectingLines &&
                connectingLines.length > 0 &&
                connectingLines.map((connectingLine) => (
                  <Line
                    id={connectingLine.id}
                    points={[
                      connectingLine.fromX,
                      connectingLine.fromY,
                      connectingLine.toX,
                      connectingLine.toY,
                    ]}
                    stroke="orange"
                  />
                ))}
            </Layer>
          </Stage>
        </S.DiagramBoard>
      </S.Main>
      <S.HelperMenu hidden={!helperMenuOpen}>
        <form>
          <S.AddTableHeader>
            <h3>Adicionar Tabela</h3>
            <TextField
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              id="nome-tabela"
              label="Nome"
              variant="outlined"
            />
          </S.AddTableHeader>
          <h4>Campos</h4>
          <TextField
            value={campo1}
            onChange={(event) => setCampo1(event.target.value)}
            fullWidth
            id="campo1"
            label="Campo 1"
            variant="outlined"
          />
          <TextField
            value={campo2}
            onChange={(event) => setCampo2(event.target.value)}
            style={{ marginTop: '15px' }}
            fullWidth
            id="campo2"
            label="Campo 2"
            variant="outlined"
          />

          <S.AddTableFooter>
            <Button
              style={{
                backgroundColor: '#2e7d32',
                marginTop: '25px',
                color: 'white',
              }}
              variant="contained"
              color="success"
              onClick={handleAddTabelaButtonClick}
            >
              Adicionar
            </Button>
          </S.AddTableFooter>
        </form>
      </S.HelperMenu>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
