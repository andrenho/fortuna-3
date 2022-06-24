SHELL=bash

all:
	@echo "make build-jar       -> generate a JAR to run as a service"
	@echo "make build-website   -> generate files to create a static website" 
	
build-jar:
	cd debugger && mvn -D skipTests install
	@echo "Your JAR is in debugger/target:"
	@ls -lh debugger/target/*.jar

build-website:
	mkdir -p static
	cp -R debugger/src/main/resources/static/* static/
	@echo "Static website generated in 'static'"
	ls -lh static

clean:
	cd debugger && mvn clean && cd ..
	rm -rf static
