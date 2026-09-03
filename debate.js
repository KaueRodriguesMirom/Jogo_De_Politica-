/* =========================================================
   BRASIL POLÍTICO V3
   DEBATE.JS — SISTEMA COMPLETO
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       ESTADO DO DEBATE
    ===================================================== */

    const DEBATE =
        window.DEBATE ||
        {
            active: false,

            type: null,

            round: 0,

            score: 0,

            questions: [],

            opponent: null,

            journalist: null,

            totalRounds: 5
        };

    /* =====================================================
       DADOS
    ===================================================== */

    const DEBATE_QUESTIONS =
        window.DEBATE_QUESTIONS ||
        window.POLITICAL_DATA?.DEBATE_QUESTIONS ||
        [];

    const DEBATE_RESPONSE_STYLES = [
        "técnica",
        "conciliadora",
        "direta",
        "propositiva"
    ];

    const DEBATE_COUNTERATTACKS = [
        "Seu plano parece difícil de executar.",
        "Como você pretende financiar essa proposta?",
        "O eleitor precisa de resultados concretos.",
        "Essa proposta não parece simples de implementar."
    ];

    /* =====================================================
       OPONENTES
    ===================================================== */

    const OPPONENT_NAMES = [
        "Marcos Ferreira",
        "Carolina Mendes",
        "Rafael Souza",
        "Juliana Campos"
    ];

    const DEBATE_OPPONENTS =
        OPPONENT_NAMES.map(function (name) {

            if (
                typeof window.generateFictionalPolitician ===
                "function"
            ) {

                return window.generateFictionalPolitician({
                    name: name,
                    role: "Candidato"
                });
            }

            return {
                name: name,
                role: "Candidato",
                charisma: 50,
                reputation: 50,
                popularity: 50
            };
        });

    /* =====================================================
       UTILITÁRIOS
    ===================================================== */

    function randomFrom(array) {

        if (
            typeof window.randomFrom ===
            "function"
        ) {
            return window.randomFrom(array);
        }

        if (
            !Array.isArray(array) ||
            !array.length
        ) {
            return null;
        }

        return array[
            Math.floor(
                Math.random() * array.length
            )
        ];
    }

    function escapeHTML(value) {

        if (
            typeof window.escapeHTML ===
            "function"
        ) {
            return window.escapeHTML(value);
        }

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getGame() {
        return window.GAME || null;
    }

    function getQuestions() {

        return (
            window.DEBATE_QUESTIONS ||
            window.POLITICAL_DATA?.DEBATE_QUESTIONS ||
            DEBATE_QUESTIONS ||
            []
        );
    }

    /* =====================================================
       CONFIGURAÇÃO DOS FORMATOS
    ===================================================== */

    const DEBATE_TYPES = {

        tv: {
            name: "Debate na TV",
            rounds: 8,
            energy: 8
        },

        radio: {
            name: "Debate no Rádio",
            rounds: 5,
            energy: 5
        },

        press: {
            name: "Entrevista à Imprensa",
            rounds: 6,
            energy: 6
        },

        campaign: {
            name: "Debate de Campanha",
            rounds: 8,
            energy: 8
        }
    };

    /* =====================================================
       INICIAR DEBATE
    ===================================================== */

    function startDebate(typeOrConfig) {

        let config;

        /*
         * Aceita:
         *
         * startDebate("tv")
         *
         * ou
         *
         * startDebate({
         *     type: "tv",
         *     rounds: 8
         * })
         */

        if (
            typeof typeOrConfig ===
            "string"
        ) {

            config = {
                type: typeOrConfig
            };

        } else {

            config =
                typeOrConfig ||
                {};
        }

        const game =
            getGame();

        /* =================================================
           VERIFICAR CARREIRA
        ================================================= */

        if (
            !game ||
            !game.started
        ) {

            if (
                typeof window.showToast ===
                "function"
            ) {

                window.showToast(
                    "⚠️",
                    "Inicie uma carreira antes de participar de um debate."
                );
            }

            return null;
        }

        /* =================================================
           TIPO
        ================================================= */

        const type =
            config.type ||
            "campaign";

        const typeConfig =
            DEBATE_TYPES[type] ||
            DEBATE_TYPES.campaign;

        /* =================================================
           ENERGIA
        ================================================= */

        const energyCost =
            Number(
                config.energy ??
                typeConfig.energy ??
                8
            );

        const currentEnergy =
            Number(
                game.energy || 0
            );

        if (
            currentEnergy <
            energyCost
        ) {

            if (
                typeof window.showToast ===
                "function"
            ) {

                window.showToast(
                    "⚡",
                    `Energia insuficiente. Você precisa de ${energyCost} de energia.`
                );
            }

            return null;
        }

        /* =================================================
           PERGUNTAS
        ================================================= */

        const allQuestions =
            getQuestions();

        if (
            !Array.isArray(allQuestions) ||
            !allQuestions.length
        ) {

            console.error(
                "DEBATE_QUESTIONS não encontrado."
            );

            if (
                typeof window.showToast ===
                "function"
            ) {

                window.showToast(
                    "❌",
                    "As perguntas dos debates não foram carregadas."
                );
            }

            return null;
        }

        const rounds =
            Math.min(
                Number(
                    config.rounds ||
                    typeConfig.rounds ||
                    5
                ),
                allQuestions.length
            );

        /* =================================================
           RESET
        ================================================= */

        DEBATE.active = true;

        DEBATE.type = type;

        DEBATE.round = 0;

        DEBATE.score = 0;

        DEBATE.totalRounds = rounds;

        DEBATE.opponent =
            config.opponent ||
            randomFrom(
                DEBATE_OPPONENTS
            );

        const journalists =
            window.POLITICAL_DATA
                ?.FICTIONAL_JOURNALISTS ||
            [];

        DEBATE.journalist =
            config.journalist ||
            randomFrom(
                journalists
            ) ||
            {
                name: "Ana Martins"
            };

        DEBATE.questions =
            [...allQuestions]
                .sort(
                    function () {
                        return Math.random() - 0.5;
                    }
                )
                .slice(
                    0,
                    rounds
                );

        /* =================================================
           GASTAR ENERGIA
        ================================================= */

        game.energy =
            Math.max(
                0,
                currentEnergy -
                energyCost
            );

        /* =================================================
           ESTATÍSTICAS
        ================================================= */

        if (!game.stats) {
            game.stats = {};
        }

        game.stats.debates =
            Number(
                game.stats.debates || 0
            ) + 1;

        /* =================================================
           RENDER
        ================================================= */

        renderDebate();

        if (
            typeof window.saveGame ===
            "function"
        ) {

            try {
                window.saveGame();
            } catch (error) {
                console.error(
                    "Erro ao salvar debate:",
                    error
                );
            }
        }

        return DEBATE;
    }

    /* =====================================================
       RESPONDER
    ===================================================== */

    function answerDebate(
        index,
        style
    ) {

        if (
            !DEBATE.active
        ) {
            return;
        }

        const game =
            getGame();

        if (!game) {
            return;
        }

        /*
         * Compatibilidade:
         *
         * answerDebate(0, "técnica")
         *
         * ou
         *
         * answerDebate("técnica")
         */

        if (
            typeof index ===
            "string"
        ) {

            style = index;
        }

        const question =
            DEBATE.questions[
                DEBATE.round
            ];

        if (!question) {

            finishDebate();

            return;
        }

        /* =================================================
           PONTUAÇÃO BASE
        ================================================= */

        let score =
            1 +
            Math.random() * 4;

        const reputation =
            Number(
                game.reputation || 0
            );

        const popularity =
            Number(
                game.popularity || 0
            );

        const charisma =
            Number(
                game.player?.charisma || 50
            );

        /* =================================================
           BÔNUS POR ESTILO
        ================================================= */

        if (
            style === "técnica"
        ) {

            score +=
                reputation *
                0.03;
        }

        if (
            style === "direta"
        ) {

            score +=
                charisma *
                0.03;
        }

        if (
            style === "conciliadora"
        ) {

            score +=
                reputation *
                0.02;
        }

        if (
            style === "propositiva"
        ) {

            score +=
                popularity *
                0.02;
        }

        const gained =
            Math.max(
                1,
                Math.round(score)
            );

        DEBATE.score +=
            gained;

        DEBATE.round++;

        /* =================================================
           FINALIZAR
        ================================================= */

        if (
            DEBATE.round >=
            DEBATE.questions.length
        ) {

            finishDebate();

            return;
        }

        renderDebate();
    }

    /* =====================================================
       FINALIZAR
    ===================================================== */

    function finishDebate() {

        if (
            !DEBATE.active
        ) {
            return;
        }

        const game =
            getGame();

        if (!game) {
            return;
        }

        DEBATE.active = false;

        const maximum =
            Math.max(
                1,
                DEBATE.questions.length * 7
            );

        const percentage =
            (
                DEBATE.score /
                maximum
            );

        let delta = 0;

        if (
            percentage >=
            0.75
        ) {

            delta = 4;

        } else if (
            percentage >=
            0.50
        ) {

            delta = 2;

        } else if (
            percentage >=
            0.35
        ) {

            delta = 1;

        } else {

            delta = -1;
        }

        game.popularity =
            Math.max(
                0,
                Math.min(
                    100,
                    Number(
                        game.popularity || 0
                    ) + delta
                )
            );

        game.reputation =
            Math.max(
                0,
                Math.min(
                    100,
                    Number(
                        game.reputation || 0
                    ) + delta
                )
            );

        /* =================================================
           NOTÍCIA
        ================================================= */

        if (
            typeof window.addNews ===
            "function"
        ) {

            try {

                window.addNews(
                    `Debate encerrado com desempenho de ${
                        game.player?.name ||
                        "candidato"
                    }.`
                );

            } catch (error) {

                console.error(
                    "Erro ao adicionar notícia:",
                    error
                );
            }
        }

        /* =================================================
           INTENÇÃO DE VOTO
        ================================================= */

        if (
            typeof window.syncPlayerVoteIntent ===
            "function"
        ) {

            try {
                window.syncPlayerVoteIntent();
            } catch (error) {
                console.error(
                    "Erro ao atualizar intenção de voto:",
                    error
                );
            }
        }

        /* =================================================
           SALVAR
        ================================================= */

        if (
            typeof window.saveGame ===
            "function"
        ) {

            try {
                window.saveGame();
            } catch (error) {
                console.error(
                    "Erro ao salvar resultado:",
                    error
                );
            }
        }

        renderDebate();

        if (
            typeof window.renderEverything ===
            "function"
        ) {

            try {
                window.renderEverything();
            } catch (error) {
                console.error(
                    "Erro ao atualizar interface:",
                    error
                );
            }
        }

        if (
            typeof window.showToast ===
            "function"
        ) {

            if (
                delta > 0
            ) {

                window.showToast(
                    "🎤",
                    `Debate concluído! Popularidade +${delta}.`
                );

            } else {

                window.showToast(
                    "🎤",
                    "Debate concluído. O desempenho poderia ter sido melhor."
                );
            }
        }
    }

    /* =====================================================
       RENDER
    ===================================================== */

    function renderDebate() {

        const arena =
            document.getElementById(
                "debateArena"
            );

        if (!arena) {

            console.error(
                "#debateArena não encontrado."
            );

            return;
        }

        /* =================================================
           DEBATE NÃO INICIADO
        ================================================= */

        if (
            !DEBATE.active
        ) {

            arena.classList.add(
                "hidden"
            );

            arena.innerHTML = `
                <div class="empty-state">

                    <span style="font-size:40px;">
                        🎤
                    </span>

                    <h3>
                        Nenhum debate em andamento
                    </h3>

                    <p>
                        Escolha um formato acima para começar.
                    </p>

                </div>
            `;

            return;
        }

        /* =================================================
           MOSTRAR ARENA
        ================================================= */

        arena.classList.remove(
            "hidden"
        );

        const question =
            DEBATE.questions[
                DEBATE.round
            ];

        if (!question) {

            finishDebate();

            return;
        }

        const typeConfig =
            DEBATE_TYPES[
                DEBATE.type
            ] ||
            DEBATE_TYPES.campaign;

        const opponent =
            DEBATE.opponent ||
            {};

        const journalist =
            DEBATE.journalist ||
            {};

        const questionText =
            question.question ||
            question.text ||
            question.title ||
            "Qual é a sua posição sobre este tema?";

        arena.innerHTML = `

            <div class="debate-top">

                <div class="debate-title">

                    <span>
                        🎤
                    </span>

                    <div>

                        <small>
                            ${escapeHTML(
                                typeConfig.name
                            )}
                        </small>

                        <h2>
                            Debate em andamento
                        </h2>

                    </div>

                </div>

                <div class="debate-progress">

                    <span>
                        RODADA
                    </span>

                    <strong>
                        ${DEBATE.round + 1}
                        /
                        ${DEBATE.questions.length}
                    </strong>

                </div>

            </div>

            <div class="debate-moderator">

                <div class="debate-moderator-icon">
                    🎙️
                </div>

                <div>

                    <small>
                        JORNALISTA
                    </small>

                    <strong>
                        ${escapeHTML(
                            journalist.name ||
                            "Jornalista"
                        )}
                    </strong>

                </div>

            </div>

            <div class="debate-opponent">

                <div>

                    <small>
                        ADVERSÁRIO
                    </small>

                    <strong>
                        ${escapeHTML(
                            opponent.name ||
                            "Candidato adversário"
                        )}
                    </strong>

                </div>

                <span>
                    ${Math.round(
                        opponent.popularity ||
                        opponent.reputation ||
                        50
                    )}%
                </span>

            </div>

            <div class="debate-question">

                <div class="eyebrow">
                    PERGUNTA
                </div>

                <h3>
                    ${escapeHTML(
                        questionText
                    )}
                </h3>

            </div>

            <div class="debate-answer-title">
                Escolha sua resposta
            </div>

            <div class="debate-answers">

                ${DEBATE_RESPONSE_STYLES
                    .map(function (style) {

                        const descriptions = {

                            "técnica":
                                "Apresente dados, números e argumentos técnicos.",

                            "conciliadora":
                                "Busque diálogo e construa consenso.",

                            "direta":
                                "Responda com firmeza e objetividade.",

                            "propositiva":
                                "Apresente uma solução prática e concreta."
                        };

                        return `

                            <button
                                type="button"
                                class="debate-answer"
                                onclick="answerDebate(0, '${style}')"
                            >

                                <strong>
                                    ${escapeHTML(
                                        style
                                    )}
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        descriptions[
                                            style
                                        ]
                                    )}
                                </span>

                            </button>

                        `;
                    })
                    .join("")}

            </div>

            <div class="debate-metrics">

                <div>

                    <small>
                        PONTOS
                    </small>

                    <strong>
                        ${DEBATE.score}
                    </strong>

                </div>

                <div>

                    <small>
                        ENERGIA
                    </small>

                    <strong>
                        ${Math.round(
                            Number(
                                getGame()?.energy ||
                                0
                            )
                        )}
                    </strong>

                </div>

                <div>

                    <small>
                        ADVERSÁRIO
                    </small>

                    <strong>
                        ${escapeHTML(
                            opponent.name ||
                            "Candidato"
                        )}
                    </strong>

                </div>

            </div>

            <div style="
                margin-top:18px;
                text-align:center;
            ">

                <button
                    type="button"
                    class="btn btn-secondary"
                    onclick="cancelDebate()"
                >
                    Encerrar debate
                </button>

            </div>
        `;
    }

    /* =====================================================
       CANCELAR
    ===================================================== */

    function cancelDebate() {

        if (
            !DEBATE.active
        ) {
            renderDebate();
            return;
        }

        DEBATE.active = false;

        DEBATE.round = 0;

        DEBATE.score = 0;

        renderDebate();

        if (
            typeof window.saveGame ===
            "function"
        ) {

            try {
                window.saveGame();
            } catch (error) {
                console.error(
                    error
                );
            }
        }

        if (
            typeof window.showToast ===
            "function"
        ) {

            window.showToast(
                "⏹️",
                "Debate encerrado."
            );
        }
    }

    /* =====================================================
       ABRIR DEBATES
    ===================================================== */

    function openDebates() {

        const game =
            getGame();

        if (
            !game ||
            !game.started
        ) {

            if (
                typeof window.showToast ===
                "function"
            ) {

                window.showToast(
                    "⚠️",
                    "Inicie uma carreira antes de participar de um debate."
                );
            }

            return;
        }

        /*
         * NÃO inicia o debate automaticamente.
         *
         * Apenas abre a página.
         */

        if (
            typeof window.navigateTo ===
            "function"
        ) {

            window.navigateTo(
                "debates"
            );

        } else {

            const page =
                document.getElementById(
                    "debatesPage"
                );

            if (page) {

                document
                    .querySelectorAll(
                        "#gameScreen .page"
                    )
                    .forEach(function (item) {

                        item.classList.add(
                            "hidden"
                        );

                        item.classList.remove(
                            "active-page"
                        );
                    });

                page.classList.remove(
                    "hidden"
                );

                page.classList.add(
                    "active-page"
                );
            }
        }

        renderDebate();
    }

    /* =====================================================
       DEBATE DE CAMPANHA
    ===================================================== */

    function campaignDebate(
        opponent
    ) {

        return startDebate({

            type: "campaign",

            opponent:
                typeof opponent ===
                "object"
                    ? opponent
                    : null,

            rounds: 8

        });
    }

    /* =====================================================
       EXPORTAÇÃO
    ===================================================== */

    Object.assign(
        window,
        {

            DEBATE,

            DEBATE_QUESTIONS,

            DEBATE_RESPONSE_STYLES,

            DEBATE_COUNTERATTACKS,

            DEBATE_OPPONENTS,

            DEBATE_TYPES,

            startDebate,

            answerDebate,

            finishDebate,

            renderDebate,

            campaignDebate,

            openDebates,

            cancelDebate
        }
    );

})();