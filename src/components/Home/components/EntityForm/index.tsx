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
import { EntityField, TableData } from './types';

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

interface EntityFormData {
  isEditing: boolean;
  tableData?: TableData;
  handleSaveEntityButtonClick: (entidadeParaSalvar: TableData) => void;
}

export default (data: EntityFormData) => {
  const { isEditing, tableData, handleSaveEntityButtonClick } = data;

  const [nome, setNome] = useState<string>(
    isEditing && typeof tableData !== 'undefined' ? tableData?.name : ''
  );

  const [fields, setFields] = useState<EntityField[]>([]);

  const save = () => {
    if (typeof tableData !== 'undefined') {
      tableData.name = nome;
      handleSaveEntityButtonClick(tableData);
    } else {
      const newTableData: TableData = {
        id: uuidv4(),
        name: nome,
        xPosition: 0,
        yPosition: 0,
        connections: [],
        columns: fields,
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

  const handleChangeFieldName = (value: string, index: number) => {
    fields[index].name = value;
    setFields([...fields]);
  };

  const handleChangeFieldType = (value: string, index: number) => {
    fields[index].type = value;
    console.log(fields[index]);
    setFields([...fields]);
  };

  const handleToggleFieldPK = (value: boolean, index: number) => {
    fields[index].isPrimaryKey = value;
    fields[index].isAutoIncrement = value;
    setFields([...fields]);
  };

  const handleToggleFieldNotNull = (value: boolean, index: number) => {
    fields[index].isNotNull = value;
    setFields([...fields]);
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
