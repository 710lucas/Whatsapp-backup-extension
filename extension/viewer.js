let backupData = [];
let detectedOwner = null;
let contactsColors = {}; // Cache de cores para nomes

// Elementos
const fileInput = document.getElementById('fileInput');
const btnUpload = document.getElementById('btnUpload');
const linkImport = document.getElementById('linkImport');
const contactsList = document.getElementById('contactsList');
const searchInput = document.getElementById('searchInput');
const chatPlaceholder = document.querySelector('.chat-placeholder');
const chatContainer = document.getElementById('chatContainer');
const messagesContainer = document.getElementById('messagesContainer');
const currentName = document.getElementById('currentName');
const currentNumber = document.getElementById('currentNumber');
const currentAvatar = document.getElementById('currentAvatar');

// Elementos da Modal de Colar
const btnPaste = document.getElementById('btnPaste');
const pasteModal = document.getElementById('pasteModal');
const btnCancelPaste = document.getElementById('btnCancelPaste');
const btnConfirmPaste = document.getElementById('btnConfirmPaste');
const pasteArea = document.getElementById('pasteArea');

// Event Listeners
btnUpload.addEventListener('click', () => fileInput.click());
btnPaste.addEventListener('click', () => {
    pasteModal.classList.remove('hidden');
    pasteArea.focus();
});

btnCancelPaste.addEventListener('click', () => {
    pasteModal.classList.add('hidden');
    pasteArea.value = '';
});

btnConfirmPaste.addEventListener('click', () => {
    const content = pasteArea.value;
    if (!content.trim()) {
        alert('Por favor, cole o JSON primeiro.');
        return;
    }
    
    try {
        const json = JSON.parse(content);
        if (Array.isArray(json)) {
            backupData = json;
            detectedOwner = detectOwner(backupData);
            renderContacts(backupData);
            pasteModal.classList.add('hidden');
            pasteArea.value = '';
        } else {
            alert('Formato de JSON inválido. Esperado um array de conversas.');
        }
    } catch (err) {
        alert('Erro ao ler o JSON colado: ' + err.message);
    }
});

// Fechar modal ao clicar fora
pasteModal.addEventListener('click', (e) => {
    if (e.target === pasteModal) {
        pasteModal.classList.add('hidden');
    }
});

linkImport.addEventListener('click', (e) => {
    e.preventDefault();
    fileInput.click();
});
fileInput.addEventListener('change', handleFileSelect);
searchInput.addEventListener('input', filterContacts);

// Verificar se há dados na URL ou LocalStorage (opcional para integração futura)
window.addEventListener('load', () => {
    // Se vier da popup, pode ter passado dados via message passing ou storage
    // Por enquanto foca em upload manual
});

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const json = JSON.parse(e.target.result);
            if (Array.isArray(json)) {
                backupData = json;
                detectedOwner = detectOwner(backupData);
                renderContacts(backupData);
            } else {
                alert('Formato de JSON inválido. Esperado um array de conversas.');
            }
        } catch (err) {
            alert('Erro ao ler o arquivo JSON: ' + err.message);
        }
    };
    reader.readAsText(file);
}

// Lógica para detectar quem é "Eu"
function detectOwner(data) {
    if (!data || data.length === 0) return null;
    
    // Contagem de em quantas conversas cada participante aparece
    const authorCounts = {};
    
    data.forEach(chat => {
        const authorsInChat = new Set();
        chat.mensagens.forEach(msg => {
            const p = parseMessage(msg);
            if (p.author) authorsInChat.add(p.author);
        });
        
        authorsInChat.forEach(author => {
            // O nome do chat NÃO conta como autor comum (pois é local àquele chat)
            // A menos que seja um chat de grupo, ai complica.
            // Mas "Eu" estou em todos.
            
            // Só conta se o autor NÃO for igual ao nome do chat
            // (Isso elimina o interlocutor de 1-on-1 chats de ser o 'dono')
            if (author !== chat.nome) {
                authorCounts[author] = (authorCounts[author] || 0) + 1;
            }
        });
    });
    
    // Sortear para pegar o mais frequente
    let max = 0;
    let candidate = null;
    for (const [author, count] of Object.entries(authorCounts)) {
        if (count > max) {
            max = count;
            candidate = author;
        }
    }
    
    // Se temos mais de 1 chat, a heurística é forte.
    if (data.length > 1) return candidate;
    
    // Se temos apenas 1 chat e não achamos ninguém (ex: grupo onde nome do chat != autores), 
    // ou candidato foi encontrado (1-on-1 onde eu sou o outro).
    // Se candidate for null (ex: autores = [ChatName]), não tem o que fazer.
    return candidate;
}

function renderContacts(data) {
    contactsList.innerHTML = '';
    
    if (data.length === 0) {
        contactsList.innerHTML = '<div class="empty-state-sidebar">Nenhuma mensagem encontrada</div>';
        return;
    }

    data.forEach((chat, index) => {
        const div = document.createElement('div');
        div.className = 'contact-item';
        div.onclick = () => loadChat(index);

        // Ultima mensagem para preview
        let lastMsg = "";
        let lastDate = "";
        
        if (chat.mensagens && chat.mensagens.length > 0) {
            const rawLast = chat.mensagens[chat.mensagens.length - 1];
            // Tenta extrair texto limpo
            const parsed = parseMessage(rawLast);
            lastMsg = parsed.text;
            lastDate = parsed.date + ' ' + parsed.time;
        }

        div.innerHTML = `
            <div class="contact-avatar">${getInitials(chat.nome)}</div>
            <div class="contact-info">
                <div class="contact-header">
                    <span class="contact-name">${chat.nome}</span>
                    <span class="contact-date">${lastDate}</span>
                </div>
                <div class="contact-last-msg">${lastMsg}</div>
            </div>
        `;
        contactsList.appendChild(div);
    });
}

function filterContacts() {
    const term = searchInput.value.toLowerCase();
    const filtered = backupData.filter(chat => 
        chat.nome.toLowerCase().includes(term) || 
        chat.numero.includes(term)
    );
    // Aqui seria ideal renderizar apenas o filtrado, mas precisaria mapear indice original
    // Simplificação: Renderizar tudo de novo e cuidar do indice no onclick se necessário (mas aqui vamos re-renderizar simples)
    // Para manter indices corretos no clique, melhor apenas esconder visualmente
    
    const items = document.querySelectorAll('.contact-item');
    items.forEach((item, index) => {
        // Assume ordem sincronizada com backupData
        if (backupData[index].nome.toLowerCase().includes(term) || backupData[index].numero.includes(term)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function loadChat(index) {
    const chat = backupData[index];
    
    // UI Update
    chatPlaceholder.classList.add('hidden');
    chatContainer.classList.remove('hidden');
    
    // Highlight sidebar
    document.querySelectorAll('.contact-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.contact-item')[index].classList.add('active');

    // Header Info
    currentName.textContent = chat.nome;
    currentNumber.textContent = chat.numero;
    currentAvatar.textContent = getInitials(chat.nome);
    
    // Messages
    messagesContainer.innerHTML = '';
    
    chat.mensagens.forEach(rawMsg => {
        const parsed = parseMessage(rawMsg);
        
        const msgDiv = document.createElement('div');
        
        // Lógica de "Quem enviou"
        let type = 'incoming';
        
        if (parsed.author) {
            if (detectedOwner && parsed.author === detectedOwner) {
                // Se detectamos o dono e bate, é nosso
                type = 'outgoing';
            } else if (!detectedOwner && parsed.author !== chat.nome) {
                // Fallback para caso simples (1-on-1 sem detecção global):
                // Se não é o nome do chat, assume que é nosso (comportamento antigo)
                type = 'outgoing';
            }
        }
        
        msgDiv.className = `message ${type}`;
        
        // Cor do nome
        let colorStyle = '';
        if (type === 'incoming') {
            const color = getColorForName(parsed.author);
            colorStyle = `style="color: ${color}"`;
        }

        msgDiv.innerHTML = `
            <div class="msg-meta">
                ${parsed.author && type === 'incoming' ? `<span class="msg-header" ${colorStyle}>${parsed.author}</span>` : ''}
                <span class="msg-text">${escapeHtml(parsed.text)}</span>
            </div>
            <span class="msg-time">${parsed.time}</span>
        `;
        
        messagesContainer.appendChild(msgDiv);
    });

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Utilitários

function getColorForName(name) {
    if (!name) return '#000';
    if (contactsColors[name]) return contactsColors[name];
    
    // Lista de cores inspiradas no WhatsApp
    const colors = [
        '#e542a3', '#ffad1f', '#d60d37', '#3651bf', 
        '#00a884', '#6a4eb9', '#ff3030', '#1f7ac9'
    ];
    
    // Hash simples
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    contactsColors[name] = colors[index];
    return colors[index];
}

function getInitials(name) {
    if (!name) return '?';
    return name.substring(0, 1).toUpperCase();
}

/**
 * Tenta parsear a string que vem do WhatsApp Web
 * Formato comum: "[14:30, 25/09/2023] Lucas: Olá tudo bem?" 
 * Ou data-pre-plain-text attribute do scraping original
 */
function parseMessage(rawText) {
    // Regex para capturar data/hora entre colchetes seguido de resto
    // Ex: [10:30, 12/01/2023] Nome: Mensagem...
    // O seu script original concatena: el.getAttribute('data-pre-plain-text') + " " + el.innerText
    
    const regex = /^\[(.*?),\s(.*?)\]\s(.*?):\s(.*)/;
    const match = rawText.match(regex);

    if (match) {
        return {
            time: match[1],   // 10:30
            date: match[2],   // 12/01/2023
            author: match[3], // Nome
            text: match[4]    // Mensagem (pode perder o "Nome: " se a regex pegar)
        };
    }
    
    // Fallback se não der match (ex: mensagem contínua sem cabeçalho)
    // O script original parece garantir data-pre-plain-text para cada bolha, mas vamos prevenir
    return {
        time: '',
        date: '',
        author: '',
        text: rawText
    };
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
