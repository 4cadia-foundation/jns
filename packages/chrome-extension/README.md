## What is boilerplate?


Boilerplate is a base project for the implementation of a plugin that will use chrome and other browsers with javascript support and extensions.

## Instalation

To install in developer mode, use the following step-by-step:

System requeriments

- Run the command below for the installation of the node
```sh
  $ sudo apt-get update
  $ sudo apt-get install nodejs
```
- Run the command below for the installation of the npm
```sh
  $ sudo apt-get install npm 
```

- Run the command below for the installation of the gulp
```sh
  $ sudo npm -i gulp -g
```


## Boilerplate
 
- Download the boilerplate repository for your directory
- Access directory your application and run the command below: 
```sh
  :~/boilerplate-extension/$ npm install
```
- Run the command below for generate package "dist" for application
```sh
  ~/boilerplate-extension/$ gulp default
```
## Add a extension in chrome

To install in developer mode for the extension in chrome run step by step:

- Access chrome application and navigate to extensions with options>>more tools>>extensions
- Enable "Developer Mode"
- Click in "Load Unpacked"
- Access the package dist boilerplate-extensions>dist


The Chrome application will create your plugin in developer mode and make the icon available in the browser

### Watch
- Run the command below for the enable mode watch:
```sh
  ~/boilerplate-extension/$ gulp watch
```
