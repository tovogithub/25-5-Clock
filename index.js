var audio = document.getElementById("beep");
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakNumbering: 5,
      sessionNumbering: 25,
      clockTimer: 25 * 60,
      updateTimer: "Session",
      isPlaying: false,
      looping: "",
    };
  }

  componentWillUnmont() {
    clearInterval(this.looping);
  }

  handleClick_PlayPause = () => {
    let { isPlaying } = this.state;
    if (isPlaying) {
      clearInterval(this.looping);
      this.setState({
        isPlaying: false,
      });
    } else {
      this.setState({ isPlaying: true });

      this.looping = setInterval(() => {
        const { clockTimer, updateTimer, breakNumbering, sessionNumbering } =
          this.state;
        if (clockTimer === 0) {
          this.setState({
            updateTimer: updateTimer === "Session" ? "Break" : "Session",
            clockTimer:
              updateTimer === "Session"
                ? breakNumbering * 60
                : sessionNumbering * 60,
          });

          audio.play();
        } else {
          this.setState({
            clockTimer: clockTimer - 1,
          });
        }
      }, 1000);
    }
  };

  handleClick_Reset = () => {
    this.setState({
      breakNumbering: 5,
      sessionNumbering: 25,
      clockTimer: 25 * 60,
      updateTimer: "Session",
      isPlaying: false,
    });

    clearInterval(this.looping);
    audio.pause();
    audio.currentTime = 0;
  };

  transformation = (number) => {
    let mins = Math.floor(number / 60);
    let secs = number % 60;
    mins = mins < 10 ? "0" + mins : mins;
    secs = secs < 10 ? "0" + secs : secs;
    return `${mins}:${secs}`;
  };

  handleChangeLength = (number, timerType) => {
    let {
      sessionNumbering,
      breakNumbering,
      isPlaying,
      updateTimer,
      clockTimer,
    } = this.state;
    let newNumber;
    if (timerType === "session") {
      newNumber = sessionNumbering + number;
    } else {
      newNumber = breakNumbering + number;
    }
    if (newNumber > 0 && newNumber < 61 && !isPlaying) {
      this.setState({
        [`${timerType.toLowerCase()}Numbering`]: newNumber,
      });
      if (updateTimer.toLowerCase() === timerType) {
        this.setState({
          clockTimer: newNumber * 60,
        });
      }
    }
  };
  render() {
    let {
      breakNumbering,
      sessionNumbering,
      clockTimer,
      updateTimer,
      isPlaying,
    } = this.state;
    let breakProps = {
      title: "Break",
      count: breakNumbering,
      handleDecrement: () => this.handleChangeLength(-1, "break"),
      handleIncrement: () => this.handleChangeLength(1, "break"),
    };

    const sessionProps = {
      title: "Session",
      count: sessionNumbering,
      handleDecrement: () => this.handleChangeLength(-1, "session"),
      handleIncrement: () => this.handleChangeLength(1, "session"),
    };

    return (
      <div>
        <div className="loop">
          <SetTimer {...breakProps} />
          <SetTimer {...sessionProps} />
        </div>
        <div className="clock">
          <h1 id="timer-label">{updateTimer}</h1>
          <span id="time-left">{this.transformation(clockTimer)}</span>

          <div className="style">
            <button id="start_stop" onClick={this.handleClick_PlayPause}>
              <i
                className={`fas fa-${
                  isPlaying ? "circle-pause" : "circle-play"
                }`}
              />
            </button>
            <button id="reset" onClick={this.handleClick_Reset}>
              <i className="fas fa-refresh" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}
const SetTimer = (props) => {
  let id = props.title.toLowerCase();
  return (
    <div className="container">
      <h2 id={`${id}-label`}>{props.title} Length</h2>

      <div className="control">
        <button id={`${id}-decrement`} onClick={props.handleDecrement}>
          <i className="fas fa-minus" />
        </button>
        <span id={`${id}-length`}>{props.count}</span>
        <button id={`${id}-increment`} onClick={props.handleIncrement}>
          <i className="fas fa-plus" />
        </button>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
