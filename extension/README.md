# WhatsApp Backup & Viewer Extension

Esta extensão extrai conversas do WhatsApp Web e gera um JSON, além de possuir um visualizador integrado para ler os backups com uma interface similar ao WhatsApp.

## Funcionalidades

1.  **Backup**: Extrai texto de conversas (Nome, Número e Mensagens) automaticamente.
2.  **Visualizador**: Interface offline para ler os arquivos JSON gerados com aparência nativa.
    *   Suporta busca de contatos.
    *   Diferencia mensagens enviadas/recebidas (baseado no nome do contato).
    *   Exibe data e hora.

## Como instalar

Primeiramente, baixe a versão mais recente na aba **[Releases](https://github.com/710lucas/Whatsapp-backup-extension/releases)** deste repositório e extraia o arquivo `.zip`.

### Chrome / Edge / Brave / Opera

1.  Acesse `chrome://extensions/`.
2.  Ative o **Modo do desenvolvedor** (Developer mode).
3.  Clique em **Carregar sem compactação** (Load unpacked).
4.  Selecione a pasta onde você extraiu os arquivos.
5.  O ícone aparecerá na barra de ferramentas.

### Firefox

1.  Acesse `about:debugging`.
2.  Menu lateral: "Este Firefox".
3.  Clique em **Carregar extensão temporária**.
4.  Selecione o arquivo `manifest.json` dentro da pasta extraída.

## Como usar

1.  Abra o [WhatsApp Web](https://web.whatsapp.com/).
2.  Clique no ícone da extensão.
3.  **Para Backup**:
    *   Defina quantas conversas quer salvar.
    *   Clique em "Iniciar Backup".
    *   Aguarde o processo finalizar (não feche a aba).
    *   Copie o JSON gerado e salve em um arquivo `.json` no seu computador.
4.  **Para Ler um Backup**:
    *   Clique em "Abrir Visualizador de Backup".
    *   Na nova aba, clique no ícone de pasta ou no link para importar seu arquivo `.json`.
    *   Navegue por suas conversas salvas offline.

## Notas sobre Publicação

Se deseja publicar na Chrome Web Store ou Firefox Add-ons:
1.  Converta o arquivo `icons/icon.png` para PNG (tamanhos 16, 48, 128px).
2.  Siga as instruções no arquivo `GUIA_PUBLICACAO.md`.
