import React, { useState, useEffect, useCallback } from 'react';
import { Stage, Line, Layer, Rect } from 'react-konva';
import Konva from 'konva';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  List,
  ListItem,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import Table from 'components/Diagram/Table';
import EntityForm from 'components/Home/components/EntityForm';
import { TableData } from 'components/Home/components/EntityForm/types';
import api from 'services/api';
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
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [connectingLines, setConnectingLines] = useState<IConnectingLine[]>([]);
  const [tableDataToEdit, setTableDataToEdit] = useState<TableData | null>(
    null
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [downloadLink, setDownloadLink] = useState<string>('');

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
        width: 150,
        height: 20 + tableData.columns.length * 20,
        connections: tableData.connections,
      };
    });
  };

  const generateConnectionLines = useCallback(
    (nodesToFill: NodeType[]): IConnectingLine[] => {
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

        return newConnectionLines;
      });

      return newConnectionLines;
    },
    []
  );

  useEffect(() => {
    const fetchTables: TableData[] = [
      {
        id: uuidv4(),
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimaryKey: true,
            isNotNull: true,
            isUnique: true,
            isAutoIncrement: true,
          },
          {
            name: 'nome',
            type: 'varchar(255)',
            isPrimaryKey: false,
            isNotNull: true,
            isUnique: false,
            isAutoIncrement: false,
          },
        ],
        name: 'produtos',
        xPosition: 150,
        yPosition: 150,
        connections: [],
        relationships: [],
      },
      {
        id: uuidv4(),
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimaryKey: true,
            isNotNull: true,
            isUnique: true,
            isAutoIncrement: true,
          },
          {
            name: 'nome',
            type: 'varchar(255)',
            isPrimaryKey: false,
            isNotNull: true,
            isUnique: false,
            isAutoIncrement: false,
          },
        ],
        name: 'tamanhos',
        xPosition: 550,
        yPosition: 150,
        connections: [],
        relationships: [],
      },
    ];

    setTables(fetchTables);

    const nodesToFill: NodeType[] = generateNodesFromTables(fetchTables);
    setNodes(nodesToFill);
    setConnectingLines(generateConnectionLines(nodesToFill));
  }, [generateConnectionLines]);

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
      tables[nodeIndex].xPosition = evt.target.attrs.x;
      tables[nodeIndex].yPosition = evt.target.attrs.y;

      setTables(tables);
      setNodes(nodes);
      updateConnectionLinesByNodeId(nodeToUpdateId);
    }
  };

  const setTableToEdit = (evt: Konva.KonvaEventObject<MouseEvent>) => {
    const tableIndex = findIndexByIdAndListWithIdAttribute(
      evt.target.getLayer().attrs.id,
      tables
    );

    setTableDataToEdit(tables[tableIndex]);
    evt.cancelBubble = true;
  };

  const handleNovaTabelaButtonClick = () => {
    setHelperMenuOpen(!helperMenuOpen);
    setIsEditing(false);
    setTableDataToEdit(null);
  };

  const handleEditarTabelaButtonClick = () => {
    setHelperMenuOpen(!helperMenuOpen);

    setNome(tableDataToEdit?.name);
    setIsEditing(true);
  };

  const closeHelperMenu = () => {
    setHelperMenuOpen(false);
  };

  const newHandleSaveAction = (entidadeParaSalvar: TableData) => {
    if (isEditing && entidadeParaSalvar !== null) {
      const tableIndex = findIndexByIdAndListWithIdAttribute(
        entidadeParaSalvar.id,
        tables
      );
      tables[tableIndex] = entidadeParaSalvar;

      const newTables = [...tables];
      setTables(newTables);
      const newNodes = generateNodesFromTables(newTables);
      setNodes(newNodes);
      setConnectingLines(generateConnectionLines(newNodes));
    } else {
      entidadeParaSalvar.yPosition =
        tables && tables.length ? 100 * tables.length : 0;

      const newTables = [...tables, entidadeParaSalvar];
      setTables(newTables);
      const newNodes = generateNodesFromTables(newTables);
      setNodes(newNodes);
    }

    closeHelperMenu();
  };

  const handleGenerateProject = async () => {
    try {
      // Para API em PHP
      setIsLoading(true);
      setIsModalOpen(true);
      const result = await api.post('project', { json: tables });
      setDownloadLink(
        `http://localhost/${result.data.resource.projectPathDownload}`
      );
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const confirmationModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {isLoading ? (
          <Box style={{ height: '100%', display: 'flex' }}>
            <Box style={{ margin: 'auto' }}>
              <CircularProgress />
            </Box>
          </Box>
        ) : (
          <Box sx={confirmationModalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Projeto gerado com sucesso!
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <a href={downloadLink}>Clique aqui</a> para baixar o projeto
            </Typography>
          </Box>
        )}
      </Modal>
      <S.Main>
        <S.DiagramTools>
          <Button
            onClick={handleNovaTabelaButtonClick}
            variant="contained"
            fullWidth
            color="primary"
          >
            Nova Entidade
          </Button>
          <Button
            onClick={handleEditarTabelaButtonClick}
            style={{ marginTop: 20 }}
            variant="contained"
            fullWidth
            disabled={tableDataToEdit === null}
            color="secondary"
          >
            Editar Entidade
          </Button>
          <Button
            onClick={handleGenerateProject}
            style={{ marginTop: 20 }}
            variant="contained"
            fullWidth
            disabled={nodes.length === 0}
            color="success"
          >
            Gerar Projeto
          </Button>
          <hr style={{ marginTop: 20, marginBottom: 30 }} />
          <Box>
            {tableDataToEdit === null ? (
              <Typography variant="body1">
                Clique em uma entidade para editar!
                <br />
                <Typography variant="caption">
                  Abaixo aparecerá o seu resumo
                </Typography>
              </Typography>
            ) : (
              <List>
                <ListItem>
                  <Typography variant="body2" gutterBottom>
                    Tabela Selecionada: <b>{tableDataToEdit?.name}</b>
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="body2" gutterBottom>
                    Quantidade de campos:{' '}
                    <b>{tableDataToEdit?.columns.length}</b>
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="body2" gutterBottom>
                    Quantidade de relações:{' '}
                    <b>{tableDataToEdit?.connections.length}</b>
                  </Typography>
                </ListItem>
              </List>
            )}
          </Box>
        </S.DiagramTools>
        <S.DiagramBoard>
          <Stage
            width={1000}
            height={800}
            onClick={() => {
              setTableDataToEdit(null);
              setHelperMenuOpen(false);
            }}
          >
            {nodes &&
              nodes.length > 0 &&
              nodes.map((node) => (
                <Table
                  id={node.id}
                  name={node.table.name}
                  columns={node.table.columns}
                  xPosition={node.positionX}
                  yPosition={node.positionY}
                  handleDragMove={updatePosition}
                  handleClick={setTableToEdit}
                  relationships={node.table.relationships}
                  connections={[]}
                />
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
        {helperMenuOpen && (
          <EntityForm
            tablesAvailable={tables}
            isEditing={isEditing}
            tableData={
              isEditing && tableDataToEdit !== null
                ? tableDataToEdit
                : undefined
            }
            handleSaveEntityButtonClick={newHandleSaveAction}
          />
        )}

        {/* <form>
          <S.AddTableHeader>
            <Typography variant="h5" style={{ marginBottom: 20 }}>
              {isEditing ? 'Editar' : 'Adicionar'} Entidade
            </Typography>
            <TextField
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              id="nome-tabela"
              label="Nome"
              variant="outlined"
            />
          </S.AddTableHeader>
          <Typography
            style={{ marginBottom: 5, marginTop: 25 }}
            variant="subtitle2"
          >
            <b>Campos</b>
          </Typography>
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

          {isEditing && tableDataToEdit !== null && (
            <FormControl sx={{ width: 300 }}>
              <Typography
                style={{ marginBottom: 5, marginTop: 25 }}
                variant="subtitle2"
              >
                <b>Relações:</b>
              </Typography>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                value={tableDataToEdit?.connections[0]}
                onChange={updateTableToEditConnection}
                input={<OutlinedInput label="Entidades" />}
                // MenuProps={MenuProps}
              >
                {tables.map((table) => {
                  return (
                    <MenuItem
                      key={table.id}
                      value={table.id}
                      selected={tableDataToEdit?.connections[0] === table.id}
                      // style={getStyles(name, personName, theme)}
                    >
                      {table.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}

          <S.AddTableFooter>
            <Button
              style={{
                backgroundColor: '#2e7d32',
                marginTop: '25px',
                color: 'white',
              }}
              variant="contained"
              color="success"
              onClick={handleSaveEntityButtonClick}
            >
              {isEditing ? 'Salvar' : 'Adicionar'}
            </Button>
          </S.AddTableFooter>
        </form> */}
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
