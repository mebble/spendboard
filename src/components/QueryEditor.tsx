import React from 'react';
import { InlineField, AsyncMultiSelect } from '@grafana/ui';
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

  const onLoadOptions = async (_query: string): Promise<Tags> => {
    const res = await datasource.notion.getCategories()
    if (!res.success) {
      console.error('fail', res.error)
      return []
    }
    return res.data.map(d => ({ label: d.name, value: d.name }));
  }

  const { tags, notTags } = defaults(query, DEFAULT_QUERY);
  const selectedTags = tags.map(t => ({ label: t, value: t }));
  const negativeTags = notTags.map(t => ({ label: t, value: t }))

  return (
    <div className="gf-form">
      <InlineField label="Tags">
        <AsyncMultiSelect defaultOptions loadOptions={onLoadOptions} value={selectedTags} onChange={onTagsChange}></AsyncMultiSelect>
      </InlineField>
      <InlineField label="Not having tags">
        <AsyncMultiSelect defaultOptions loadOptions={onLoadOptions} value={negativeTags} onChange={onNegativeTagsChange}></AsyncMultiSelect>
      </InlineField>
    </div>
  );
}
