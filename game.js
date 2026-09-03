/* =========================================================
   BRASIL POLÍTICO V3
   GAME.JS — Motor principal
   ========================================================= */

(function () {
    "use strict";

    const GAME_SAVE_KEY = "brasil_politico_v3_save";
    const GAME_VERSION = 3;

    function createDefaultGame() {
        return {
            version: GAME_VERSION,

            started: false,

            day: 1,
            year: 2026,

            phase: "Campanha",

            date: "01/01/2026",

            player: null,

            money: 50000,

            energy: 100,
            maxEnergy: 100,

            followers: 1000,

            popularity: 50,
            reputation: 50,

            voteIntent: 5,

            news: [],
            polls: [],

            event: null,

            budget: {
                income: 50000,

                expenses: 0,

                expensesByType: {
                    campaign: 0,
                    staff: 0,
                    travel: 0,
                    other: 0
                }
            },

            campaign: {
                strategy: null,

                volunteers: 20,

                agenda: [],

                visitedStates: [],

                visitedCities: []
            },

            party: {
                support: 50,
                influence: 10
            },

            parliament: {
                chamber: "deputies",

                members: [],
                senate: [],

                bills: [],

                currentBill: null
            },

            election: {
                active: false,

                type: null,
                office: null,

                state: null,
                city: null,

                round: 1,

                turnout: 0,

                votesCast: 0,

                playerVotes: 0,

                playerPercentage: 0,

                candidates: []
            },

            stats: {
                actions: 0,

                debates: 0,

                interviews: 0,

                billsPassed: 0
            },

            states: {}
        };
    }

    const GAME = createDefaultGame();

    /* =====================================================
       SINCRONIZAÇÃO
       ===================================================== */

    function syncGameValues() {
        GAME.money = Math.max(
            0,
            Number(GAME.money) || 0
        );

        GAME.energy = Math.max(
            0,
            Math.min(
                GAME.maxEnergy,
                Number(GAME.energy) || 0
            )
        );

        GAME.followers = Math.max(
            0,
            Math.round(Number(GAME.followers) || 0)
        );

        GAME.popularity = clamp(
            GAME.popularity
        );

        GAME.reputation = clamp(
            GAME.reputation
        );

        GAME.party.support = clamp(
            GAME.party.support
        );

        GAME.voteIntent = clamp(
            2 +
            GAME.popularity * 0.12 +
            GAME.reputation * 0.08 +
            GAME.followers / 10000
        );
    }

    /* =====================================================
       SAVE
       ===================================================== */

    /* =====================================================
   SAVE
===================================================== */

async function saveGame() {
    try {
        if (!GAME) {
            console.error("GAME não existe.");
            return false;
        }

        syncGameValues();

        const saveData = structuredClone(GAME);

        const response = await fetch("/api/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(saveData)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        console.log("💾 Jogo salvo no JSON.", {
            day: GAME.day,
            date: GAME.date,
            phase: GAME.phase,
            player: GAME.player
        });

        return true;

    } catch (error) {
        console.error("❌ Erro ao salvar jogo:", error);
        return false;
    }
}

    async function loadGameData() {
        try {
            const response = await fetch("/api/save");

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const saved = await response.json();

            if (!saved) {
                return false;
            }

            Object.assign(
                GAME,
                createDefaultGame(),
                saved
            );

            syncGameValues();

            return true;

        } catch (error) {
            console.error("Erro ao carregar:", error);
            return false;
        }
    }

    async function loadGame() {
        try {
            const response = await fetch("/api/save");

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const saved = await response.json();

            if (!saved || typeof saved !== "object") {
                throw new Error("Nenhum jogo salvo encontrado.");
            }

            Object.assign(
                GAME,
                createDefaultGame(),
                saved
            );

            syncGameValues();

            console.log("💾 Jogo carregado:", GAME);

            if (typeof renderEverything === "function") {
                renderEverything();
            }

            if (typeof window.navigateTo === "function") {
                window.navigateTo("dashboard");
            }

            if (typeof showToast === "function") {
                showToast("✅", "Jogo carregado com sucesso!");
            }

            return true;

        } catch (error) {
            console.error("❌ ERRO AO CARREGAR JOGO:", error);

            if (typeof showToast === "function") {
                showToast("⚠️", "Nenhum jogo salvo encontrado.");
            }

            return false;
        }
    }
    /* =====================================================
       ESTADOS
       ===================================================== */

    function initializeStates() {
        GAME.states = {};

        STATES.forEach(state => {
            GAME.states[state.uf] = {
                uf: state.uf,

                visited: false,

                support:
                    25 +
                    Math.random() * 30
            };
        });
    }

    /* =====================================================
       PESQUISAS
       ===================================================== */

    function generatePoll() {
        return {
            id: generateId("poll"),

            date: GAME.date,

            source:
                randomFrom(
                    POLITICAL_DATA.POLL_SOURCES
                ),

            candidate:
                clamp(
                    GAME.voteIntent +
                    (-2 + Math.random() * 4),
                    0,
                    100
                ),

            undecided:
                30 +
                Math.random() * 10,

            other:
                Math.random() * 8
        };
    }

    function generateInitialPolls() {
        GAME.polls = Array.from(
            { length: 8 },
            generatePoll
        );
    }

    /* =====================================================
       NOTÍCIAS
       ===================================================== */

    function addNews(title) {
        GAME.news.unshift({
            id: generateId("news"),

            date: GAME.date,

            title
        });

        GAME.news =
            GAME.news.slice(0, 30);
    }

    function generateInitialNews() {
        GAME.news = [];

        for (let i = 0; i < 5; i++) {
            addNews(
                NEWS_TEMPLATES[i]
            );
        }
    }

    /* =====================================================
       PARLAMENTO
       ===================================================== */

    function initializeParliament() {
        if (
            typeof window.initializeParliament ===
            "function"
        ) {
            window.initializeParliament();
        }
    }

    /* =====================================================
       CRIAÇÃO DO PERSONAGEM
       ===================================================== */
async function resetGame() {
    try {
        const defaultGame = createDefaultGame();

        Object.keys(GAME).forEach(key => {
            delete GAME[key];
        });

        Object.assign(GAME, defaultGame);

        syncGameValues();

        await saveGame();

        if (typeof renderEverything === "function") {
            renderEverything();
        }

        if (typeof showToast === "function") {
            showToast("🔄", "Jogo reiniciado com sucesso!");
        }

        console.log("🔄 Jogo resetado.");

        return true;

    } catch (error) {
        console.error("Erro ao resetar jogo:", error);
        return false;
    }
}
    async function initializeGame(config) {
        Object.assign(
            GAME,
            createDefaultGame(),
            {
                started: true,

                player: {
                    name: config.name,

                    age: Number(config.age),

                    state: config.state,

                    city: config.city,

                    party: config.party,

                    ideology: config.ideology,

                    career: config.career
                },

                money: 50000
            }
        );

        initializeStates();

        generateInitialPolls();

        generateInitialNews();

        initializeParliament();

        syncGameValues();

        await saveGame();

        renderEverything();
    }

    /* =====================================================
       EFEITOS
       ===================================================== */

    function applyEffects(effects = {}) {
        Object.entries(effects)
            .forEach(([key, value]) => {

                value = Number(value) || 0;

                switch (key) {

                    case "cash":
                    case "money":
                        GAME.money += value;
                        break;

                    case "energy":
                        GAME.energy += value;
                        break;

                    case "followers":
                        GAME.followers += value;
                        break;

                    case "popularity":
                        GAME.popularity += value;
                        break;

                    case "reputation":
                        GAME.reputation += value;
                        break;

                    case "partySupport":
                        GAME.party.support += value;
                        break;

                    case "volunteers":
                        GAME.campaign.volunteers += value;
                        break;

                    case "preparation":
                        GAME.player.preparation =
                            (GAME.player.preparation || 0) +
                            value;
                        break;

                    case "organization":
                        GAME.player.organization =
                            (GAME.player.organization || 0) +
                            value;
                        break;

                    case "negotiation":
                        GAME.player.negotiation =
                            (GAME.player.negotiation || 0) +
                            value;
                        break;

                    case "charisma":
                        GAME.player.charisma =
                            (GAME.player.charisma || 50) +
                            value;
                        break;
                }
            });

        syncGameValues();
    }

    /* =====================================================
       EVENTOS
       ===================================================== */

    function getAllEvents() {
        return [
            ...EVENT_TEMPLATES,
            ...PROCEDURAL_EVENTS
        ];
    }

    function generateDailyEvent() {
        GAME.event =
            randomFrom(getAllEvents());
    }

    function chooseEvent(
        eventId,
        optionIndex
    ) {
        const event =
            getAllEvents()
                .find(e => e.id === eventId);

        if (!event) {
            return;
        }

        const option =
            event.options[optionIndex];

        if (!option) {
            return;
        }

        applyEffects(
            option.effects
        );

        GAME.event = null;

        saveGame();

        renderEverything();
    }

    /* =====================================================
       AÇÕES
       ===================================================== */

    function performAction(type) {

        const actions = {

            social: {
                cost: 0,
                energy: 5,
                popularity: 2,
                followers: 150
            },

            rally: {
                cost: 2500,
                energy: 15,
                popularity: 4,
                followers: 400
            },

            visit: {
                cost: 1000,
                energy: 10,
                popularity: 3,
                reputation: 2
            },

            interview: {
                cost: 0,
                energy: 5,
                popularity: 2,
                reputation: 1,
                followers: 250
            },

            debate: {
                cost: 0,
                energy: 12,
                popularity: 3,
                reputation: 2
            },

            party: {
                cost: 500,
                energy: 5,
                reputation: 3
            },

            fundraising: {
                cost: -3000,
                energy: 8,
                reputation: -1
            },

            rest: {
                cost: 0,
                energy: -25,
                reputation: 1
            }
        };

        const action =
            actions[type];

        if (!action) {
            return;
        }

        /* Custo de energia positivo significa gasto */
        if (
            action.energy > 0 &&
            GAME.energy < action.energy
        ) {
            showToast(
                "⚡",
                "Energia insuficiente."
            );

            return;
        }

        if (
            action.cost > 0 &&
            GAME.money < action.cost
        ) {
            showToast(
                "💰",
                "Dinheiro insuficiente."
            );

            return;
        }

        GAME.money -= action.cost;

        GAME.energy -= action.energy;

        applyEffects({
            popularity:
                action.popularity || 0,

            reputation:
                action.reputation || 0,

            followers:
                action.followers || 0
        });

        if (action.cost > 0) {

            GAME.budget.expenses +=
                action.cost;

            GAME.budget.expensesByType.campaign +=
                action.cost;
        }

        GAME.stats.actions++;

        addNews(
            `${GAME.player?.name || "Candidato"} realizou uma ação de campanha.`
        );

        syncGameValues();

        saveGame();

        renderEverything();
    }

    /* =====================================================
       PRÓXIMO DIA
       ===================================================== */

    function nextDay() {

        if (!GAME.started) {
            return;
        }

        if (
            typeof window.campaignDailyUpdate ===
            "function"
        ) {
            window.campaignDailyUpdate();
        }

        if (
            typeof window.electionDailyUpdate ===
            "function"
        ) {
            window.electionDailyUpdate();
        }

        GAME.day++;

        GAME.energy =
            GAME.maxEnergy;

        const date =
            new Date(
                2026,
                0,
                GAME.day
            );

        GAME.date =
            date.toLocaleDateString(
                "pt-BR"
            );

        GAME.year =
            date.getFullYear();

        if (
            GAME.day % 7 === 0
        ) {
            GAME.polls.unshift(
                generatePoll()
            );

            GAME.polls =
                GAME.polls.slice(
                    0,
                    30
                );
        }

        if (chance(35)) {
            generateDailyEvent();
        }

        addNews(
            randomFrom(
                NEWS_TEMPLATES
            )
        );

        syncGameValues();

        saveGame();

        renderEverything();
    }

    function syncPlayerVoteIntent() {
        syncGameValues();
    }

    /* =====================================================
       EXPORT
       ===================================================== */

    Object.assign(window, {

        GAME,

        GAME_SAVE_KEY,
        GAME_VERSION,

        createDefaultGame,

        saveGame,
        loadGameData,
        loadGame,
        resetGame,

        initializeGame,

        initializeStates,

        generatePoll,
        generateInitialPolls,
        generateInitialNews,

        initializeParliament,

        addNews,

        applyEffects,

        chooseEvent,

        performAction,

        nextDay,

        syncPlayerVoteIntent
    });

})();