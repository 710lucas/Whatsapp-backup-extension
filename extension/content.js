const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Ouvinte de mensagens do popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "runBackup") {
    // Usando valor padrão 5 se scrollTimes não for passado
    const scrolls = request.scrollTimes || 5;
    run(request.max, scrolls)
      .then((result) => {
        sendResponse({ 
          status: "complete", 
          data: result.data, 
          duration: result.duration 
        });
      })
      .catch((error) => {
        console.error("Erro na execução do backup:", error);
        sendResponse({ 
          status: "error", 
          message: error.message || "Erro desconhecido durante o backup."
        });
      });
    return true; // Indica que a resposta será assíncrona
  }
});

async function run(MAX, scrollTimes = 5) {
  const startTime = Date.now();
  let numeros = [];

  try {
    // Seletores baseados no código original
    let a = document.getElementsByClassName("x1iyjqo2");
    let b = Array.from(a);

    let classList = "x1iyjqo2 x6ikm8r x10wlt62 x1n2onr6 xlyipyv xuxw1ft x1rg5ohu x1jchvi3 xjb2p0i xo1l8bm x17mssa0 x1ic7a3i _ao3e".split(" ");

    let c = b.filter(e =>
      classList.every(cl => e.classList.contains(cl))
    );

    console.log(`Encontrados ${c.length} elementos de conversa possíveis.`);

    let count = 0;

    // Função auxiliar para converter blob/url em base64
    const getBase64FromUrl = async (url) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (e) {
        console.error("Erro ao converter imagem:", e);
        return null;
      }
    };

    async function extrairConteudoMensagem(el) {
      const resultado = {
        texto: null,
        imagens: []
      };

      // 📝 texto visível
      const texto = el.querySelector('span._11JPr')?.innerText?.trim() || el.innerText?.trim();
      if (texto) {
        resultado.texto = texto;
      }

      // 🖼️ todas as imagens dentro da mensagem
      const imgs = el.querySelectorAll('img');
      for (const img of imgs) {
        if (img.src && img.src.startsWith('blob:')) {
          const base64 = await getBase64FromUrl(img.src);
          if (base64) {
            resultado.imagens.push(base64);
          }
        }
      }

      if (!resultado.texto && resultado.imagens.length === 0) {
        return null;
      }

      return resultado;
    }

    // Loop principal sobre as conversas
    for (let i = 0; i < c.length && count < MAX; i++) {
      const atual = c[i];
      
      // Verifica se o elemento da conversa ainda é válido no DOM
      if (!atual.isConnected) { 
        console.warn("Elemento da conversa perdeu referência. Tentando pular...");
        continue;
      }

      // clique 1
      ["mousedown", "mouseup", "click"].forEach(type => {
        atual.dispatchEvent(new MouseEvent(type, {
          bubbles: true,
          cancelable: true,
          view: window
        }));
      });

      console.log(`Abrindo conversa ${count + 1}...`);
      await sleep(750); // Tempo seguro para renderização inicial

      // Identificação do Titulo
      let classListTituloPessoa = "x78zum5 x1q0g3np x1iyjqo2 x6ikm8r x10wlt62 x1jchvi3 xdod15v x14ug900 x1yc453h xlyipyv xuxw1ft xh8yej3 x1s688f".split(" ");
      let todosTituloPessoa = Array.from(document.getElementsByClassName("x78zum5"));
      let tituloPessoa = todosTituloPessoa.filter(e =>
        classListTituloPessoa.every(cl => e.classList.contains(cl))
      );

      if (!tituloPessoa[0]) {
          console.log("Titulo não encontrado, pulando...");
          continue;
      }

      // --- Lógica de Scroll Melhorada ---
      console.log(`Iniciando scroll para carregar histórico (${scrollTimes}x)...`);
      for(let j = 0; j < scrollTimes; j++){
        // Busca sempre o elemento mais atual do topo
        const currentMsgs = document.querySelectorAll('[data-pre-plain-text]');
        if(currentMsgs.length > 0){
          const firstMsg = currentMsgs[0];
          firstMsg.scrollIntoView({ behavior: 'smooth', block: 'start' });
          await sleep(500); 
        } else {
          await sleep(500);
        }
      }
      
      // Captura final
      let messageElements = Array.from(document.querySelectorAll('[data-pre-plain-text]'));
      let mensagens = [];
      
      for (const el of messageElements) {
        const conteudo = await extrairConteudoMensagem(el);
        if (conteudo) {
          mensagens.push({
            meta: el.getAttribute('data-pre-plain-text'),
            conteudo: conteudo
          });
        }
      }

      // Clique no titulo para abrir dados de contato
      ["mousedown", "mouseup", "click"].forEach(type => {
        tituloPessoa[0].dispatchEvent(new MouseEvent(type, {
          bubbles: true,
          cancelable: true,
          view: window
        }));
      });

      await sleep(500);

      // Identificação do Número
      let classListNumero = "x140p0ai x1gufx9m x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x x193iq5w xeuugli x13faqbe x1vvkbs x1lliihq x1fj9vlw xhslqc4 x1hx0egp x1jchvi3 xjb2p0i xo1l8bm x17mssa0 x1ic7a3i".split(" ");
      let todosNumero = Array.from(document.getElementsByClassName("x140p0ai"));
      let numeroPessoa = todosNumero.filter(n =>
        classListNumero.every(cl => n.classList.contains(cl))
      );

      // Só adiciona se encontrou o número
      if (numeroPessoa[0]) {
          numeros.push({
            nome: tituloPessoa[0].innerText,
            numero: numeroPessoa[0].innerText,
            mensagens: mensagens
          });
      }

      count++;
      await sleep(100);
    }
  } catch (err) {
    throw err; // Repassa para o .catch lá em cima
  }

  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;

  return { data: numeros, duration: duration };
}
