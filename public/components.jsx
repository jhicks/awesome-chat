(function() {
  var DestinationList = React.createClass({
    render: function() {
      var destinationNodes = this.props.destinations.map(function(destination) {
        return (
          <option key={destination} value={destination}>{destination}</option>
        );
      });

      return (
        <select>
          {destinationNodes}
        </select>
      );
    }
  });

  var Form = React.createClass({
    handleSubmit: function(e) {
      e.preventDefault();
      var message = React.findDOMNode(this.refs.message).value;
      var destination = React.findDOMNode(this.refs.destination).value;
      React.findDOMNode(this.refs.message).value = '';
      this.props.sendMessageCallback(destination, message);
      return;
    },
    render: function() {
      return (
        <form onSubmit={this.handleSubmit}>
          <input type="text" ref="message"/>
          <DestinationList destinations={this.props.destinations} ref="destination"/>
          <button type="submit">Send</button>
        </form>
      );
    }
  });

  var Message = React.createClass({
    render: function() {
      var fromSomeone = (<span>{this.props.username} said to {this.props.destination}<br/></span>);
      var fromSystem = '';
      var from = this.props.username ? fromSomeone : fromSystem
      return (
        <li className="message">{from}<span>{this.props.children}</span></li>
      );
    }
  });

  var MessageList = React.createClass({
    render: function() {
      var messageNodes = this.props.messages.map(function(message, index) {
        return (
          <Message key={index} username={message.username} destination={message.destination}>{message.text}</Message>
        )
      });
      return (
        <ol id="messages">{messageNodes}</ol>
      );
    }
  });

  var ChatController = React.createClass({
    getInitialState: function() {
      return {
        destinations: this.props.destinations,
        messages: []
      }
    },
    componentDidMount: function() {
      this.props.bus.subscribe('/' + this.props.me, function(message) {
        this.setState({messages: this.state.messages.concat([{username: message.username, text: message.text, destination: this.props.me}])});
      }.bind(this));

      this.props.bus.subscribe('/lobby', function(message) {
        this.setState({messages: this.state.messages.concat([{username: message.username, text: message.text, destination: 'lobby'}])});
      }.bind(this));

      this.props.bus.subscribe('/users', function(message) {
        if(message.action === 'join') {
          if(this.state.destinations.indexOf(message.username) >= 0) {
            return;
          }

          this.setState({
            destinations: this.state.destinations.concat([message.username]),
            messages: this.state.messages.concat([{username: null, text: message.username + ' has joined', destination: 'lobby'}])
          });
        } else {
          if(this.state.destinations.indexOf(message.username) < 0) {
            return;
          }

          this.setState({
            destinations: this.state.destinations.filter(function(destination) { return destination != message.username }),
            messages: this.state.messages.concat([{username: null, text: message.username + ' has left', destination: 'lobby'}])
          });
        }
      }.bind(this));

      // notify users that I have joined
      this.props.bus.publish('/users', {action: 'join', username: this.props.me});
    },
    sendMessage: function(destination, text) {
      // add private messages that I send to other users
      if(destination !== this.props.me && destination !== 'lobby') {
        this.setState({messages: this.state.messages.concat([{username: this.props.me, text: text, destination: destination}])});
      }

      this.props.bus.publish('/' + destination, { username: this.props.me, text: text });
    },
    render: function() {
      return (
        <div>
          <MessageList messages={this.state.messages} />
          <Form destinations={this.state.destinations} sendMessageCallback={this.sendMessage} />
        </div>
      );
    }
  });

  var components = {
    DestinationList: DestinationList,
    Form: Form,
    Message: Message,
    MessageList: MessageList,
    ChatController: ChatController
  };

  // this is needed for testing since I didn't setup a JS build pipeline
  // Webpack & CommonJS would be used for real app
  try {
    module.exports = components;
  } catch(e) {
    window.__APP__ = window.__APP__ || {}
    window.__APP__.components = components;
  }
})();
