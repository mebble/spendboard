import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface MyQuery extends DataQuery {
  tags: string[];
  notTags: string[];
  name: string;
  depreciating?: boolean;
}

export const DEFAULT_QUERY: Omit<MyQuery, 'refId'> = {
  tags: [],
  notTags: [],
  name: '',
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

export type Result<T, E> = {
  success: true,
  data: T
} | {
  success: false,
  error: E
};

export type Expense = {
  name: string;
  amount: number;
  date: Date;
  tags: string[];
}
