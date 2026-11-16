# MeuDinheiro

Aplicação web para organizar finanças pessoais, registrar receitas e despesas, acompanhar metas e visualizar relatórios.

## Tecnologias
- React + TypeScript + Vite
- React Router DOM com HashRouter
- Context API e localStorage
- Vitest para testes automatizados

## Executar localmente
Requer Node.js 22.22.2 ou superior.

```bash
npm ci
npm run dev
```

## Validar o projeto
```bash
npm test
npm run build
```

## Publicar gratuitamente no Render
Este repositório está preparado como **Static Site**. Não precisa criar banco PostgreSQL, Neon ou variável `DATABASE_URL`, pois esta versão é uma aplicação frontend e mantém os dados no armazenamento local do navegador (`localStorage`).

1. Envie o conteúdo desta pasta para um repositório no GitHub.
2. No Render, escolha **New + → Blueprint** e conecte o repositório; ou crie um **Static Site** manualmente.
3. Se criar manualmente, use:
   - Build Command: `npm ci && npm run build`
   - Publish Directory: `dist`
4. Se usar Blueprint, o Render lê o arquivo `render.yaml` automaticamente.
5. Aguarde o build terminar e abra a URL `https://meudinheiro.onrender.com` (o nome final pode receber um sufixo se já estiver ocupado).

O arquivo `render.yaml` já define o serviço estático, o comando de build e a pasta publicada. O arquivo `.node-version` fixa a versão do Node usada no build.

## Persistência e limites
Os lançamentos, metas, saldo e sessão são mantidos no `localStorage` do navegador. Isso significa que:
- os dados permanecem no mesmo navegador/dispositivo após fechar e reabrir o site;
- os dados não são sincronizados entre dispositivos ou navegadores;
- limpar os dados do navegador pode apagar os registros;
- publicar no Render não transfere os dados locais para a nuvem.

Não há API ou banco de dados remoto nesta versão. Para sincronização multiusuário e backup centralizado, seria necessário desenvolver um backend e integrar um banco de dados.
