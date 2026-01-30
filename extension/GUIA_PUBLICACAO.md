# Guia de Publicação da Extensão

Antes de publicar, você **precisa** adicionar ícones à sua extensão, pois as lojas exigem.

## 1. Preparação (Importante)

1.  **Crie os ícones**: Você precisa de imagens PNG nos tamanhos 16x16, 48x48 e 128x128 pixels.
2.  Crie uma pasta chamada `icons` dentro da pasta `extension`.
3.  Salve suas imagens lá como `icon16.png`, `icon48.png` e `icon128.png`.
4.  **Edite o `manifest.json`**: Adicione a referência aos ícones novamente (eu removi para funcionar localmente sem arquivos). Adicione isso antes de `content_scripts`:

```json
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
```

5.  **Crie um arquivo ZIP**: Compacte todo o conteúdo de dentro da pasta `extension` (não a pasta em si, mas os arquivos dentro dela) em um arquivo `.zip`.

---

## 2. Publicar na Chrome Web Store

**Custo:** Taxa única de $5 USD (pagamento único).

1.  Acesse o [Painel do Desenvolvedor da Chrome Web Store](https://chrome.google.com/webstore/developer/dashboard).
2.  Faça login com sua conta Google e pague a taxa de registro (se for a primeira vez).
3.  Clique em **"Novo Item"** (New Item).
4.  Faça o upload do seu arquivo `.zip`.
5.  Preencha as informações da loja:
    *   **Descrição**: Explique o que a extensão faz.
    *   **Categoria**: Ferramentas de produtividade ou desenvolvedor.
    *   **Imagens**: Você precisará fazer upload de capturas de tela (1280x800 ou 640x400) e um ícone promocional (128x128).
6.  **Privacidade**: Na aba de privacidade, você precisará declarar que a extensão não coleta dados de usuário (ou explicar o que coleta). Como seu código roda apenas localmente e não envia dados para servidores externos, marque que não coleta dados.
7.  Clique em **Enviar para revisão** (Submit for API review). A revisão pode levar alguns dias.

---

## 3. Publicar no Firefox Add-ons (AMO)

**Custo:** Grátis.

1.  Acesse o [Developer Hub do Firefox](https://addons.mozilla.org/pt-BR/developers/).
2.  Clique em **"Enviar seu primeiro complemento"**.
3.  Escolha a opção **"Neste site"** (On this site) para que ela apareça na loja pública.
4.  Faça o upload do seu arquivo `.zip`. O Firefox fará uma validação automática.
5.  Se passar na validação, clique em "Continuar".
6.  Preencha as informações (Descrição, Categoria, Licença).
7.  Clique em **"Enviar versão"**.
8.  A revisão do Firefox costuma ser rápida (às vezes minutos ou horas).

---

## Dicas Adicionais

*   **Política de Privacidade**: Como sua extensão lida com dados sensíveis (conversas), mesmo que não envie para lugar nenhum, é recomendável colocar na descrição "Todos os dados são processados localmente e nada é enviado para servidores externos".
*   **Versão**: Lembre-se de aumentar o número da `version` no `manifest.json` sempre que for atualizar a extensão na loja.
