const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Ouvinte de mensagens do popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "runBackup") {
    run(request.max).then((data) => {
      sendResponse({ status: "complete", data: data });
    });
    return true; // Indica que a resposta será assíncrona
  }
});

async function run(MAX) {
  let numeros = [];

  // Seletores baseados no código original
  let a = document.getElementsByClassName("x1iyjqo2");
  let b = Array.from(a);

  let classList = "x1iyjqo2 x6ikm8r x10wlt62 x1n2onr6 xlyipyv xuxw1ft x1rg5ohu x1jchvi3 xjb2p0i xo1l8bm x17mssa0 x1ic7a3i _ao3e".split(" ");

  let c = b.filter(e =>
    classList.every(cl => e.classList.contains(cl))
  );

  console.log(`Encontrados ${c.length} elementos de conversa possíveis.`);

  let count = 0;

  for (const atual of c) {
    if (count >= MAX) break;
    count++;

    // clique 1
    ["mousedown", "mouseup", "click"].forEach(type => {
      atual.dispatchEvent(new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        view: window
      }));
    });

    await sleep(500);

    // título
    let classListTituloPessoa = "x78zum5 x1q0g3np x1iyjqo2 x6ikm8r x10wlt62 x1jchvi3 xdod15v x14ug900 x1yc453h xlyipyv xuxw1ft xh8yej3 x1s688f".split(" ");
    let todosTituloPessoa = Array.from(document.getElementsByClassName("x78zum5"));
    let tituloPessoa = todosTituloPessoa.filter(e =>
      classListTituloPessoa.every(cl => e.classList.contains(cl))
    );

    if (!tituloPessoa[0]) continue;

    ["mousedown", "mouseup", "click"].forEach(type => {
      tituloPessoa[0].dispatchEvent(new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        view: window
      }));
    });

    await sleep(500);

    // número
    let classListNumero = "x140p0ai x1gufx9m x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x x193iq5w xeuugli x13faqbe x1vvkbs x1lliihq x1fj9vlw xhslqc4 x1hx0egp x1jchvi3 xjb2p0i xo1l8bm x17mssa0 x1ic7a3i".split(" ");
    let todosNumero = Array.from(document.getElementsByClassName("x140p0ai"));
    let numeroPessoa = todosNumero.filter(n =>
      classListNumero.every(cl => n.classList.contains(cl))
    );

    let mensagens = Array.from(document.querySelectorAll('[data-pre-plain-text]')).map(el => el.getAttribute('data-pre-plain-text') + " " + el.innerText);

    if (numeroPessoa[0]) {
      numeros.push({
        nome: tituloPessoa[0].innerText,
        numero: numeroPessoa[0].innerText,
        mensagens: mensagens
      });
    }

    await sleep(500);
  }

  return numeros;
}
