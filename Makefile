plugin:
	cd plugin && yarn install
service-proxy:
	cd service-proxy && mvn clean install
images: plugin service-proxy
	docker build -t quay.io/ikanello/quarkus-openshift-console-plugin:latest plugin
	docker build -t quay.io/ikanello/quarkus-openshift-console-produi-proxy:latest -f service-proxy/src/main/docker/Dockerfile.jvm service-proxy 
push: 
	docker push quay.io/ikanello/quarkus-openshift-console-plugin:latest
	docker push quay.io/ikanello/quarkus-openshift-console-produi-proxy:latest
deploy:
	./bin/quarkus-install-openshift-console-plugin
	cd service-proxy && \
	quarkus deploy openshift --image-build --namespace plugin-quarkus-openshift-console-plugin
undeploy:
	helm uninstall quarkus-openshift-console-plugin --namespace=plugin-quarkus-openshift-console-plugin
all: images push deploy
