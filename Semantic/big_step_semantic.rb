class Number < Struct.new(:value)
  def to_s
    value.to_s
  end

  def inspect
    "《#{self}》"
  end
end

class Add < Struct.new(:left, :right)
  def to_s
    "#{left} + #{right}"
  end

  def inspect
    "《#{self}》"
  end
end

class Multiply < Struct.new(:left, :right)
  def to_s
    "#{left} * #{right}"
  end

  def inspect
    "《#{self}》"
  end
end

class Boolean < Struct.new(:value)
  def to_s
    value.to_s
  end

  def inspect
    "《#{self}》"
  end

  def reducible?
    false
  end
end

class Variable < Struct.new(:name)
  def to_s
    name.to_s
  end

  def inspect
    "《#{self}》"
  end

end

class LessThan < Struct.new(:left, :right)
  def to_s
    "#{left} < #{right}"
  end

  def inspect
    "《#{self}》"
  end

  def reducible?
    true
  end

  def reduce(environment)
    if left.reducible?
      LessThan.new(left.reduce(environment), right)
    elsif right.reducible?
      LessThan.new(left, right.reduce(environment))
    else
      Boolean.new(left.value < right.value)
    end
  end
end

class Assign < Struct.new(:name,:expression)
  def to_s
    "#{name} = #{expression}"
  end

  def inspect
    "《#{self}》"
  end
end

class While < Struct.new(:condition, :body)
  def to_s
    "while (#{condition}) { #{body} }"
  end

  def inspect
    "《#{self}》"
  end
end

class If < Struct.new(:condition, :consequence, :alternative)
  def to_s
    "if (#{condition}) { #{consequence} } else { #{alternative} }"
  end

  def inspect
    "《#{self}》"
  end
end

class Sequence < Struct.new(:first, :second)
  def to_s
    "#{first}; #{second}"
  end

  def inspect
    "《#{self}》"
  end
end



class Number
  def evaluate(environment)
    self
  end
end

class Boolean
  def evaluate(environment)
    self
  end
end

#变量（Variable）表达式是唯一的，这样它们的小步语义允许它们在成为一个值之前只规约一次，
#所以它们的大步语义与小步规则一样：在环境中查找变量名然后返回它的值
class Variable
  def evaluate(environment)
    environment[name]
  end
end

class Add
  def evaluate(environment)
    Number.new(left.evaluate(environment).value + right.evaluate(environment).value)
  end
end

class Multiply
  def evaluate(environment)
    Number.new(left.evaluate(environment).value * right.evaluate(environment).value)
  end
end

class LessThan
  def evaluate(environment)
    Boolean.new(left.evaluate(environment).value < right.evaluate(environment).value)
  end
end

class Assign
  def evaluate(environment)
    environment.merge({ name => expression.evaluate(environment)})
  end
end

class DoNothing
  def evaluate(environment)
    environment
  end
end

class If
  def evaluate(environment)
    case condition.evaluate(environment)
      when Boolean.new(true)
        consequence.evaluate(environment)
      when Boolean.new(false)
        alternative.evaluate(environment)
    end
  end
end

class Sequence
  def evaluate(environment)
    second.evaluate(first.evaluate(environment))
  end
end

class While
  def evaluate(environment)
    case condition.evaluate(environment)
      when Boolean.new(true)
        evaluate(body.evaluate(environment))
      when Boolean.new(false)
        environment
    end
  end
end

=begin
Number.new(23).evaluate({})
Variable.new(:x).evaluate({x: Number.new(23)})
LessThan.new(
            Add.new(Variable.new(:x), Number.new(2)),
            Variable.new(:y)
).evaluate({x: Number.new(2), y: Number.new(5)})
=end
=begin
statement =
    Sequence.new(
                Assign.new(:x, Add.new(Number.new(1),Number.new(1))),
                Assign.new(:y, Add.new(Variable.new(:x), Number.new(3)))
    )
print statement
print statement.evaluate({})
=end
=begin
statement =
  While.new(
           LessThan.new(Variable.new(:x), Number.new(5)),
           Assign.new(:x, Multiply.new(Variable.new(:x), Number.new(3)))
  )
=end
#print Number.new(5).to_ruby
#print Boolean.new(false).to_ruby
#print Variable.new(:x).to_ruby
#print eval(Variable.new(:x).to_ruby)
#print eval(Variable.new(:x).to_ruby).call({x:7})
#print Add.new(Variable.new(:x), Number.new(1)).to_ruby
#print LessThan.new(Add.new(Variable.new(:x), Number.new(1)), Number.new(3)).to_ruby
# environment = { x: 3}
# proc = eval(Add.new(Variable.new(:x), Number.new(1)).to_ruby)
# print proc.call(environment)
#
# proc = eval(
#            LessThan.new(Add.new(Variable.new(:x), Number.new(1)), Number.new(3)).to_ruby
# )
# print proc.call(environment)
statement = Assign.new(:y, Add.new(Variable.new(:x), Number.new(1)))
print statement.to_ruby
proc = eval(statement.to_ruby)
print proc.call({ x: 3})