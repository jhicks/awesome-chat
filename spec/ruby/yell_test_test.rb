require 'minitest/autorun'
require_relative '../../lib/bot/tests/yell'

describe Tests::Yell do
  it 'returns true when text is all upper case' do
    subject = Tests::Yell.new
    subject.call(nil).must_equal false
    subject.call('test').must_equal false
    subject.call(123).must_equal false
    subject.call('I AM UPPERCASE').must_equal true
    subject.call('I Am MixeD case').must_equal false
    subject.call('I AM UPPERCASE WITH 123 NUMBERS').must_equal true
  end
end

