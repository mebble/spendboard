#!/bin/bash

version=1.0.0
distdir=mebble-spendboard-datasource
zipfile=$distdir-$version.zip
rm -rf $distdir
rm $zipfile
pnpm build
mv dist $distdir
zip $zipfile $distdir -r
md5 $zipfile

