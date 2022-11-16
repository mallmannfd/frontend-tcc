import styled from 'styled-components';

export const Main = styled.div`
  margin-left: 1em;
  margin-right: 1em;
  display: grid;
  grid-template-areas: 'tools board';
  grid-template-columns: 20% 1fr;
`;

export const DiagramTools = styled.div`
  grid-area: 'tools';
  border: 1px solid black;
  padding: 20px;
`;

export const DiagramBoard = styled.div`
  grid-area: 'board';
  border: 1px solid red;
  padding: 5px;
`;

export const HelperMenu = styled.div`
  position: fixed;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 25px;
  background: white;
  right: 0;
  top: 0;
  width: 1050px;
  height: 100%;
  border: 1px solid #ccc;
`;

export const AddTableHeader = styled.div`
  text-align: center;
`;

export const AddTableFooter = styled.div`
  text-align: center;
`;
