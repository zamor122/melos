# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
YouversionWeb::Application.initialize!

#New Relic Analytics
config.gem "newrelic_rpm"

