class Client
  LOBBY = '/lobby'

  attr_reader :bot, :bus

  def initialize(bot, bus)
    @bot = bot
    @bus = bus

    channels.each { |channel| subscribe(channel) }
  end

  def channels
    @channels ||= [LOBBY, "/#{@bot.name}"]
  end

  private

  def subscribe(channel)
    @bus.subscribe(channel) do |message|
      respond(channel, message) if respond?(message)
    end
  end

  def respond(channel, message)
    @bus.publish(response_channel(channel, message), response(message))
  end

  def response(message)
    { 'username' => @bot.name, 'text' => @bot.respond(message['text']) }
  end

  def response_channel(source_channel, message)
    source_channel == LOBBY ? source_channel : "/#{message['username']}"
  end

  def respond?(message)
    message['username'] != @bot.name
  end
end
