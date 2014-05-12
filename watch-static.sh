#!/usr/bin/env bash
watchmedo shell-command --patterns="*.js;*.scss" --recursive --command="./make.sh" bikeshed/static/bikeshed bikeshed/static/css