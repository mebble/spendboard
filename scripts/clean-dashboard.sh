#!/bin/sh
# https://stackoverflow.com/a/36577521/5811761

jq '(.panels |= map(del(.datasource))) |
    ((.panels[]
      | select(has("targets"))
      | .targets) |= map(del(.datasource)))' --indent 4 ./grafana/dashboard.json > tmpfile && mv tmpfile ./grafana/dashboard.json

