/*
  myPattern grammer:
  Character Collection: such as [a-z],[A-Z]...
  connect: 'ab' is mean that 'a' followed by 'b'
  select: 'a|b' is mean that chose 'a' or 'b'
  repeat: such as a*(0 times or more),a+(1 times or more)


*/

//Status and Edge are arrays
AllStatus = []
AllEdge = []

class Status {
	constructor (InEdges = [], OutEdges = [], FinalStatus = false) {
		this.InEdges = InEdges
		this.OutEdges = OutEdges
		this.FinalStatus = FinalStatus
	}
}

class Edge {
	constructor (MatchContent, Start, End) {
		this.MatchContent = MatchContent
		this.Start = Start
		this.End = End
	}
}





