document.getElementById('btnRun').addEventListener('click', async () => {
  const max = parseInt(document.getElementById('maxConversas').value) || 5;
  const statusDiv = document.getElementById('status');
  const resultArea = document.getElementById('resultArea');
  const btnRun = document.getElementById('btnRun');
  
  statusDiv.textContent = "Processando... Por favor, não feche esta janela e mantenha a aba do WhatsApp ativa.";
  statusDiv.classList.remove('hidden');
  resultArea.classList.add('hidden');
  btnRun.disabled = true;

  // Obter aba ativa
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab) {
      statusDiv.textContent = "Erro: Nenhuma aba ativa encontrada.";
      btnRun.disabled = false;
      return;
  }

  // Enviar mensagem para o content script
  chrome.tabs.sendMessage(tab.id, { action: "runBackup", max: max }, (response) => {
    btnRun.disabled = false;
    
    if (chrome.runtime.lastError) {
      statusDiv.textContent = "Erro: Certifique-se de estar na aba do WhatsApp Web e recarregue a página se necessário.";
      console.error(chrome.runtime.lastError);
      return;
    }

    if (response && response.status === "complete") {
      statusDiv.classList.add('hidden');
      resultArea.classList.remove('hidden');
      
      const jsonString = JSON.stringify(response.data, null, 2);
      document.getElementById('jsonOutput').value = jsonString;
    } else {
      statusDiv.textContent = "Ocorreu um erro desconhecido ou a extração falhou.";
    }
  });
});

document.getElementById('btnCopy').addEventListener('click', () => {
  const copyText = document.getElementById("jsonOutput");
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* Para mobile */
  
  navigator.clipboard.writeText(copyText.value).then(() => {
    const originalText = document.getElementById('btnCopy').textContent;
    document.getElementById('btnCopy').textContent = "Copiado!";
    setTimeout(() => {
      document.getElementById('btnCopy').textContent = originalText;
    }, 2000);
  });
});

document.getElementById('btnViewer').addEventListener('click', () => {
  chrome.tabs.create({ url: 'viewer.html' });
});
