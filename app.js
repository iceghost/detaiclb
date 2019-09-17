const express = require('express');
const app = express();
const ip = require('ip');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 3000;

app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");

app.get('/', (req, res) => {
  res.render('index');
});

server.listen(PORT, () => console.log(`Example app listening on port ${PORT}! IP Address:  ${ip.address()}`));

var login = []; // Danh sách những arduino đăng nhập, login[...].id = id của socket
// Nếu pass bị trùng thì hỏng hết :))

io.on("connection", (socket) => {
  // Arduino đăng nhập tại đây
  socket.on('dang-nhap', (data) => {
    // console.log('Login from ' + socket.id)
    var index = login.map(value => value.pass).indexOf(data);
    if (index >= 0) {
      login.splice(index, 1);
    }
    login.push({
      pass: data,
      id: socket.id,
    });
  });

  socket.on('gui-lenh', (data) => {
    // console.log(data)
    var index = login.map(value => value.pass).indexOf(data.pass);
    if (index >= 0) {
      socket.broadcast.to(login[index].id).emit('gui-lenh', data.value); // gửi đến socket có id trong JSON login
    }
  });

  socket.on('disconnect', () => {
    var index = login.map(value => value.id).indexOf(socket.id);
    if (index >= 0) {
      login.splice(index, 1);
    }
  });

  socket.on('tim-nguoi-than', (data) => {
    var index = login.map(value => value.pass).indexOf(data);
    if (index >= 0) {
      socket.emit('tim-thay', login[index]);
    } 
    else socket.emit('khong-tim-thay');
  });

});

