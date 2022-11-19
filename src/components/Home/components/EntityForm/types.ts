export interface EntityField {
  name: string;
  type: null | string;
  isPrimaryKey: boolean;
  isNotNull: boolean;
  isUnique: boolean;
  isAutoIncrement: boolean;
  expression?: string;
}

export interface EntityRelationshipData {
  type: string;
  column: string;
  foreignTable: string;
  foreignColumn: string;
}

export interface EntityIndexData {
  fields: string[];
  primaryKey: boolean;
  name: null | string;
  unique: boolean;
}

export interface EntityData {
  id: string;
  name: string;
  xPosition: number;
  yPosition: number;
  connections: string[];
  columns: EntityField[];
  relationships: EntityRelationshipData[];
  indexes: EntityIndexData[];
}
