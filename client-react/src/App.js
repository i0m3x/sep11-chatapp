/* globals fetch prompt */
import Chat from './Chat'
import Rooms from './Rooms'
import MessageForm from './MessageForm'
import LoginForm from './LoginForm'
import Signup from './Signup'
import React from 'react'
import io from 'socket.io-client'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom"
import './App.css'
import logo from './chat_title_2.png'




const socket = io()



class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = { messages: [], nick: null, loggedIn: false }
  }

  componentDidMount () {
    socket.on('chat message', msg => {
      console.log('Got a message:', msg)
      console.log(this.state.loggedIn, 'loggedIn state')
      this.setState({ messages: this.state.messages.concat(msg) })
    })

    // Get initial list of messages
    fetch('/messages')
      .then(response => response.json())
      .then(data => {
        console.log('fetched data from server')
        this.setState({ messages: data })
      })
  }
  loginFunc(nick, password) {
    this.setState({
      nick: nick,
      loggedIn: true,
    })
  }

  sendMessage (text, messageRoom) {
    const message = { text: text, nick: this.state.nick, room: messageRoom, date: new Date() }
    socket.emit('chat message', message)
  }

  handleAddRoom () {
    const room = prompt('Enter a room name')
    this.setState({ room: room })
  }


  getRooms () {
    const rooms = this.state.messages.map(msg => msg.room)
    rooms.push(this.state.room) // we have to add the currentRoom to the list, otherwise it won't be an option if there isn't already a message with that room
    const filtered = rooms.filter(room => room) // filter out undefined or empty string
    return Array.from(new Set(filtered)) // filters out the duplicates
  }

  logMeOut() {
    this.setState({loggedIn: false})
  }

  render () {
    return (
      <Router>
        <div>
          <div className="logo">
            <img src={logo} alt="logo"/>
          </div>
        <div id="menu-outer"> 
          <div className="table">
            <ul id="horizontal-list">
              <li>
                <Link to="/signup"><button>Sign Up</button></Link>
              </li>
              {this.state.loggedIn 
                ?
              <li>
                <Link to="/logout" onClick={this.logMeOut.bind(this)}><button>Log {this.state.nick} Out</button></Link>}
              </li> 
                : ''}
              <li>
                <Link to="/login"><button>Log In</button></Link>
              </li>
              <li>
                <Link to="/rooms/general"><button>Chat</button></Link>
              </li>
              <li>
                <Link to="/"><button>Home</button></Link>
              </li>
            </ul>
          </div>
        </div>
        <Switch>
          <Route path="/signup">
          {this.state.loggedIn 
            ? <Redirect to="/" />  
            : <Signup loginFunc={this.loginFunc.bind(this)}/>}
          </Route>

          <Route path="/logout" >
            <Redirect to='/login' />
          </Route>

          <Route path="/login">
          {this.state.loggedIn 
            ? <Redirect to="/" />
            : <LoginForm loginFunc={this.loginFunc.bind(this)}/>}

          </Route>
          <Route path="/rooms/:room">
            <Chat sendMessage={this.sendMessage.bind(this)} messages={this.state.messages}/>
          </Route>
          <Route path="/">
          {this.state.loggedIn
            ? <Rooms
            rooms={this.getRooms()}
            handleAddRoom={this.handleAddRoom.bind(this)}
            />
            : <Redirect to="/login" />}
          </Route>
        </Switch>

    </div>
    </Router>
    )
  }
}

export default App

//assignment. make ternaries from rooms - sensei dustino