class FARule {
  constructor(state, character, next_state) {
    this._state = state;
    this._character = character;
    this._next_state = next_state;
  }

  appliesTo(state, character) {
    return this._state == state && this._character == character
  }

  follow() {
    return this._next_state;
  }

  toString() {
    return `#<FARule ${this.state} -- ${this._character}>`;
  }
}

class NFARulebook {
  constructor(rules) {
    this._rules = rules;
  }

  next_states(states, character) {
    //[].concat.apply([], array) 将会将array数组里的每一个元素拆开作为参数传给[],这是一种hack式的数组降维
    return new Set([].concat.apply([], (Array.from(states).map( (state) => {return this.follow_rules_for(state, character)})));
  }

  follow_rules_for(state, character) {
    return this.rules_for(state, character).map((item) => {return item.follow()})
  }

  rules_for(state, character) {
    return this._rules.filter((item) => {return item.appliesTo(state, character)});
  }

  follow_epsilon_moves(states) {
  	let more_states = this.next_states(states, 'nil');

  	if (more_states.size <= states.size) {
  		return states;
  	} else {
  		return this.follow_epsilon_moves(new Set([...states, ...more_states]));
  	}
  }

  alphabet() {
  	return Array.from(new Set(this._rules.map((item) => {
  		return item.character}).filter((item) => {return item != 'nil'})));
  }
}

class NFA {
  constructor(current_state, accept_states, rulebook) {
    this._current_state = current_state;
    this._accept_states = accept_states;
    this._rulebook = rulebook;
    this.init();
  }

  read_character(character) {
    let next_state = this._rulebook.next_states(this.current_state, character)

    return this.current_state = (next_state === false ? save_current_state : next_state)
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
    return this._accept_states.filter(x => this._current_state.has(x)).length != 0;
  }

  init() {
  	this._current_state = this._rulebook.follow_epsilon_moves(this._current_state)
  }
}

class NFADesign {
  constructor(start_state, accept_states, rulebook) {
    this._start_state = start_state
    this._accept_states = accept_states
    this._rulebook = rulebook
  }

  to_nfa(current_states = new Set([this._start_state])) {
  	console.log(current_states);
    return new NFA(current_states, this._accept_states, this._rulebook)
  }

  accepts(string) {
    let nfa = this.to_nfa()
    nfa.read_string(string)


    return nfa.accepting()
  }
}

class NFASimulation{
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

		rules = concatArray(Array.from(states).map( (state) => {return this.rules_for(state)}))
		more_states = new Set(rules.map((item) => {return item.follow}))

		if (more_states.size <= states.size) {
  		return [states, rules]
  	} else {
  		return this.discover_states_and_rules(states + more_states)
  	}
	}

	to_dfa_design() {
		let start_state,states, rules,accept_states;

		start_state = this._nfa_design.to_nfa()._current_states
		states, rules = discover_states_and_rules(new Set([start_state]))
		accept_states = states.find((item) => {
			return this._nfa_design.to_nfa(state).accepting()
		})

		return new DFADesign.new(start, accept_states, new DFARulebook(rules))
	}
}

var rulebook = new NFARulebook([
  new FARule(1, 'a', 1),new FARule(1, 'a', 2),new FARule(1, 'nil', 2),
  new FARule(2, 'b', 3),
  new FARule(3, 'b', 1),
  new FARule(3, 'nil', 2)
]);

/*rulebook.next_states(new Set([1]), 'nil')

nfa_design = new NFADesign(1, [2, 4], rulebook)

nfa_design.accepts('aa')

nfa_design.accepts('aaa')

nfa_design.accepts('aaaaa')

nfa_design.accepts('aaaaaa')*/

/*nfa_design = new NFADesign(1, [4], rulebook);
console.log(nfa_design.accepts('bbabb'));*/

var nfa_design = new NFADesign(1, [3], rulebook)

console.log(nfa_design.to_nfa())