require 'minitest/autorun'
require_relative '../../lib/bot/tests/empty'

describe Tests::Empty do
  it 'returns true for nil or empty text' do
    subject = Tests::Empty.new
    subject.call(nil).must_equal true
    subject.call('').must_equal true
    subject.call("\t").must_equal true
    subject.call('    ').must_equal true
    subject.call('a').must_equal false
    subject.call(1).must_equal false
  end
end
