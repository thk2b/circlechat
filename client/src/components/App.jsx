import React from 'react';
import axios from 'axios'

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      messages: [],
      inputText: ''
    }
  }
  componentDidMount(){
    this.getMessages()
  }
  getMessages(){
    axios.get(`http://${document.location.hostname}/api/messages`)
    .then( ({ data }) => this.setState({ messages: data.messages }))
    .catch(console.error)
  }
  postMessage(){
    axios.post(`http://${document.location.hostname}/api/message`, {
      text: this.state.inputText
    })
    .then( ({ data }) => {
      this.setState({
        messages: this.state.messages.concat(data.message),
        inputText: ''
      })
    })
    .catch(console.error)
  }
  render() {
    return (
      <main>
        <header>
          <h1>Welcome to message-board</h1>
        </header>
        <ul>
          {this.state.messages.map(
            message => <li key={message.id}>
              <p>{message.text}</p>
              <span>{message.sent_at}</span>
            </li>
          )}
        </ul>
        <div>
          <label>post a message</label>
          <input 
            type="text" 
            value={this.state.inputText}
            onChange={e => this.setState({inputText: e.target.value})}
          />
          <button onClick={e => this.postMessage()}>post</button>
        </div>
      </main>
    );
  }
}

export default App;
