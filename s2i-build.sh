#!/bin/bash

s2i build . centos/nodejs-8-centos7 \
  --scripts-url file://$(pwd)/.s2i/bin \
  --runtime-image centos/httpd-24-centos7 \
  --runtime-artifact /opt/app-root/src/dist \
  bespin-ui
