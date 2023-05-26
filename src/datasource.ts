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
import { INotion } from 'notion/types';
import { NotionCache } from 'notion/cache';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  readonly notion: INotion;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    const notionImpl = new Notion(getBackendSrv(), instanceSettings.url ?? '')
    this.notion = new NotionCache(notionImpl);
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range.from.toDate();
    const to = range.to.toDate();

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
