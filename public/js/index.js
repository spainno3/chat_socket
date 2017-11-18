/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var socket = io("http://localhost:3000/");
$(document).ready(function () {
    $('#login-form').show();
    $('#chat-form').hide();

    $('#btn-register').click(function () {
        socket.emit('client-send-username', $('#input-username').val());
    });

    socket.on('client-regist-fail', function (data) {
        alert('User ' + data + ' da duoc dang ky');
    });

    socket.on('client-regist-success', function (data) {
        $('#login-form').hide();
        $('#chat-form').show("slow");
        $('#current-user').html('Xin chao ban ' + data);
    });
    socket.on('update-user', function (data) {
        $('#dl-list-user').empty();
        $.each(data, function (index, value) {
            $('#dl-list-user').append('<li><img src="image/download.jpg" class="rounded-circle" width="20" height="20" alt="Cinque Terre"><span style="font-weight: bold;">' + value + '</span></li>')
        });
    });


    $('#btn-logout').click(function () {
        socket.emit('logout');
    });
    socket.on('client-logout', function (data) {
        alert('Ban ' + data + ' da logout thanh cong');
        $('#login-form').show();
        $('#chat-form').hide();
    });
    socket.on('other-logout', function (data) {
        $('#other-logout').html(data + ' da thoat');
        setInterval(function () {
            $('#other-logout').empty();
        }, 3 * 1000); // do this every 10 seconds    

    });

    $('#btn-send-message').click(function () {
        socket.emit('client-send-message', $('#input-message').val());
    });
    $('#input-message').focusin(function (event) {
        socket.emit('typing');
    });
    $('#input-message').focusout(function (event) {
        socket.emit('stop-typing');
    });

    socket.on('update-message', function (data) {
        $('#update-message').append('<div class=""><span style="font-weight: bold;color: ' + data.color + '">' + data.user + '</span>: ' + data.message + '</div>')
    });
    socket.on('other-typing', function (data) {
        $('#typing').html('<span style="font-weight: bold;color: ' + data.color + '">' + data.user + '</span> dang go');
    });
    socket.on('other-stop-typing', function (data) {
        $('#typing').html('');
    });
})

