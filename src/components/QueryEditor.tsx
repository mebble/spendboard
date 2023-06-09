import React, { ChangeEvent } from 'react';
import { InlineField, AsyncMultiSelect, Input, Checkbox } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from '../datasource';
import { DEFAULT_QUERY, MyDataSourceOptions, MyQuery } from '../types';
import { defaults } from 'lodash';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;
type Tags = Array<SelectableValue<string>>;

export function QueryEditor({ query, onChange, onRunQuery, datasource }: Props) {
  const onTagsChange = (tags: Tags) => {
    onChange({ ...query, tags: tags.map(t => t.value!) })
    onRunQuery();
  }

  const onNegativeTagsChange = (tags: Tags) => {
    onChange({ ...query, notTags: tags.map(t => t.value!) })
    onRunQuery();
  }

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, name: event.target.value })
  }

  const onDepreciatingChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, depreciating: event.target.checked })
    onRunQuery()
  }

  const onLoadOptions = async (_query: string): Promise<Tags> => {
    const res = await datasource.notion.getCategories()
    if (!res.success) {
      console.error('fail', res.error)
      return []
    }
    return res.data.map(d => ({ label: d.name, value: d.name }));
  }

  const { tags, notTags, name, depreciating } = defaults(query, DEFAULT_QUERY);
  const selectedTags = tags.map(t => ({ label: t, value: t }));
  const negativeTags = notTags.map(t => ({ label: t, value: t }))

  return (
    <div className="gf-form" style={{alignItems: 'center', gap: '0.5rem'}}>
      <InlineField label="Has tags">
        <AsyncMultiSelect defaultOptions loadOptions={onLoadOptions} value={selectedTags} onChange={onTagsChange}></AsyncMultiSelect>
      </InlineField>
      <InlineField label="Not having tags">
        <AsyncMultiSelect defaultOptions loadOptions={onLoadOptions} value={negativeTags} onChange={onNegativeTagsChange}></AsyncMultiSelect>
      </InlineField>
      <InlineField label="Name">
        <Input type="text" placeholder="Your expense's name" value={name} onChange={onNameChange}></Input>
      </InlineField>
      <InlineField>
        <Checkbox label="Depreciating" value={depreciating} onChange={onDepreciatingChange} />
      </InlineField>
    </div>
  );
}
