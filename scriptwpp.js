document.getElementById('whatsapp-form').addEventListener('submit', function(event) {
  event.preventDefault();

  var phoneInput = document.getElementById('phone-number');
  var messageInput = document.getElementById('message');

  var phone = phoneInput.value;
  var message = messageInput.value;

  // Verifica se o número de telefone começa com '+'
  if (!phone.startsWith('+')) {
    phone = '+55' + phone; // Adiciona o código +55 automaticamente
  }

  // Remove todos os caracteres não numéricos do número de telefone
  phone = phone.replace(/\D/g, '');

  // Codifica a mensagem para uso em uma URL
  message = encodeURIComponent(message);

  // Gera o link do WhatsApp
  var whatsappLink = 'https://api.whatsapp.com/send?phone=' + phone + '&text=' + message;

  // Atualiza o link gerado
  var resultLink = document.getElementById('result-link');
  resultLink.href = whatsappLink;
  resultLink.innerText = whatsappLink;

  // Adiciona a classe 'show' ao elemento .result-wrapper
  var resultWrapper = document.querySelector('.result-wrapper');
  resultWrapper.classList.add('show');
});
