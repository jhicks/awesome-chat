require 'faye'
require_relative 'app'

use Faye::RackAdapter, mount: '/faye', timeout: 25
run App
