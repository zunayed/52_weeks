setup:
	# requirements hugo, make, firebase cli, node, gsutil, gcloud
	gsutil -m rsync -r gs://zunayed/images/ static/images/

build:
	rm -rf static/js_playground/*
	rsync -h -av --exclude='*.git*' subprojects/noisyNYC static/js_playground/ 
	rsync -h -av --exclude='*.git*' --exclude='node_modules' --exclude='src' subprojects/wedding static/js_playground/
	gsutil -m rsync -r static/images/ gs://zunayed/images/
	hugo
serve:
	hugo serve
