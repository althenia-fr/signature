#!/bin/bash
 #npm run build
 gcloud auth login  admin@althenia.fr
 gcloud config set project sign-stimeo-20260415
 gcloud app deploy ./app.yaml -v 1
