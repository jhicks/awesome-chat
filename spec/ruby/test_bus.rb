class TestBus
  attr_reader :channels
  attr_reader :stream

  def initialize
    @channels = []
    @stream = {'/lobby' => []}
  end

  def subscribe(channel, &block)
    @channels << [channel, block]
  end

  def publish(channel, message)
    @stream[channel] = [] unless @stream.key?(channel)
    @stream[channel] << message
  end
end
