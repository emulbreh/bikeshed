#!/usr/bin/env bash
cp bikeshed/static/traceur-runtime.js _static
traceur --out _static/bikeshed.js bikeshed/static/bikeshed/init.js
sass --scss bikeshed/static/css/bikeshed.scss > _static/bikeshed.css
