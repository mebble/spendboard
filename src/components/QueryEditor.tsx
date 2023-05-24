import React, { ChangeEvent } from 'react';
import { InlineField, Input, AsyncMultiSelect } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from '../datasource';
import { DEFAULT_QUERY, MyDataSourceOptions, MyQuery } from '../types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;
type Tags = Array<SelectableValue<string>>;

export function QueryEditor({ query, onChange, onRunQuery, datasource }: Props) {
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

  const onTagsChange = (tags: Tags) => {
    onChange({ ...query, tags: tags.map(t => t.value!) })
  }

  const onLoadOptions = async (_query: string): Promise<Tags> => {
    const res = await datasource.notion.getCategories()
    if (!res.success) {
      console.error('fail', res.error)
      return []
    }
    return res.data.map(d => ({ label: d.name, value: d.name }));
  }

  const {
    amplitude = DEFAULT_QUERY.amplitude,
    frequency = DEFAULT_QUERY.frequency,
    tags = DEFAULT_QUERY.tags
  } = query;
  const selectedTags = tags.map(t => ({ label: t, value: t }));

  return (
    <div className="gf-form">
      <InlineField label="Amplitude">
        <Input onChange={onAmplitudeChange} value={amplitude} width={8} type="number" step="0.1" />
      </InlineField>
      <InlineField label="Frequency">
        <Input onChange={onFrequencyChange} value={frequency} width={8} type="number" step="0.1" />
      </InlineField>
      <InlineField label="Tags">
        <AsyncMultiSelect defaultOptions loadOptions={onLoadOptions} value={selectedTags} onChange={onTagsChange}></AsyncMultiSelect>
      </InlineField>
    </div>
  );
}
