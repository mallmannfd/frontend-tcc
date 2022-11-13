import React, { useState } from 'react';
import { Stage } from 'react-konva';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Button, TextField } from '@mui/material';

import Table, { TableData } from 'components/Diagram/Table';
import * as S from '../components/Home/style';
import './App.css';

const Hello = () => {
  const [helperMenuOpen, setHelperMenuOpen] = useState(false);
  const [tables, setTables] = useState<TableData[]>([]);
  const [nome, setNome] = useState('');
  const [campo1, setCampo1] = useState('');
  const [campo2, setCampo2] = useState('');

  const handleNovaTabelaButtonClick = () => {
    setHelperMenuOpen(!helperMenuOpen);
  };

  const handleAddTabelaButtonClick = () => {
    const table = {
      name: nome,
      fields: [campo1, campo2],
      xPosition: 0,
      yPosition: tables && tables.length ? 100 * tables.length : 0,
    };

    setNome('');
    setCampo1('');
    setCampo2('');
    setTables([...tables, table]);
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
            {tables &&
              tables.length > 0 &&
              tables.map((table) => (
                <Table
                  name={table.name}
                  fields={table.fields}
                  xPosition={table.xPosition}
                  yPosition={table.yPosition}
                />
              ))}
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
