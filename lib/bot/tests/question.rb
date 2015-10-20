module Tests
  class Question
    def call(text)
      text != nil && (/\?$/ =~ text.to_s.strip) != nil
    end
  end
end
