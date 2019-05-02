function Form (props) {
  
    const [username, setUsername] = useState('');
    
    let handleSubmit = async (event) => {
      event.preventDefault();
      const res = await axios.get(`https://api.github.com/users/${username}`);
      props.addNewProfileFunction(res.data);
    };
    console.log(handleSubmit);
    
    let handleChange = (event) => {
      setUsername(event.target.value);
    }
    
    return (
        <form action="" onSubmit={handleSubmit}>
          <input 
            type="text" 
            value={username}
            onChange={handleChange}
            placeholder="GitHub username" 
            required
          />
          <button>Add a card</button>
        </form>
      ); 
  }
  
  const CardList = (props) => {
    return (
      <div>
        {props.profiles.map(profile => (<Card {...profile}/>))}
      </div>
    );
  };
  
  class Card extends React.Component {
      render() {
        return (
          <div className="github-profile">
            <img src={this.props.avatar_url} />
          <div className="info">
            <div className="name">{this.props.name}</div>
            <div className="company">{this.props.company}</div>
          </div>
          </div>
      );
    }
  }
  
  class App extends React.Component {
    
    constructor(props){
      super(props);
      this.state = {
        profiles: []
      };
    }
    
    addNewProfile = (newProfile) =>{
      console.log(newProfile);
      this.setState(prevState => ({
        profiles : [...prevState.profiles, newProfile]
      });
    }
    
      render() {
        return (
          <div>
            <div className="header">{this.props.title}</div>
          <Form addNewProfileFunction={this.addNewProfile}/>
          <CardList profiles={this.state.profiles} />
          </div>
      );
    }	
  }
  
  ReactDOM.render(
      <App title="The GitHub Cards App" />,
    mountNode,
  );