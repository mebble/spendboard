import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
} from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime'
import { defaults } from 'lodash';

import { MyQuery, MyDataSourceOptions, DEFAULT_QUERY } from './types';
import { Notion } from 'notion';
import { queryData } from 'notion/query';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  readonly notion: Notion;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.notion = new Notion(getBackendSrv(), instanceSettings.url ?? '')
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range.from;
    const to = range.to;

    const result = await this.notion.getExpensesBetween(from, to)
    if (!result.success) {
      return {
        data: [],
        error: {
          status: result.error.status,
          message: result.error.data.message,
        }
      }
    }

    const expenses = result.data
    const data = options.targets.map((target) => {
      target = defaults(target, DEFAULT_QUERY);
      return queryData(expenses, target);
    });

    return { data };
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
