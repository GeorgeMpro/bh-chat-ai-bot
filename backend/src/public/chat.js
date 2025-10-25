const socket = io();

const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');

socket.on('message', (msg) => {
  console.log(msg);
});
// message
$messageForm.addEventListener('submit', (e) => {
  // Stop the page reload
  e.preventDefault();

  // disable while sending message
  $messageFormButton.disabled = true;

  // const message = document.querySelector('input').value;
  const message = e.target.elements.message.value;

  // Notice: the ()=> runs when the message is acknowledged
  socket.emit('sendMessage', message, (error) => {
    $messageFormButton.disabled = false;
    $messageFormInput.value = '';
    $messageFormInput.focus();
    if (error) {
      return console.log(error);
    }

    console.log('Message delivered.');
  });
});
