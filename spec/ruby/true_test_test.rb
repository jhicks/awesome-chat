require 'minitest/autorun'
require_relative '../../lib/bot/tests/true'

describe Tests::True do
  it 'returns true' do
    subject = Tests::True .new
    subject.call(nil).must_equal true
    subject.call('test').must_equal true
    subject.call(123).must_equal true
  end
end
