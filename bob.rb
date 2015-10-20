require 'eventmachine'
require 'faye'
require_relative 'lib/bob'

EM.run {
  faye_client = Faye::Client.new('http://localhost:3000/faye')
  Bob.run(faye_client)
}
