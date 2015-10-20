module Tests
  class Yell
    def call(text)
      text != nil && test(text.to_s)
    end

    private

    def test(text)
      no_lowercase?(text) && uppercase?(text)
    end

    def no_lowercase?(text)
      /[a-z]/.match(text) == nil
    end

    def uppercase?(text)
      /[A-Z]+/.match(text) != nil
    end
  end
end
