/* =========================================================
   BRASIL POLÍTICO V3
   ELECTIONS.JS
   ========================================================= */

(function () {
    "use strict";

    const ELECTIONS =
        window.ELECTIONS ||
        {
            history: [],

            lastResult: null
        };

    const ELECTION_CONFIG = {

        deputadoFederal: {
            office: "Deputado Federal",
            type: "proportional"
        },

        deputadoEstadual: {
            office: "Deputado Estadual",
            type: "proportional"
        },

        prefeito: {
            office: "Prefeito",
            type: "majoritarian"
        }
    };

    /* =====================================================
       NOME DO CARGO
       ===================================================== */

    function getOfficeName(
        key
    ) {

        return (
            ELECTION_CONFIG[key]?.office ||
            key ||
            "Cargo"
        );
    }

    /* =====================================================
       INICIAR ELEIÇÃO
       ===================================================== */

    function startElection(
        electionType,
        office,
        state = null,
        city = null
    ) {

        if (
            GAME.election.active
        ) {

            showToast(
                "⚠️",
                "Já existe uma eleição em andamento."
            );

            return;
        }

        GAME.election = {

            active: true,

            type: electionType,

            office: office,

            state: state,

            city: city,

            round: 1,

            turnout: 0,

            votesCast: 0,

            playerVotes: 0,

            playerPercentage: 0,

            candidates: []
        };

        const candidateNames = [
            GAME.player?.name ||
            "Você",

            generatePersonName(),

            generatePersonName(),

            generatePersonName()
        ];

        GAME.election.candidates =
            candidateNames.map(
                (name, index) => {

                    const party =
                        index === 0
                            ? GAME.player.party
                            : randomFrom(
                                PARTIES
                            ).acronym;

                    return {

                        id:
                            "candidate_" +
                            index,

                        name,

                        party,

                        votes: 0
                    };
                }
            );

        GAME.phase =
            "Eleição";

        saveGame();

        renderEverything();

        return GAME.election;
    }

    /* =====================================================
       SIMULAR ELEIÇÃO
       ===================================================== */

    function runElection() {

        if (
            !GAME.election.active
        ) {
            return;
        }

        const totalElectorate =
            100000 +
            Math.floor(
                Math.random() *
                150000
            );

        let playerShare =
            GAME.voteIntent / 100;

        playerShare +=
            -0.05 +
            Math.random() * 0.15;

        playerShare =
            Math.max(
                0.02,
                Math.min(
                    0.80,
                    playerShare
                )
            );

        const turnout =
            0.65 +
            Math.random() * 0.20;

        const votesCast =
            Math.round(
                totalElectorate *
                turnout
            );

        const playerVotes =
            Math.round(
                votesCast *
                playerShare
            );

        GAME.election.turnout =
            turnout * 100;

        GAME.election.votesCast =
            votesCast;

        GAME.election.playerVotes =
            playerVotes;

        GAME.election.playerPercentage =
            votesCast > 0
                ? playerVotes /
                  votesCast *
                  100
                : 0;

        let remaining =
            votesCast -
            playerVotes;

        GAME.election.candidates
            .forEach(
                (candidate, index) => {

                    if (index === 0) {

                        candidate.votes =
                            playerVotes;

                        return;
                    }

                    const competitors =
                        GAME.election.candidates.length -
                        1;

                    const average =
                        Math.max(
                            0,
                            remaining /
                            competitors
                        );

                    const variation =
                        0.60 +
                        Math.random() *
                        0.80;

                    candidate.votes =
                        Math.max(
                            0,
                            Math.round(
                                average *
                                variation
                            )
                        );

                    remaining -=
                        candidate.votes;
                }
            );

        /* Corrige eventual sobra */
        if (
            remaining > 0 &&
            GAME.election.candidates.length > 1
        ) {
            GAME.election.candidates[1].votes +=
                remaining;
        }

        GAME.election.active =
            false;

        ELECTIONS.lastResult =
            JSON.parse(
                JSON.stringify(
                    GAME.election
                )
            );

        ELECTIONS.history.push(
            ELECTIONS.lastResult
        );

        addNews(
            `Apuração fictícia concluída para ${getOfficeName(GAME.election.office)}.`
        );

        saveGame();

        renderEverything();
    }

    /* =====================================================
       ATUALIZAÇÃO DIÁRIA
       ===================================================== */

    function electionDailyUpdate() {

        if (
            GAME.election.active &&
            GAME.day % 3 === 0
        ) {

            runElection();
        }
    }

    /* =====================================================
       RESET
       ===================================================== */

    function resetElection() {

        GAME.election = {

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
        };

        saveGame();

        renderEverything();
    }

    /* =====================================================
       FORMATAÇÃO
       ===================================================== */

    function formatElectionVotes(
        votes
    ) {

        return Number(
            votes || 0
        ).toLocaleString(
            "pt-BR"
        );
    }

    /* =====================================================
       RESULTADO
       ===================================================== */

    function getElectionWinner() {

        if (
            !ELECTIONS.lastResult ||
            !Array.isArray(
                ELECTIONS.lastResult.candidates
            )
        ) {
            return null;
        }

        return [
            ...ELECTIONS
                .lastResult
                .candidates
        ].sort(
            (a, b) =>
                b.votes -
                a.votes
        )[0];
    }

    /* =====================================================
       EXPORT
       ===================================================== */

    Object.assign(window, {

        ELECTIONS,

        ELECTION_CONFIG,

        startElection,

        runElection,

        electionDailyUpdate,

        resetElection,

        getOfficeName,

        formatElectionVotes,

        getElectionWinner
    });

})();