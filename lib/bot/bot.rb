class Bot
  attr_reader :name, :responders

  def initialize(name, responders)
    @name = name
    @responders = responders
  end

  def respond(text)
    responder(text).response
  end

  private

  def responder(text)
    @responders.find { |r| r.respond?(text) }
  end
end
