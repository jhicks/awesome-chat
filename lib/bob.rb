require_relative 'bot/responder'
require_relative 'bot/tests/question'
require_relative 'bot/tests/yell'
require_relative 'bot/tests/empty'
require_relative 'bot/tests/true'
require_relative 'bot/bot'
require_relative 'client'

class Bob
  class << self
    def responders
      @responders ||= [
        Responder.new(Tests::Question.new, 'Sure.'),
        Responder.new(Tests::Yell.new, 'Woah, chill out!'),
        Responder.new(Tests::Empty.new, 'Fine. Be that way!'),
        Responder.new(Tests::True.new, 'Whatever.')
      ]
    end

    def run(bus)
      bot = Bot.new('Bob', responders)
      Client.new(bot, bus)
    end
  end
end
