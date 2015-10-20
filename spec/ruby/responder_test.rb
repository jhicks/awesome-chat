require 'minitest/autorun'
require_relative '../../lib/bot/responder'

describe Responder do
  it 'has a tester' do
    Responder.new('tester', 'response').test.must_equal 'tester'
  end

  it 'has a response' do
    Responder.new('tester', 'response').response.must_equal 'response'
  end

  it 'delegates the check to the test' do
    test = ->(text) { text == 'test' }

    subject = Responder.new(test, 'response')

    subject.respond?('no match').must_equal false
    subject.respond?('test').must_equal true
  end
end
