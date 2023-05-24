import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface MyQuery extends DataQuery {
  amplitude: number;
  frequency: number;
  tags: string[];
}

export const DEFAULT_QUERY: Omit<MyQuery, 'refId'> = {
  amplitude: 6.5,
  frequency: 1.0,
  tags: [],
};

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  notionDbId: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  apiKey?: string;
}
