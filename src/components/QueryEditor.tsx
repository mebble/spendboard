import React, { ChangeEvent } from 'react';
import { InlineField, Input } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from '../datasource';
import { DEFAULT_QUERY, MyDataSourceOptions, MyQuery } from '../types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export function QueryEditor({ query, onChange, onRunQuery }: Props) {
  const onQueryTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, queryText: event.target.value });
  };

  const onAmplitudeChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, amplitude: parseFloat(event.target.value) });
    // executes the query
    onRunQuery();
  };

  const onFrequencyChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, frequency: parseFloat(event.target.value) });
    // executes the query
    onRunQuery();
  };

  const { queryText, amplitude, frequency } = query;

  return (
    <div className="gf-form">
      <InlineField label="Amplitude">
        <Input onChange={onAmplitudeChange} value={amplitude} width={8} type="number" step="0.1" defaultValue={DEFAULT_QUERY.amplitude} />
      </InlineField>
      <InlineField label="Frequency">
        <Input onChange={onFrequencyChange} value={frequency} width={8} type="number" step="0.1" defaultValue={DEFAULT_QUERY.frequency} />
      </InlineField>
      <InlineField label="Query Text" labelWidth={16} tooltip="Not used yet">
        <Input onChange={onQueryTextChange} value={queryText || ''} />
      </InlineField>
    </div>
  );
}
