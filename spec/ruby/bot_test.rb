require 'minitest/autorun'
require_relative '../../lib/bot/bot'
require_relative '../../lib/bot/responder'

describe Bot do
  it 'has a name' do
    subject = Bot.new('Testbot', [])
    subject.name.must_equal 'Testbot'
  end

  it 'has a list of responders' do
    subject = Bot.new('Testbot', ['responder 1', 'responder 2'])
    subject.responders.must_equal ['responder 1', 'responder 2']
  end

  it 'responds with the response from first responder that handles to the given text' do
    responders = [
      Responder.new(->(text) { text == 'test' }, 'me me'),
      Responder.new(->(text) { text != 'test' }, 'not me'),
      Responder.new(->(text) { true }, 'i am the default')
    ]

    subject = Bot.new('Testbot', responders)
    response = subject.respond('test')
    response.must_equal 'me me'
  end
end
