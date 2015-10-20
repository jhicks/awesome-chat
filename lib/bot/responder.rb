class Responder
  attr_reader :test, :response

  def initialize(test, response)
    @test = test
    @response = response
  end

  def respond?(text)
    @test.call(text)
  end
end
