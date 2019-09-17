$(document).ready(() => {
  var socket = io();

  $('#btn').click(() => {
    socket.emit('gui-lenh', {
      pass: password,
      value: {
        lenh: cmd,
        giatri: val,
      }
    });
  });

  var password = "";

  setInterval(() => {
    password = $('#pass').val();
    socket.emit('tim-nguoi-than', password)
  }, 5000);

  socket.on('tim-thay', (obj) => {
    $('#status').html('online');
  });

  socket.on('khong-tim-thay', () => {
    $('#status').html('offline');
  });
});