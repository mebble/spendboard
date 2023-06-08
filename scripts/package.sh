pnpm build
rm -rf mebble-spendboard-datasource
mv dist mebble-spendboard-datasource
zip mebble-spendboard-datasource-1.0.0.zip mebble-spendboard-datasource -r
md5 mebble-spendboard-datasource-1.0.0.zip

