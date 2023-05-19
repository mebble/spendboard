import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';

import { MyQuery, MyDataSourceOptions, DEFAULT_QUERY } from './types';

type DataPoint = {
  time: number;
  value: number;
}

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    const data = options.targets.map((target) => {
      target = {
        ...target,
        amplitude: target.amplitude ?? DEFAULT_QUERY.amplitude,
        frequency: target.frequency ?? DEFAULT_QUERY.frequency,
      }
      const frame = new MutableDataFrame<DataPoint>({
        refId: target.refId,
        fields: [
          { name: 'time', type: FieldType.time },
          { name: 'value', type: FieldType.number },
        ],
      });
      addSineData(frame, target, from, to);
      return frame;
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

function addSineData(frame: MutableDataFrame<DataPoint>, query: MyQuery, from: number, to: number) {
  // duration of the time range, in milliseconds.
  const duration = to - from;

  // step determines how close in time (ms) the points will be to each other.
  const step = duration / 1000;

  for (let t = 0; t < duration; t += step) {
    frame.add({ time: from + t, value: query.amplitude * Math.sin((2 * Math.PI * query.frequency * t) / duration) });
  }
}
