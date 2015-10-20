jest.dontMock('../../public/components.jsx');
describe("Components", function() {
  global.React = require('react/addons');
  var components = require('../../public/components.jsx');
  var TestUtils = React.addons.TestUtils;

  it('export DestinationList', function() {
    expect(components.DestinationList).toBeDefined();
    expect(components.DestinationList).not.toBe(null);
  });

  it('exports Form', function() {
    expect(components.Form).toBeDefined();
    expect(components.Form).not.toBe(null);
  });

  it('exports Message', function() {
    expect(components.Message).toBeDefined();
    expect(components.Message).not.toBe(null);
  });

  it('exports MessageList', function() {
    expect(components.MessageList).toBeDefined();
    expect(components.MessageList).not.toBe(null);
  });

  it('exports ChatController', function() {
    expect(components.ChatController).toBeDefined();
    expect(components.ChatController).not.toBe(null);
  });


  describe('DestinationList', function() {
    it('renders select list of destinations', function() {
      var destinations = ['D1', 'D2', 'D3'];
      var destinationList = TestUtils.renderIntoDocument(
        <components.DestinationList destinations={destinations} />
      );

      var select = TestUtils.findRenderedDOMComponentWithTag(destinationList, 'select');
      expect(select.getDOMNode()).not.toBe(null);

      var options = TestUtils.scryRenderedDOMComponentsWithTag(select, 'option');
      expect(options.length).toBe(3);
      expect(options[0].getDOMNode().value).toEqual('D1');
      expect(options[0].getDOMNode().textContent).toEqual('D1');
      expect(options[1].getDOMNode().value).toEqual('D2');
      expect(options[1].getDOMNode().textContent).toEqual('D2');
      expect(options[2].getDOMNode().value).toEqual('D3');
      expect(options[2].getDOMNode().textContent).toEqual('D3');
    });
  });

  describe('Message', function() {
    it('renders as a message', function() {
      var message = TestUtils.renderIntoDocument(
        <components.Message username="me" destination="you">This is a test</components.Message>
      );

      var messageElement = TestUtils.findRenderedDOMComponentWithTag(message, 'li');
      expect(messageElement).not.toBe(null);
    });
  });

  describe('MessageList', function() {
   it('renders a list of messages', function() {
     var messages = [
       {username: 'User1', destination: 'You', text: 'Hello You'},
       {username: 'User2', destination: 'User1', text: 'Hello User1'}
     ];

     var messageList = TestUtils.renderIntoDocument(
       <components.MessageList messages={messages} />
     );

     expect(messageList).not.toBe(null);

     var messageElements = TestUtils.scryRenderedDOMComponentsWithTag(messageList, 'li');
     expect(messageElements.length).toBe(2);
   });
  });

  describe('Form', function() {
    it('renders the chat form', function() {
      var destinations = ['D1', 'D2', 'D3'];

      var callback = function(destination, message) {
      };

      var form = TestUtils.renderIntoDocument(
        <components.Form destinations={destinations} sendMessageCallback={callback} />
      );

      expect(form).not.toBe(null);
      var inputElement = TestUtils.findRenderedDOMComponentWithTag(form, 'input');
      expect(inputElement).not.toBe(null);
      var buttonElement = TestUtils.findRenderedDOMComponentWithTag(form, 'button');
      expect(buttonElement).not.toBe(null);
      var destinationsElement = TestUtils.findRenderedDOMComponentWithTag(form, 'select');
      expect(destinationsElement).not.toBe(null);
    });

    it('sends the message to the callback', function() {
      var destinations = ['D1', 'D2', 'D3'];

      var callbackResults = [];
      var callback = function(destination, message) {
        callbackResults.push({destination: destination, message: message});
      };

      var form = TestUtils.renderIntoDocument(
        <components.Form destinations={destinations} sendMessageCallback={callback} />
      );

      var inputElement = TestUtils.findRenderedDOMComponentWithTag(form, 'input');
      inputElement.getDOMNode().value = 'This is a test';
      TestUtils.Simulate.submit(form.getDOMNode());

      expect(callbackResults.length).toBe(1);
      expect(callbackResults[0].message).toBe('This is a test');
      expect(callbackResults[0].destination).toBe('D1');

      callbackResults = [];

      var destinationsElement = TestUtils.findRenderedDOMComponentWithTag(form, 'select');
      destinationsElement.getDOMNode().value = 'D2';
      inputElement.getDOMNode().value = 'Another test message';
      TestUtils.Simulate.submit(form.getDOMNode());

      expect(callbackResults.length).toBe(1);
      expect(callbackResults[0].message).toBe('Another test message');
      expect(callbackResults[0].destination).toBe('D2');
    });
  });

  describe('ChatController', function() {
    var bus, subject, subscriptions, publications;

    var assertSubscription = function(subscription) {
      expect(subscriptions[subscription]).toBeDefined();
      expect(subscriptions[subscription].length).toBe(1);
    };

    var assertMessageRecorded = function(from, to, text) {
      var foundMessages = subject.state.messages.filter(function(message) {
        return message.username === from && message.destination === to && message.text === text;
      });

      expect(foundMessages.length).toBe(1);

      var messageListComponents = TestUtils.scryRenderedComponentsWithType(subject, components.MessageList);
      TestUtils.scryRenderedComponentsWithType(messageListComponents, components.Message);
      expect(messageListComponents.length).toBe(1);
    };

    beforeEach(function() {
      subscriptions = {}
      publications = [];
      bus = {
        subscribe: function(channel, callback) {
          if(typeof(subscriptions[channel]) === 'undefined' || subscriptions[channel] === null) {
            subscriptions[channel] = [];
          }
          subscriptions[channel].push(callback);
        },
        publish: function(channel, message) {
          publications.push({channel: channel, message: message});
          if(typeof(subscriptions[channel]) !== 'undefined' && subscriptions[channel] !== null) {
            for(var i = 0; i < subscriptions[channel].length; i++) {
              subscriptions[channel][i](message);
            }
          }
        }
      };

      var destinations = ['lobby', 'User1', 'User2'];

      subject = TestUtils.renderIntoDocument(
        <components.ChatController destinations={destinations} me="User2" bus={bus} />
      );
    });

    it('renders the list of messages', function() {
      var messageListComponents = TestUtils.scryRenderedComponentsWithType(subject, components.MessageList);
      expect(messageListComponents.length).toBe(1);
    });

    it('renders the form', function() {
      var formComponents = TestUtils.scryRenderedComponentsWithType(subject, components.Form);
      expect(formComponents.length).toBe(1);
    });

    it('subscribes to my private channel', function() {
      assertSubscription('/User2');
    });

    it('subscribes to the lobby', function() {
      assertSubscription('/lobby');
    });

    it('subscribes to the users meta channel', function() {
      assertSubscription('/users');
    });

    it('notifies the users meta channel that I joined', function() {
      var foundPublications = publications.filter(function(publication) {
        return publication.channel === '/users' && publication.message.action === 'join' && publication.message.username === 'User2';
      });
      expect(foundPublications.length).toBe(1);
    });

    it('receives my private messsages', function() {
      bus.publish('/User2', { username: 'User1', text: 'Hello User2' });
      assertMessageRecorded('User1', 'User2', 'Hello User2');
    });

    it('receives messages from others to the lobby', function() {
      bus.publish('/lobby', { username: 'User1', text: 'Hello World' });
      assertMessageRecorded('User1', 'lobby', 'Hello World');
    });

    var assertMessageSent = function(to, text) {
      var foundPublications = publications.filter(function(publication) {
        return publication.channel === ('/' + to) && publication.message.username === 'User2' && publication.message.text === text;
      });
      expect(foundPublications.length).toBe(1);
    };

    it('sends messages to the lobby', function() {
      subject.sendMessage('lobby', 'Hello World');
      assertMessageRecorded('User2', 'lobby', 'Hello World');
      assertMessageSent('lobby', 'Hello World');
    });

    it('sends private messages to other users', function() {
      subject.sendMessage('User1', 'Hello User1');
      assertMessageRecorded('User2', 'User1', 'Hello User1');
      assertMessageSent('User1', 'Hello User1');
    });

    it('records when a user joins', function() {
      bus.publish('/users', {action: 'join', username: 'User4'});
      assertMessageRecorded(null, 'lobby', 'User4 has joined');
      expect(subject.state.destinations.indexOf('User4')).toBeGreaterThan(-1);
    });
  });
});
