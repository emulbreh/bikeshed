#!/usr/bin/env bash
traceur --out pldm/static/pldm.js pldm/static/pldm/init.js
sass --scss pldm/static/css/pldm.scss > pldm/static/pldm.css
