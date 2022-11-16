export interface EntityField {
  name: string;
  type: null | string;
  isPrimaryKey: boolean;
  isNotNull: boolean;
  isUnique: boolean;
  isAutoIncrement: boolean;
  expression?: string;
}

export interface TableData {
  id: string;
  name: string;
  xPosition: number;
  yPosition: number;
  connections: string[];
  columns: EntityField[];
}