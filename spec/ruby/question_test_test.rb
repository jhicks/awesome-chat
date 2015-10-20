require 'minitest/autorun'
require_relative '../../lib/bot/tests/question'

describe Tests::Question do
  it 'returns true for text ending with a question mark' do
    subject = Tests::Question.new
    subject.call('How are you?').must_equal true
    subject.call('How are you').must_equal false
    subject.call('?How are you').must_equal false
    subject.call('How are? you').must_equal false
    subject.call(nil).must_equal false
    subject.call('').must_equal false
    subject.call('this is a test').must_equal false
  end
end

