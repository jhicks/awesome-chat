module Tests
  class Empty
    def call(text)
      text == nil || text.to_s.strip == ''
    end
  end
end
