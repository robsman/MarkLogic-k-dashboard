
![teaser image](https://cloud.githubusercontent.com/assets/15609655/18515925/5095d284-7a97-11e6-9276-75e9230dccbe.jpg)

# Sample Dasboard Application running on MarkLogic built using MarkLogic-Node (Slush) generator

# MarkLogic capabilities demonstrated in this application

## Incredibely fast integration of data from different sources/silos with siginificantly reduced ETL needs
- Loading data as-is from external data sources (RSS, Twitter, Quandl)
- Peaceful coexistence of JSON and XML data in the same database, used in the same application
- [Envelope pattern](https://developer.marklogic.com/learn/data-modeling)

## Rich set of tools that support/facilitate getting data into MarkLogic
- Using db [tasks](https://docs.marklogic.com/guide/admin/getting_started#id_49240) to schedule re-ocurring jobs (such as pulling in data updates here)
- Using [mlcp](https://docs.marklogic.com/guide/mlcp/import) to load and parse PDF documents

## Unparalleled data search and querying capabilities of MarkLogic's universal and scalar indexes
- MarkLogic Search capabilities including free-text and structured search, facets and dynamic date bucketing
- Combining multiple JSON properties and XML elements into single Fields and defining [Field range index](https://docs.marklogic.com/guide/admin/range_index#id_14554)
- Customizing the Search API to perform a on-the-fly transform of the search response
- [Highlighting](https://docs.marklogic.com/cts:highlight) of matched keywords
- Building word clouds based on [distinctive terms](https://docs.marklogic.com/guide/search-dev/similar) function

## Using and extending MarkLogic application server's capabilities to expose new functionality
- MarkLogic mathematical functions (to calculate winner/loser stock of the day/week)
- Using both XQuery and Server-side JavaScript to write server-side code
- Exposing server-side functions as REST API to be consumed by the front end

## Rapid development of UI/web applications on top of MarkLogic used the Slush node-generator stack
- Some UI goodies provided by the Slush generator: Tag Cloud, AngularJS Highcharts, document viewer (PDF and HTML)
- Last but not least: incredibly short time it takes to build such an application with MarkLogic and Slush: total effort was 12 person/days

# Cool! How can I deploy this application locally on my computer??

This application was generated by the MarkLogic-Node [Slush](https://github.com/klei/slush) generator, with the following components:

- [AngularJS](https://angularjs.org/)
- [Gulp](http://gulpjs.com/)
- [node.js](http://nodejs.org/): very thin layer, hosting the Angular code and proxying MarkLogic REST API requests
- [Roxy Deployer](https://github.com/marklogic/roxy): bootstrap MarkLogic databases, application servers, etc; scaffolding for MarkLogic REST API service extensions

## Install Required Dependencies

- [node.js](http://nodejs.org/download/)
- [npm](https://www.npmjs.com/): Built-in package manager for node (comes with
  node, but check to be sure you have latest version: `npm install -g npm`)
- [gulp](http://gulpjs.com/): Javascript task automation (`npm install -g gulp`)
- [Bower](http://bower.io/): A package manager for front-end libraries (`npm install -g bower`)
- [Git](https://git-scm.com/) - Roxy depends on this version control system
- [Ruby](https://www.ruby-lang.org/en/documentation/installation/) - Roxy
  depends on Ruby in order to run server configuration scripts

# Change setting in deploy/local.properties
Change ports, username/password for your local deployment. Here's an example content for deploy/local.properties:

```
#################################################################
# This file contains overrides to values in build.properties
# These only affect your local environment and should not be checked in
#################################################################

#
# The ports used by your application
#
app-port=9101
# Taking advantage of not needing a XCC Port for ML8
xcc-port=${app-port}
install-xcc=false

#
# the uris or IP addresses of your servers
# WARNING: if you are running these scripts on WINDOWS you may need to change localhost to 127.0.0.1
# There have been reported issues with dns resolution when localhost wasn't in the hosts file.
#
local-server=ea4-ml1
#
# Admin username/password that will exist on the local/dev/prod servers
#
user=admin
password=admin
server-version=9

mlcp-home=/Users/smitrovi/apps/mlcp-9.0-EA4
load-js-as-binary=false
```

# Running the application

    
    ./ml local bootstrap
    ./ml local deploy modules
    ./ml local deploy triggers
    ./import-config.sh

Install additional js dependencies:
    
    npm install
    bower install
    gulp init-local

Edit `./local.json` to set your desired ports: "ml-http-port" for MarkLogic http port and "node-port" for node port. If these ports are not already taken within your environment, leave the default valurs. 

The content of the local.json should be:

```
{
  "ml-version": "8",
  "ml-host": "ea4-ml1",
  "ml-admin-user": "admin",
  "ml-admin-pass": "admin",
  "ml-app-user": "admin",
  "ml-app-pass": "admin",
  "ml-http-port": "9101",
  "node-port": 9070
}
```


To run the web-server

    gulp serve-local # this will watch the .less file for changes, compile them to .css, and run the node server

For best browsing experience, use Chrome or Safari.

# Installation and deployment on server

See etc/INSTALL.md

# Data

To do a initial insert of data or a one-time, manual update, run 

    ./import-data.sh
    ./import-internal-docs.sh

This script will call other scripts that update data per data source.

Data used in this demo include several RSS feeds and Twitter status update and prices of 160 stock listed in the Frankfurt Stock Exchange available on Quandl.com.

Tasks defined in src/tasks take care of perioducally updated data from these data sources so the amaount of data in the database will grow over time.

# Adding new data sources

To add new data sources, go to config page (/config):

![](https://cloud.githubusercontent.com/assets/15609655/25166567/4d7ac7ea-24dc-11e7-869d-4d5c7bd48f3e.png)

![](https://cloud.githubusercontent.com/assets/15609655/25166573/52d32494-24dc-11e7-9d5c-340a30a40678.png)


 When adding an RSS source, make sure you add the correct encoding.
For new Twitter sources, add a new Twitter screen name.

Don't forget to click on the "Save" button when done to update the configuration file ("/config/sources.json" in the main/document dB). Otherwise, the changes will not be saved.

New sources will be ingested at the next scheduled task runs. If you want to ingest data from newly added sources immediatelly, run:

    ./import-data.sh

from the command line.