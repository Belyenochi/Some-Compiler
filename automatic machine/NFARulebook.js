class FARule {
  constructor(state, character, next_state) {
    this._state = state
    this._character = character
    this._next_state = next_state
  }

  appliesTo(state, character) {
    return this._state == state && this._character == character
  }

  follow() {
    return this._next_state
  }

  toString() {
    return `#<FARule ${this.state} -- ${this._character}>`
  }
}

class DFARulebook {
  constructor(rules) {
    this._rules = rules
  }

  next_state(state, character) {
    let rule = this.rule_for(state, character)

    return rule ? rule.follow() : false
  }

  rule_for(state, character) {

    let findNextState = this._rules.find((rule) => {
      return rule.appliesTo(state, character)
    })

    return findNextState !==  undefined ? findNextState : false
  }
}

class DFA {
  constructor(current_state, accept_states, rulebook) {
    this._current_state = current_state
    this._accept_states = accept_states
    this._rulebook = rulebook
  }

  accepting() {
    return this._accept_states.indexOf(this.current_state) != -1
  }

  read_character(character, save_current_state) {
    let next_state = this._rulebook.next_state(this.current_state, character)

    this.current_state = (next_state === false ? save_current_state : next_state)
  }

  read_string(string) {
    let save_current_state,read_string = Array.from(string)
    save_current_state = this._current_state

    read_string.forEach((item) => {
      this.read_character(item, save_current_state)
    })

    this._current_state === false ? save_current_state : this._current_state
  }
}

class DFADesign {
  constructor(start_state, accept_states, rulebook) {
    this._start_state = start_state
    this._accept_states = accept_states
    this._rulebook = rulebook
  }

  to_dfa() {
    return new DFA(this._start_state, this._accept_states, this._rulebook)
  }

  accepts(string) {
    let dfa = this.to_dfa()
    dfa.read_string(string)


    return dfa.accepting()
  }
}

class NFARulebook {
  constructor(rules) {
    this._rules = rules
  }

  next_states(states, character) {
    //[].concat.apply([], array) 将会将array数组里的每一个元素拆开作为参数传给[],这是一种hack式的数组降维
    let next_statesAll = [].concat.apply([], (Array.from(states).map( (state) => {return this.follow_rules_for(state, character)})))

    return next_statesAll.length > 0 ? new Set(next_statesAll) : false
  }

  follow_rules_for(state, character) {
    return this.rules_for(state, character).map((item) => {return item.follow()})
  }

  rules_for(state, character) {
    return this._rules.filter((item) => {return item.appliesTo(state, character)})
  }

  follow_epsilon_moves(states) {
    let more_states,next_e_state // Set
    more_states = this.next_states(states, 'nil')
    more_states = more_states.size !== 0 ? more_states : new Set([]) // 保证more_states是iterable


    // 如果more_states不在增长说明这个状态不存在nil状态转移了
    if (next_e_state = this.next_states(more_states, 'nil') === false) {
      return Array.from(more_states)
    } else {
      //console.log(more_states)
      return [...more_states, ...this.follow_epsilon_moves(more_states)]
    }
  }

  alphabet() {
    return Array.from(new Set(this._rules.map((item) => {
      return item.character}).filter((item) => {return item != 'nil'})))
  }
}

class NFA {
  constructor(current_state, accept_states, rulebook) {
    this._current_state = current_state
    this._accept_states = accept_states
    this._rulebook = rulebook
    this.init()
  }

  read_character(character) {
    let next_states = this._rulebook.next_states(this.current_state, character)

    this.current_state = (next_states === false ? save_current_state : next_state)
  }

  read_string(string) {
    let save_current_state,read_string = Array.from(string)
    save_current_state = this._current_state

    read_string.forEach((item) => {
      this.read_character(item, save_current_state)
    })

    this._current_state === false ? save_current_state : this._current_state
  }

  accepting() {
    return this._accept_states.filter(x => this._current_state.has(x)).length != 0
  }

  init() {
    this._current_state = Array.from(new Set([...this._rulebook.follow_epsilon_moves(this._current_state),...this._current_state]))
  }

  // a DFARulebook
  to_dfa() {
    let current_states, new_states_table = new Map(), new_input_list = [], new_DFARulebook = [], new_states_table_index,
        states_stack = [],new_DFA_start_state,new_DFA_accept_state = []
    // 提取所有输入字符规则

    this._rulebook._rules.forEach((item) => {
      if (item._character !== 'nil') {
        new_input_list.push(item._character)
      }
    })
    new_input_list = Array.from(new Set(new_input_list))

    current_states = Array.from(this._current_state)
    states_stack.push(current_states)
    // 累加原状态作为新状态编号(最小构造算法建表不选择重复)

    new_states_table_index = current_states.reduce((prev, curr) => prev + curr )
    new_states_table.set(new_states_table_index,'start')

    while (states_stack.length !== 0) {
      let current_states = states_stack.pop(),next_states,next_statesAll

      for (let i = 0; i < new_input_list.length; i++) {
        next_states = this._rulebook._rules.filter((item) => {
          return current_states.includes(item._state) && item._character === new_input_list[i]
        }).map((item) => {return item._next_state})

        if (next_states.length !== 0) {
          next_statesAll = Array.from(new Set([...this._rulebook.follow_epsilon_moves(next_states), ...next_states]))

          // 如果新的DFA表里没有这个translate，那么添加进这个DFA
          new_states_table_index = next_statesAll.reduce((prev, curr) => prev + curr )

          if (new_states_table.get(new_states_table_index) === undefined) {

            // 判断是否含有终止状态
            let accept_states = next_statesAll.filter((state) => this._accept_states.includes(state))
            if (accept_states.length !== 0) {
              new_states_table.set(new_states_table_index,'accept')
            } else {
              new_states_table.set(new_states_table_index,'normal')
            }
            new_DFARulebook.push(new FARule(current_states.reduce((prev, curr) => prev + curr ), new_input_list[i], new_states_table_index))

            states_stack.push(next_statesAll)
          } else {
            new_DFARulebook.push(new FARule(current_states.reduce((prev, curr) => prev + curr ), new_input_list[i], new_states_table_index))
          }
        }
      }
    }
    // current_states.map((item) => {return })
    // 提取出结束状态和初始状态
    new_states_table.forEach((value, key) => {
      if (value === 'start') {
        new_DFA_start_state = key
      } else if (value === 'accept') {
        new_DFA_accept_state.push(key)
      }
    })

    return new DFADesign(new_DFA_start_state, new_DFA_accept_state, new DFARulebook(new_DFARulebook))
  }
}

class NFADesign {
  constructor(start_state, accept_states, rulebook) {
    this._start_state = start_state
    this._accept_states = accept_states
    this._rulebook = rulebook
  }

  to_nfa(current_states = new Set([this._start_state])) {

    return new NFA(current_states, this._accept_states, this._rulebook)
  }

  accepts(string) {
    let nfa = this.to_nfa()
    nfa.read_string(string)


    return nfa.accepting()
  }
}
// The class 'NFASimulation' translates epsilon-NFA to DFA
/*class NFASimulation{
	constructor(nfa_design) {
		this._nfa_design = nfa_design
	}

	next_states(state, character) {
		let nfa = this._nfa_design.to_nfa(state)
		nfa.read_character(character)
		return nfa._current_states
	}

	rules_for(state) {
		return this._nfa_design._rulebook.alphabet().map((character) => {
			return new FARule(state, character, this.next_states(state, character))
		})
	}

	discover_states_and_rules(states) {
		let rules, more_states

		rules = [].concat.apply([], (Array.from(states).map((state) => {return this.rules_for(state)})))
		more_states = new Set(rules.map((item) => {return item.follow}))

		if (more_states.size <= states.size) {
  		return [states, rules]
  	} else {
  		return this.discover_states_and_rules(states + more_states)
  	}
	}

	to_dfa_design() {
		let start_state,states, rules,accept_states

		start_state = this._nfa_design.to_nfa()._current_states
		states, rules = discover_states_and_rules(new Set([start_state]))
		accept_states = states.find((item) => {
			return this._nfa_design.to_nfa(state).accepting()
		})

		return new DFADesign.new(start, accept_states, new DFARulebook(rules))
	}
}*/

var rulebook = new NFARulebook([
  new FARule(1, 'a', 1),new FARule(1, 'a', 2),new FARule(1, 'nil', 2),
  new FARule(2, 'b', 3),
  new FARule(3, 'b', 1),
  new FARule(3, 'nil', 2)
])

/*rulebook.next_states(new Set([1]), 'nil')

nfa_design = new NFADesign(1, [2, 4], rulebook)

nfa_design.accepts('aa')

nfa_design.accepts('aaa')

nfa_design.accepts('aaaaa')

nfa_design.accepts('aaaaaa')*/

/*nfa_design = new NFADesign(1, [4], rulebook)
console.log(nfa_design.accepts('bbabb'))*/

var nfa_design = new NFADesign(1, [3], rulebook)

console.log(nfa_design.to_nfa().to_dfa())