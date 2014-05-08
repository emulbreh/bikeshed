#!/usr/bin/env bash
traceur --out bikeshed/static/bikeshed.js bikeshed/static/bikeshed/init.js
sass --scss bikeshed/static/css/bikeshed.scss > bikeshed/static/bikeshed.css
