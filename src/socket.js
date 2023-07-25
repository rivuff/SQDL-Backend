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

function socketHandlers(socket){
    console.log('New client connected:', socket.id);


    socket.on('disconnect', (socket) => {
        console.log('Socket: '+ socket.id+' disconnected');
    });

    socket.onAny((eventName, ...args) => {
        let arg = args[0] //get sessionID
        
        if (eventName.includes('teacher')) { //types of action to teacher
            socket.broadcast.emit(eventName, {fetch: true});
            console.log(eventName)

        }
        else if (eventName.includes('student')) {//types of action to students
            socket.broadcast.emit(eventName, { fetch: true });
            console.log(eventName)
        }
    });
}

export default socketHandlers