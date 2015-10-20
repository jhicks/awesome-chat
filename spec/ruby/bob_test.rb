require 'minitest/autorun'
require_relative '../../lib/bob'
require_relative 'test_bus'

describe Bob do
  def assert_responder(index, type, response)
    responder = Bob.responders[index]
    responder.wont_be_nil

    responder.test.must_be_instance_of type
    responder.response.must_equal response
  end

  it 'handles questions first' do
    assert_responder(0, Tests::Question, 'Sure.')
  end

  it 'handles yelling after questions' do
    assert_responder(1, Tests::Yell, 'Woah, chill out!')
  end

  it 'handles empty messages after yelling' do
    assert_responder(2, Tests::Empty, 'Fine. Be that way!')
  end

  it 'uses default True handler after handling yelling' do
    assert_responder(3, Tests::True, 'Whatever.')
  end

  it 'runs the bob bot on the given bus' do
    bus = TestBus.new

    client = Bob.run(bus)
    client.wont_be_nil
    client.bot.wont_be_nil
    client.bus.must_be_same_as bus
    client.bot.responders.must_equal Bob.responders
    client.bot.name.must_equal 'Bob'
  end
end
