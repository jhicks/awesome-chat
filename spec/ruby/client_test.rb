require 'minitest/autorun'
require_relative '../../lib/client'
require_relative '../../lib/bot/bot'
require_relative '../../lib/bot/responder'
require_relative '../../lib/bot/tests/true'
require_relative 'test_bus'

describe Client do
  before do
    @bot = Bot.new('Testbot', [Responder.new(Tests::True.new, 'test')])
    @bus = TestBus.new
    @subject = Client.new(@bot, @bus)
  end

  it 'subscribes to the lobby' do
    Client::LOBBY.must_equal '/lobby'
    @subject.channels.must_include Client::LOBBY
    channel = @bus.channels.find { |c| c[0] == Client::LOBBY }
    channel.wont_be_nil
  end

  it "subscribes to the bot's pivate channel" do
    channel = @bus.channels.find { |c| c[0] == '/Testbot' }
    channel.wont_be_nil
  end

  it 'publishes responses to the lobby' do
    channel = @bus.channels.find { |c| c[0] == Client::LOBBY }
    channel[1].call({'username' => 'User1', 'text' => 'this is a test'})

    @bus.stream[Client::LOBBY].must_include({'username' => 'Testbot', 'text' => 'test'})
  end

  it "publishes responses to the bot's private channel" do
    channel = @bus.channels.find { |c| c[0] == '/Testbot' }
    channel[1].call({'username' => 'User1', 'text' => 'this is a test'})

    @bus.stream.keys.must_include '/User1'

    @bus.stream['/User1'].must_include({'username' => 'Testbot', 'text' => 'test'})
  end

  it 'does not respond to its own messages in the lobby' do
    channel = @bus.channels.find { |c| c[0] == Client::LOBBY }
    channel[1].call({'username' => 'Testbot', 'text' => 'this is a test'})

    @bus.stream[Client::LOBBY].must_be_empty
  end

  it 'does not respond to its own private messages' do
    channel = @bus.channels.find { |c| c[0] == '/Testbot' }
    channel[1].call({'username' => 'Testbot', 'text' => 'this is a test'})

    @bus.stream.keys.wont_include '/Testbot'
  end
end
