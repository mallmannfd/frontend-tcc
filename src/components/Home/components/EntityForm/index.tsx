import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

import * as S from '../../style';
import {
  EntityField,
  EntityRelationshipData,
  EntityData,
  EntityIndexData,
} from './types';

const fieldTypes = [
  {
    label: 'INT',
    value: 'int',
  },
  {
    label: 'STRING',
    value: 'varchar(255)',
  },
  {
    label: 'TEXT',
    value: 'text',
  },
  {
    label: 'FLOAT',
    value: 'float',
  },
  {
    label: 'TIMESTAMP',
    value: 'timestamp',
  },
];

const relationshipTypes = [
  {
    label: 'BELONGS TO',
    value: 'belongsTo',
  },
];

interface EntityFormData {
  isEditing: boolean;
  tableData?: EntityData;
  handleSaveEntityButtonClick: (entidadeParaSalvar: EntityData) => void;
  tablesAvailable: EntityData[];
}

export default (data: EntityFormData) => {
  const { tablesAvailable, isEditing, tableData, handleSaveEntityButtonClick } =
    data;

  const [nome, setNome] = useState<string>(
    isEditing && typeof tableData !== 'undefined' ? tableData?.name : ''
  );

  const [fields, setFields] = useState<EntityField[]>(
    isEditing && typeof tableData !== 'undefined' ? tableData.columns : []
  );

  const [relationships, setRelationships] = useState<EntityRelationshipData[]>(
    isEditing && typeof tableData !== 'undefined' ? tableData.relationships : []
  );

  const [indexes, setIndexes] = useState<EntityIndexData[]>(
    isEditing && typeof tableData !== 'undefined' ? tableData.indexes : []
  );

  const generateConnectionsFromRelationships = (): string[] => {
    return relationships.map((relationship) => {
      const index = tablesAvailable?.findIndex(
        (node) => node.name === relationship.foreignTable
      );
      return tablesAvailable[index].id;
    });
  };

  const save = () => {
    if (typeof tableData !== 'undefined') {
      tableData.name = nome;
      tableData.connections = generateConnectionsFromRelationships();
      tableData.indexes = indexes;
      handleSaveEntityButtonClick(tableData);
    } else {
      const newTableData: EntityData = {
        id: uuidv4(),
        name: nome,
        xPosition: 0,
        yPosition: 0,
        connections: [],
        columns: fields,
        relationships,
        indexes,
      };

      handleSaveEntityButtonClick(newTableData);
    }
  };

  const handleAddFieldClick = () => {
    fields.push({
      name: '',
      isAutoIncrement: false,
      isNotNull: false,
      isPrimaryKey: false,
      isUnique: false,
      type: null,
    });
    setFields([...fields]);
  };

  const handleAddRelationshipClick = () => {
    relationships.push({
      column: '0',
      foreignColumn: '0',
      foreignTable: '0',
      type: '0',
    });
    setRelationships([...relationships]);
  };

  const handleChangeFieldName = (value: string, index: number) => {
    fields[index].name = value;
    setFields([...fields]);
  };

  const handleChangeFieldType = (value: string, index: number) => {
    fields[index].type = value;
    setFields([...fields]);
  };

  const handleChangeRelationshipType = (value: string, index: number) => {
    relationships[index].type = value;
    setRelationships([...relationships]);
  };

  const handleChangeRelationshipSourceColumn = (
    value: string,
    index: number
  ) => {
    relationships[index].column = value;
    setRelationships([...relationships]);
  };

  const handleChangeRelationshipForeignEntity = (
    value: string,
    index: number
  ) => {
    relationships[index].foreignTable = value;
    setRelationships([...relationships]);
  };

  const handleChangeRelationshipForeignColumn = (
    value: string,
    index: number
  ) => {
    relationships[index].foreignColumn = value;
    setRelationships([...relationships]);
  };

  const findFieldIndexByFieldName = (fieldName: string) => {
    const indexIndex = indexes.findIndex(
      (index) => index.fields[0] === fieldName
    );

    return indexIndex;
  };

  const handleToggleFieldPK = (value: boolean, index: number) => {
    fields[index].isPrimaryKey = value;
    fields[index].isAutoIncrement = value;

    const indexIndex = findFieldIndexByFieldName(fields[index].name);

    if (indexIndex === -1) {
      if (value) {
        const newIndex: EntityIndexData = {
          fields: [fields[index].name],
          name: null,
          primaryKey: true,
          unique: false,
        };
        const newIndexes = [...indexes, newIndex];
        setIndexes(newIndexes);
      }
    } else if (!value) {
      indexes.splice(indexIndex, 1);
      setIndexes([...indexes]);
    }

    setFields([...fields]);
  };

  const handleToggleFieldNotNull = (value: boolean, index: number) => {
    fields[index].isNotNull = value;
    setFields([...fields]);
  };

  const getTableColumnsByName = (tableName: string): EntityField[] => {
    const index = tablesAvailable?.findIndex((node) => node.name === tableName);

    return tablesAvailable[index].columns;
  };

  return (
    <form style={{ maxHeight: 1200, overflowY: 'scroll' }}>
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
      <hr />

      <Box>
        <Button
          color="success"
          variant="contained"
          onClick={handleAddFieldClick}
        >
          <AddCircle />
        </Button>
      </Box>

      <Box style={{ marginTop: 40 }}>
        {fields.map((field, index) => {
          return (
            <Box style={{ marginBottom: 10 }}>
              <TextField
                placeholder="Nome Campo"
                onChange={(event) =>
                  handleChangeFieldName(event.target.value, index)
                }
                size="small"
                value={fields[index].name}
              />
              <Select
                style={{ marginLeft: 20 }}
                size="small"
                value={fields[index].type !== null ? fields[index].type : 0}
                onChange={(event) =>
                  handleChangeFieldType(event.target.value.toString(), index)
                }
              >
                <MenuItem disabled selected value={0}>
                  Selecionar Tipo
                </MenuItem>
                {fieldTypes.map((fieldType) => {
                  return (
                    <MenuItem key={fieldType.value} value={fieldType.value}>
                      {fieldType.label}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormControlLabel
                style={{ marginLeft: 20 }}
                control={<Checkbox />}
                onChange={(event) =>
                  handleToggleFieldPK(event.target.checked, index)
                }
                checked={fields[index].isPrimaryKey}
                label="PK"
              />
              <FormControlLabel
                style={{ marginLeft: 20 }}
                control={<Checkbox />}
                onChange={(event) =>
                  handleToggleFieldNotNull(event.target.checked, index)
                }
                checked={fields[index].isNotNull}
                label="Not Null"
              />
            </Box>
          );
        })}
      </Box>

      {isEditing && (
        <>
          <Typography
            style={{ marginBottom: 5, marginTop: 25 }}
            variant="subtitle2"
          >
            <b>Relações</b>
          </Typography>
          <hr />

          <Box>
            <Button
              color="success"
              variant="contained"
              onClick={handleAddRelationshipClick}
            >
              <AddCircle />
            </Button>
          </Box>

          <Box style={{ marginTop: 40 }}>
            {relationships.map((relationship, index) => {
              return (
                <Box style={{ marginBottom: 10 }}>
                  <Select
                    size="small"
                    value={relationships[index].type}
                    onChange={(event) =>
                      handleChangeRelationshipType(
                        event.target.value.toString(),
                        index
                      )
                    }
                  >
                    <MenuItem disabled selected value="0">
                      Tipo da Relação
                    </MenuItem>
                    {relationshipTypes.map((relationshipType) => {
                      return (
                        <MenuItem
                          key={relationshipType.value}
                          value={relationshipType.value}
                        >
                          {relationshipType.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <Select
                    style={{ marginLeft: 20 }}
                    size="small"
                    value={relationships[index].foreignTable}
                    onChange={(event) =>
                      handleChangeRelationshipForeignEntity(
                        event.target.value.toString(),
                        index
                      )
                    }
                  >
                    <MenuItem disabled selected value="0">
                      Tabela Destino
                    </MenuItem>
                    {tablesAvailable.map((table) => {
                      return (
                        <MenuItem key={table.name} value={table.name}>
                          {table.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <Select
                    style={{ marginLeft: 20 }}
                    size="small"
                    value={relationships[index].column}
                    onChange={(event) =>
                      handleChangeRelationshipSourceColumn(
                        event.target.value.toString(),
                        index
                      )
                    }
                  >
                    <MenuItem disabled selected value="0">
                      Coluna Origem
                    </MenuItem>
                    {fields.map((field) => {
                      return (
                        <MenuItem key={field.name} value={field.name}>
                          {field.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <Select
                    style={{ marginLeft: 20 }}
                    size="small"
                    value={relationships[index].foreignColumn}
                    disabled={relationships[index].foreignTable === '0'}
                    onChange={(event) =>
                      handleChangeRelationshipForeignColumn(
                        event.target.value.toString(),
                        index
                      )
                    }
                  >
                    <MenuItem disabled selected value="0">
                      Coluna Destino
                    </MenuItem>
                    {relationships[index].foreignTable !== '0' &&
                      getTableColumnsByName(
                        relationships[index].foreignTable
                      ).map((field) => {
                        return (
                          <MenuItem key={field.name} value={field.name}>
                            {field.name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </Box>
              );
            })}
          </Box>
        </>
      )}

      <hr />

      <S.AddTableFooter>
        <Button
          style={{
            marginTop: '25px',
          }}
          variant="contained"
          color="info"
          onClick={save}
          disabled={fields.length === 0}
        >
          Salvar Entidade
        </Button>
      </S.AddTableFooter>
    </form>
  );
};
