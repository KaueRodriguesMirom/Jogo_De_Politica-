# Jogo da Politica Brasileira Simulador
BRASIL POLÍTICO Construa sua carreira política, dispute eleições, administre recursos, enfrente debates, vote projetos, forme alianças e tente chegar ao mais alto cargo da República.
<img width="986" height="620" alt="JogoFull1" src="https://github.com/user-attachments/assets/c7b7ed93-c6ce-445d-81b8-0360e6ec8522" />
<img width="1331" height="640" alt="JogoFull5" src="https://github.com/user-attachments/assets/34385fbf-75e1-4185-a18c-7452c2137a5c" />
<img width="1354" height="637" alt="JogoFull4" src="https://github.com/user-attachments/assets/eee02eb0-f02d-4f6c-a42c-5b062a803582" />
<img width="1079" height="540" alt="JogoFull3" src="https://github.com/user-attachments/assets/1b7ca226-7234-4fb5-9be6-1e5274851f73" />
![Uploading JogoFull2.PNG…]()
# 🇧🇷 Brasil Político V3

> **Um simulador de carreira política brasileira onde suas decisões moldam sua campanha, popularidade, reputação e trajetória no cenário político.**

O **Brasil Político V3** é um jogo de simulação política desenvolvido em **HTML, CSS e JavaScript**, inspirado no funcionamento da política brasileira.

O jogador começa sua carreira criando um personagem, escolhendo partido, ideologia, estado, cidade e cargo. A partir daí, precisa administrar recursos, participar de debates, acompanhar pesquisas, visitar estados, lidar com notícias e eventos, tomar decisões políticas e avançar sua carreira.

---

## 🎮 Visão geral

O jogo busca simular diferentes aspectos de uma carreira política:

* 🧑‍💼 Criação do personagem
* 🏛️ Escolha de carreira política
* 🗳️ Partidos e ideologias
* 🇧🇷 Estados brasileiros
* 📊 Pesquisas eleitorais
* 📈 Popularidade e reputação
* 👥 Seguidores
* 💰 Administração financeira
* 📢 Campanha eleitoral
* 📰 Sistema de notícias
* ⚡ Sistema de eventos e decisões
* 🎤 Debates políticos
* 🏛️ Câmara dos Deputados
* 🏛️ Senado Federal
* 📜 Projetos de lei
* 🗺️ Mapa político
* 💾 Salvamento da carreira em JSON
* ⏩ Avanço automático de dias

---

# 🕹️ Como funciona o jogo

A experiência é dividida em diferentes etapas.

```text
                    🇧🇷 BRASIL POLÍTICO V3
                              │
                              ▼
                     🏠 Tela Inicial
                              │
                              ▼
                    👤 Nova Carreira
                              │
             ┌────────────────┼────────────────┐
             ▼                ▼                ▼
          Partido         Ideologia        Carreira
             │                │                │
             └────────────────┼────────────────┘
                              ▼
                     🎮 Jogo Principal
                              │
        ┌─────────────┬───────┼────────┬─────────────┐
        ▼             ▼       ▼        ▼             ▼
    Dashboard      Campanha  Mapa    Pesquisas    Notícias
        │             │       │        │             │
        ├─────────────┼───────┼────────┼─────────────┤
        ▼             ▼       ▼        ▼             ▼
     Debates       Eventos  Partido  Orçamento   Parlamento
        │
        ▼
   Decisões políticas
        │
        ▼
   Alteração da carreira
        │
        ▼
      💾 SAVE
```

---

# 👤 Criação da carreira

Antes de começar, o jogador define seu personagem.

### Informações do personagem

* Nome
* Idade
* Estado
* Cidade
* Partido
* Ideologia
* Carreira política

Exemplo:

```text
Nome: João Silva
Idade: 35
Estado: SP
Cidade: São Paulo

Partido: XXX
Ideologia: Centro
Carreira: Deputado Federal
```

O sistema valida os dados antes de iniciar a carreira.

---

# 🏛️ Carreiras políticas

O jogo possui uma estrutura preparada para diferentes caminhos políticos.

A carreira selecionada influencia a trajetória do personagem dentro da simulação.

Exemplo:

```text
Carreira
│
├── Deputado Federal
├── Deputado Estadual
├── Vereador
├── Senador
└── Outras carreiras
```

A estrutura foi criada para permitir a expansão do sistema futuramente.

---

# 🗳️ Sistema de partidos

Os partidos são carregados dinamicamente através dos dados do jogo.

Cada partido pode possuir:

```javascript
{
    id: "...",
    acronym: "...",
    name: "...",
    number: "..."
}
```

Na criação da carreira, o jogador pode selecionar seu partido.

O partido também possui influência sobre a carreira e pode apresentar indicadores próprios, como:

* Apoio
* Identidade política
* Relação com o jogador

---

# 🧭 Ideologia

O jogador também escolhe sua posição ideológica.

Exemplos:

```text
Esquerda
Centro
Direita
```

A ideologia pode ser utilizada pelo motor do jogo para influenciar eventos, decisões, debates e relações políticas.

---

# 📊 Dashboard

O **Dashboard** funciona como o centro de informações da carreira.

Ele apresenta indicadores importantes do personagem:

### Indicadores

| Indicador            | Função                          |
| -------------------- | ------------------------------- |
| ⭐ Popularidade       | Mede a popularidade do político |
| 🏆 Reputação         | Representa sua imagem política  |
| 🗳️ Intenção de voto | Mede o desempenho eleitoral     |
| 👥 Seguidores        | Tamanho da base de apoio        |
| ⚡ Energia            | Recursos disponíveis para ações |
| 💰 Dinheiro          | Recursos financeiros            |
| 📅 Data              | Data atual da carreira          |
| 🏛️ Fase             | Momento atual do jogo           |

Exemplo de fluxo:

```text
Popularidade
████████████████░░░░ 80%

Reputação
██████████████░░░░░░ 70%

Intenção de voto
███████████░░░░░░░░░ 55%
```

---

# 📰 Sistema de notícias

As decisões do jogador podem gerar consequências no noticiário.

O jogo possui uma área dedicada às notícias da carreira.

Exemplo:

```text
03/09/2026

"Deputado anuncia nova proposta para educação"

"Pesquisa mostra crescimento do candidato"

"Partido discute estratégia para próxima eleição"
```

As notícias podem ser exibidas tanto no Dashboard quanto em uma página completa de notícias.

---

# ⚡ Sistema de eventos

Eventos são situações que aparecem durante a carreira.

Cada evento pode possuir:

* Título
* Descrição
* Opções
* Consequências

Exemplo:

```text
┌─────────────────────────────────────┐
│ EVENTO                              │
│                                     │
│ Uma emissora solicita uma entrevista│
│ sobre sua nova proposta.            │
│                                     │
│ [ Conceder entrevista ]             │
│ [ Recusar ]                         │
│ [ Enviar representante ]            │
└─────────────────────────────────────┘
```

Cada escolha pode alterar os indicadores do jogador.

---

# 🎤 Sistema de debates

O jogo possui uma área específica para **debates políticos**.

O sistema de interface é separado do restante do jogo e utiliza o módulo:

```text
debate.js
```

A interface chama:

```javascript
window.renderDebate()
```

Isso permite que o sistema de debates tenha seu próprio motor.

Durante os debates, o jogador pode enfrentar outros candidatos e tomar decisões estratégicas.

---

# 🗺️ Mapa do Brasil

O jogo possui um mapa político baseado nos estados brasileiros.

Cada estado possui informações como:

```text
UF
Nome
Capital
Região
Apoio
Visitado
```

Exemplo:

```text
SP - São Paulo
Capital: São Paulo
Região: Sudeste
Apoio: 67%
Status: Visitado
```

O jogador pode visitar estados durante sua campanha.

Quando um estado é visitado:

```javascript
state.visited = true;
```

E o estado passa a fazer parte do histórico de campanha.

---

# 🗳️ Pesquisas eleitorais

O sistema acompanha a evolução da intenção de voto.

O jogo trabalha com dados como:

```text
Candidato
Indecisos
Outros
```

Além disso, cada estado pode possuir seu próprio índice de apoio.

Exemplo:

```text
SP - São Paulo       72%
RJ - Rio de Janeiro  61%
MG - Minas Gerais    58%
BA - Bahia           49%
PR - Paraná          53%
```

Isso permite representar diferenças regionais na campanha.

---

# 📢 Campanha eleitoral

A campanha possui seus próprios recursos e indicadores.

Entre eles:

* 💰 Dinheiro
* 👥 Equipe
* 🙋 Voluntários
* 📢 Alcance
* 📅 Agenda
* 🗺️ Estados visitados

A agenda também pode armazenar compromissos:

```text
- Comício
- Entrevista
- Visita política
- Reunião partidária
- Evento público
```

---

# 💰 Sistema financeiro

O jogador precisa administrar seu orçamento.

As despesas são organizadas por categorias:

```text
Campanha
Equipe
Viagens
Outros
```

Exemplo:

```text
Saldo disponível
R$ 150.000,00

Campanha
██████████████░░ 70%

Equipe
████████░░░░░░░░ 40%

Viagens
█████░░░░░░░░░░░ 25%
```

O gerenciamento financeiro é importante para manter a campanha funcionando.

---

# 🏛️ Parlamento

Uma das principais áreas do jogo é o sistema parlamentar.

A interface possui suporte para:

### Câmara dos Deputados

```text
🏛️ Câmara dos Deputados

Plenário
Projetos de Lei
Votações
Deputados
```

### Senado Federal

```text
🏛️ Senado Federal

Plenário
Projetos
Votações
Senadores
```

A interface também permite alternar entre as duas Casas:

```text
[Câmara dos Deputados] [Senado Federal]
```

---

# 📜 Projetos de Lei

O Parlamento trabalha com projetos de lei.

Um projeto pode possuir:

```javascript
{
    number: "...",
    title: "...",
    description: "..."
}
```

Exemplo:

```text
PL 123/2026

Título:
Programa Nacional de Educação Digital

Descrição:
Criação de um programa nacional
voltado à inclusão digital.
```

O sistema parlamentar pode evoluir futuramente para incluir:

* Votação individual
* Bancadas
* Maioria simples
* Maioria absoluta
* Obstrução
* Emendas
* Relatorias
* Comissões
* Câmara
* Senado
* Sanção ou veto presidencial

---

# ⏩ Sistema de tempo

A carreira possui passagem de dias.

O jogador pode avançar manualmente ou utilizar o modo automático.

No modo automático:

```text
A cada 5 segundos
        ↓
   Próximo dia
        ↓
Atualização do jogo
        ↓
Eventos / notícias / pesquisas
```

O recurso pode ser ativado ou desativado pelo jogador.

---

# 💾 Sistema de salvamento

O projeto possui sistema de salvamento da carreira.

A interface chama:

```javascript
window.saveGame()
```

O objetivo é armazenar a carreira em um arquivo **JSON**, permitindo preservar o estado do jogo.

Exemplo conceitual:

```json
{
    "player": {},
    "money": 150000,
    "popularity": 72,
    "reputation": 68,
    "voteIntent": 54,
    "followers": 12000,
    "states": {},
    "campaign": {},
    "parliament": {},
    "news": [],
    "polls": []
}
```

---

# 🧩 Arquitetura do projeto

A interface funciona como uma camada de apresentação sobre o motor principal do jogo.

```text
                   ┌──────────────────┐
                   │      index.html  │
                   │   Estrutura UI   │
                   └────────┬─────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
           style.css      ui.js       outros módulos
              │             │
              │             ▼
              │       Renderização
              │       Navegação
              │       Eventos
              │       Interface
              │
              ▼
        Visual do jogo
                            │
                            ▼
                     ┌─────────────┐
                     │   game.js   │
                     │ Motor do jogo│
                     └──────┬──────┘
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
          data.js       debate.js      parliament.js
             │              │              │
             ▼              ▼              ▼
          Dados         Debates        Parlamento
```

---

# 📁 Estrutura de arquivos

Uma estrutura recomendada para o projeto:

```text
Brasil-Politico-V3/
│
├── index.html
│
├── README.md
│
├── css/
│   └── style.css
│
├── js/
│   ├── data.js
│   ├── game.js
│   ├── ui.js
│   ├── debate.js
│   └── parliament.js
│
├── data/
│   ├── parties.json
│   ├── states.json
│   └── ...
│
├── saves/
│   └── save.json
│
└── assets/
    ├── images/
    ├── icons/
    └── sounds/
```

---

# 🔧 Principais módulos

## `index.html`

Responsável pela estrutura das telas.

Contém:

* Tela inicial
* Criação de carreira
* Dashboard
* Campanha
* Pesquisas
* Notícias
* Debates
* Parlamento
* Orçamento
* Modais

---

## `ui.js`

Responsável pela **interface do jogo**.

Entre suas responsabilidades estão:

```text
Navegação
Renderização
Botões
Menus
Dashboard
Mapa
Campanha
Notícias
Pesquisas
Debates
Parlamento
Orçamento
Modais
Toast
Salvamento
```

O arquivo funciona como uma ponte entre o usuário e o motor do jogo.

---

## `game.js`

Responsável pela lógica principal da simulação.

É onde ficam as regras relacionadas à carreira, passagem de tempo, ações, eventos, economia e estado geral da partida.

A interface acessa o estado através de:

```javascript
window.GAME
```

---

## `data.js`

Responsável pelos dados utilizados pelo jogo.

Exemplos:

```text
Partidos
Estados
Cidades
Dados políticos
Eventos
Configurações
```

A interface busca os dados através de estruturas como:

```javascript
window.PARTIES
window.STATES
window.POLITICAL_DATA
```

---

## `debate.js`

Responsável pelo sistema de debates.

A interface se comunica com ele através de:

```javascript
window.renderDebate()
```

---

## `parliament.js`

Responsável pela lógica específica do Parlamento.

A interface pode chamar:

```javascript
window.renderParliamentUI()
```

e

```javascript
window.switchParliamentTab()
```

---

# 🔄 Comunicação entre os módulos

A arquitetura utiliza objetos e funções globais para conectar os módulos.

Exemplo:

```text
                    window.GAME
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
       game.js        ui.js       outros módulos
          │             │
          │             ▼
          │        Renderização
          │
          ▼
       Estado da partida
```

Isso permite que o `ui.js` leia o estado atual e atualize a interface.

---

# 🛡️ Segurança da interface

O projeto utiliza uma função própria para escapar conteúdo HTML:

```javascript
escapeHTML()
```

Ela protege informações dinâmicas antes de serem inseridas na interface.

Exemplo:

```javascript
escapeHTML(player.name)
```

Isso é utilizado em nomes, partidos, notícias, estados, eventos e outros conteúdos dinâmicos.

---

# 🚀 Como executar

Como o projeto é baseado em HTML/CSS/JavaScript, pode ser executado localmente.

### Opção 1 — VS Code

Abra a pasta do projeto no VS Code e utilize um servidor local, como o **Live Server**.

### Opção 2 — servidor local

Com Node.js instalado:

```bash
npm install
```

Depois:

```bash
npm start
```

ou utilize o servidor configurado no projeto.

> **Importante:** o sistema de salvamento em JSON pode exigir que o projeto seja executado através de um servidor local, dependendo da implementação utilizada.

---

# 🎯 Objetivo do projeto

O objetivo do **Brasil Político V3** é criar uma experiência de simulação política brasileira onde o jogador precise equilibrar:

```text
           POPULARIDADE
                 │
                 ▼
        ┌─────────────────┐
        │     CAMPANHA    │
        └────────┬────────┘
                 │
       ┌─────────┼─────────┐
       ▼         ▼         ▼
    DINHEIRO   APOIO    REPUTAÇÃO
       │         │         │
       └─────────┼─────────┘
                 ▼
            ELEIÇÕES
                 │
                 ▼
             MANDATO
                 │
                 ▼
            PARLAMENTO
                 │
                 ▼
          PROJETOS / VOTOS
                 │
                 ▼
          NOVA ELEIÇÃO
```

Cada decisão pode gerar consequências diferentes.

---

# 🛣️ Roadmap

### ✅ Implementado

* [x] Tela inicial
* [x] Criação de personagem
* [x] Seleção de partido
* [x] Seleção de ideologia
* [x] Seleção de carreira
* [x] Dashboard
* [x] Popularidade
* [x] Reputação
* [x] Intenção de voto
* [x] Seguidores
* [x] Sistema financeiro
* [x] Campanha
* [x] Mapa de estados
* [x] Pesquisas
* [x] Notícias
* [x] Eventos
* [x] Debates
* [x] Partido
* [x] Parlamento
* [x] Câmara dos Deputados
* [x] Senado Federal
* [x] Projetos de lei
* [x] Avanço automático de dias
* [x] Sistema de salvamento JSON

### 🔮 Futuras versões

* [ ] Sistema eleitoral completo
* [ ] Eleições municipais
* [ ] Eleições estaduais
* [ ] Eleições presidenciais
* [ ] Sistema de coligações
* [ ] Sistema de federações partidárias
* [ ] Comissões parlamentares
* [ ] Emendas parlamentares
* [ ] Relatorias
* [ ] CPIs
* [ ] Votações nominais
* [ ] Sistema de impeachment
* [ ] Presidência da Câmara
* [ ] Presidência do Senado
* [ ] Sistema presidencial
* [ ] Ministros
* [ ] Governadores
* [ ] Prefeitos
* [ ] Sistema de corrupção/investigações
* [ ] Sistema judicial
* [ ] Mídia e opinião pública
* [ ] Multiplayer
* [ ] Ranking de políticos
* [ ] Conquistas

---

# 🧠 Conceito técnico

O projeto utiliza uma arquitetura baseada em **estado central do jogo + módulos especializados**.

O estado principal é representado por:

```javascript
window.GAME
```

Enquanto a interface utiliza funções de renderização para transformar esse estado em elementos visuais.

Exemplo:

```javascript
renderDashboard()
renderCampaign()
renderPolls()
renderNews()
renderDebates()
renderParty()
renderBudget()
renderParliament()
```

Dessa forma:

```text
        ESTADO DO JOGO
              │
              ▼
         window.GAME
              │
              ▼
       ┌──────────────┐
       │    UI.JS     │
       └──────┬───────┘
              │
      ┌───────┼────────┐
      ▼       ▼        ▼
 Dashboard Campanha Parlamento
      │       │        │
      └───────┼────────┘
              ▼
          INTERFACE
```

---

# 🇧🇷 Brasil Político V3

**Simule. Decida. Governe.**

O objetivo não é apenas vencer uma eleição.

É construir uma carreira política.

```text
Candidato
   ↓
Campanha
   ↓
Eleição
   ↓
Mandato
   ↓
Parlamento
   ↓
Decisões
   ↓
Popularidade
   ↓
Reeleição
   ↓
Novos cargos
```

---

## 📌 Status

**Versão:** V3
**Plataforma:** Web
**Linguagem:** JavaScript / HTML / CSS
**Tipo:** Simulação política / Estratégia / Gestão
**Ambientação:** Brasil 🇧🇷

---

## 👨‍💻 Desenvolvimento

Projeto desenvolvido como uma simulação política brasileira, com arquitetura modular para permitir a expansão contínua de sistemas, regras e mecânicas.

> **Brasil Político V3 — sua carreira, suas decisões, seu futuro.**


