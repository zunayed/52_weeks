build:
	rm -rf static/js_playground/*
	rsync -h -av --exclude='*.git*' subprojects/noisyNYC static/js_playground/ 
	rsync -h -av --exclude='*.git*' --exclude='node_modules' --exclude='src' subprojects/wedding static/js_playground/
	hugo

