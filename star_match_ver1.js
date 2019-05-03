// v1 STAR MATCH - Starting Template

/*
PlayNumber is a React function Component.
It renders a button on the screen, with a number as the label.
The number comes from the props object.
The backgroundColor of the button depends on the props.status
*/
const PlayNumber = (props) => (
    <button 
      className="number" 
      onClick={() => (props.onClick(props.number, props.status))}
      style={{backgroundColor: colors[props.status]}}
      >
      {props.number}
    </button> 
);

const PlayAgain = (props) => (
  <div className="game-done">
    <div 
      className="message"
      style={{color:props.gameStatus === 'lost' ? 'red' : 'green'}}
      >
      {props.gameStatus === 'lost' ? 'Game Over': 'Nice'}
    </div>
    <button onClick={props.onClick}>
      Play Again
    </button>
  </div>
);

/*
StarsDisplay is a React function component.
Its props include a how many stars to render.
*/
const StarsDisplay = (props) => (
  // we use empty JSX tag to return fragments
  // we cant just return multiple jsx elements
  // we can also use React.Fragment or just Fragment
  <>
         {
            utils.range(1, props.stars).map(starId => 
            <div className="star" key={starId} />
          )}
  </>
);

/*
StarMatch is a React function Component for the entire game.
*/
const Game = (props) => {
  // number of stars is a state variable
  const [stars, setStars] = useState(utils.random(1,9));
  // this is the available number the user can pick
  const [availableNums, setAvailableNums] = useState(utils.range(1,9));
  // candidates are numbers user clicked on
  const [candidateNums, setCandidateNums] = useState([]);
  // the chosen candidates are wrong if the sum of their numbers is greater than the number of stars
  const candidatesAreWrong = utils.sum(candidateNums) > stars;
  
  const [secondsLeft, setSecondsLeft] = useState(10);
  useEffect(() => {
    if (secondsLeft > 0 && availableNums.length > 0){
      const timerId = setTimeout(() => {
        setSecondsLeft(secondsLeft -1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  });
  
  const gameStatus = availableNums.length === 0 ? 'won': secondsLeft === 0 ? 'lost' : 'active';
  
  const resetGame = () => {
    setStars(utils.random(1,9));
    setAvailableNums(utils.range(1,9));
    setCandidateNums([]);
  }
  
  /* this arrow function takes a number and return its status
  If the number is not available then return used. This will make the button green.
  If its part of the candidates, return candidate if it can be right, or wrong if the candidates are wrong.
  */
  const numberStatus = (number) => {
    if (!availableNums.includes(number)){
      return 'used';
    }
    if (candidateNums.includes(number)){
      return candidatesAreWrong ? 'wrong' : 'candidate';
    }
    return 'available';
  };
  
  /*
  This function will be passed in the props of each PlayNumber
  When the user clicks on one of the buttons this function is invoked.
  This callback function gets the number clicked on and its current status (passed from the PlayNumber)
  if the number has been already used, nothing happens.
  if its not used, add it to the candidateNums array.
  If the sum of the candidates do not equal the number of stars, update the candidates nums array
  state variable.
  If the sume of the candidates equal the number of stars then filter out the picked candidates
  from the available numbers and generate new random stars count,
  update the available numbers state variable using its hook,
  update the candidates nums state variable using its hook into an empty array
  */
  const onNumberClick = (number, currentStatus) => {
    //currentStatus => newStatus
    if (gameStatus !== 'active' || currentStatus == 'used'){
      return;
    }
    const newCandidateNums = 
          currentStatus === 'available' ? 
          candidateNums.concat(number) : candidateNums.filter(cn => cn !== number);
    if (utils.sum(newCandidateNums) !== stars){
      setCandidateNums(newCandidateNums);
    }
    else{
      const newAvailabeNums = availableNums.filter(
        n => !newCandidateNums.includes(n)
      );
      setStars(utils.randomSumIn(newAvailabeNums, 9));
      setAvailableNums(newAvailabeNums);
      setCandidateNums([]);
    }
  };
  
  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {/*pass the number of stars to StarsDisplay function Component*/}
           {gameStatus !== 'active' ? (
            <PlayAgain onClick={props.startNewGame} gameStatus={gameStatus} />
          ) : (
            <StarsDisplay stars={stars} />
          )}
        </div>
        <div className="right">
          {
            /*render 9 play numbers. each number has a status, either used, wrong, or candidate*/
            utils.range(1,9).map(number => 
                 <PlayNumber 
                   key={number} 
                   status={numberStatus(number)}
                   number={number} 
                   onClick={onNumberClick}
                   />
         )}
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
};

const StarMatch = () => {
  const [gameId, setGameId] = useState(1);
  //When we change the key of a component React will unmount the previous componenet
  // and remount a new component, this will clear all previous side effects and 
  // get new states
  return <Game key={gameId} startNewGame={() => setGameId(gameId + 1)}/>;
};


// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

// Math science
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(max * Math.random()),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length)];
  },
};

ReactDOM.render(<StarMatch />, mountNode);
