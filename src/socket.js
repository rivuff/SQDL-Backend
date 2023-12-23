/**
 * Creating a handler for sockets
 * event types
 * connection
 * disconnect
 * 3 types of users in a session
 * sessionid+teacher+action --> One Teacher
 * sessionid+student+action --> All students
 * sessionid+server+action --> Server
 * actions
 *      - ask machine to fetch new session state from server
 *      - ask machine to fetch updated questions from server
 *
 * serversession+sessionid - client broadcasting data to server via socket
 * clientsession+sessionid - server broadcasts data to clients
 */

function socketHandlers(socket, io) {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", (socket) => {
    console.log("Socket: " + socket.id + " disconnected");
  });

  socket.on("join-session", ({name, type, code}) => {
    console.log(`User: ${name} who is a ${type} just joined the session`);
    socket.join(code);
  })

  socket.on("send-link", (link, code, callback) => {
    console.log(link, code);
    try {
      socket.broadcast.emit('receive-link', link);
      callback({
        status: 'ok',
      })
    } catch (error) {
      callback({
        status: 'not ok',
        err: error
      })
    }
  })

  socket.onAny((eventName, ...args) => {
    console.log(eventName, args);
    let arg = args[0]; //get sessionID

    if (eventName.includes("teacher")) {
      //types of action to teacher
      socket.broadcast.emit(eventName, { fetch: true });
      console.log(eventName);
    } else if (eventName.includes("student")) {
      //types of action to students
      socket.broadcast.emit(eventName, { fetch: true });
      console.log(eventName);
    } else if (eventName.includes("session-mode")) {
      socket.broadcast.emit(eventName, arg)
    } else if (eventName.includes("UpdateQuestions")) {
      socket.broadcast.emit(eventName, arg)
    } else if (eventName.includes("EndActivity")) {
      socket.broadcast.emit(eventName, arg)
    }
  });
}

export default socketHandlers;
