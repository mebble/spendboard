#!/bin/bash

distdir=mebble-spendboard-datasource
version=$(node -e 'const p = require("./package.json"); console.log(p.version)')
zipfile=$distdir-$version.zip

rm -rf $distdir
rm -f $distdir-*.zip

pnpm build
mv dist $distdir
zip $zipfile $distdir -r
md5 $zipfile

export SPENDBOARD_ZIP=$zipfile
