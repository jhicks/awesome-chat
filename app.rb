require 'sinatra/base'
require 'tilt/erb'
require 'json'

class App < Sinatra::Application
  USERS = ['Bob']

  get '/' do
    username = "User#{USERS.length + 1}"
    USERS << username

    erb :index, locals: { username: username, users: USERS }
  end
end
