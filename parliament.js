/* =========================================================
   BRASIL POLÍTICO V3
   PARLIAMENT.JS
   ========================================================= */

(function () {
    "use strict";

    const PARLIAMENT =
        window.PARLIAMENT ||
        {
            initialized: false,

            chamber: "deputies",

            members: [],

            senate: [],

            bills: [],

            currentBill: null
        };

    /* =====================================================
       INICIALIZAR
       ===================================================== */

    function initializeParliament(force = false) {

        if (
            PARLIAMENT.initialized &&
            !force
        ) {
            GAME.parliament =
                PARLIAMENT;

            return;
        }

        PARLIAMENT.members =
            Array.from(
                { length: 60 },
                (_, index) => {

                    const politician =
                        generateFictionalPolitician({
                            role: "Deputado Federal"
                        });

                    return {
                        ...politician,

                        id:
                            "dep_" +
                            index,

                        personalVote:
                            Math.random() > 0.5,

                        chamber:
                            "deputies"
                    };
                }
            );

        PARLIAMENT.senate =
            Array.from(
                { length: 30 },
                (_, index) => {

                    const politician =
                        generateFictionalPolitician({
                            role: "Senador"
                        });

                    return {
                        ...politician,

                        id:
                            "sen_" +
                            index,

                        personalVote:
                            Math.random() > 0.5,

                        chamber:
                            "senate"
                    };
                }
            );

        PARLIAMENT.bills =
            POLITICAL_DATA.BILL_TEMPLATES
                .map(bill => ({
                    ...bill
                }));

        PARLIAMENT.currentBill =
            randomFrom(
                PARLIAMENT.bills
            );

        PARLIAMENT.initialized =
            true;

        GAME.parliament =
            PARLIAMENT;
    }

    /* =====================================================
       TROCAR CÂMARA
       ===================================================== */

    function setParliamentChamber(
        chamber
    ) {

        if (
            chamber !== "senate" &&
            chamber !== "deputies"
        ) {
            return;
        }

        PARLIAMENT.chamber =
            chamber;

        GAME.parliament.chamber =
            chamber;

        renderParliament();
    }

    /* =====================================================
       VOTAÇÃO
       ===================================================== */

    function voteOnBill(vote) {

        const bill =
            PARLIAMENT.currentBill;

        if (!bill) {
            showToast(
                "⚠️",
                "Nenhum projeto em votação."
            );

            return;
        }

        let support =
            Number(bill.support) || 50;

        support +=
            (GAME.reputation - 50) *
            0.2;

        support +=
            GAME.party.influence *
            0.15;

        if (vote === "yes") {
            support += 8;
        }

        if (vote === "no") {
            support -= 8;
        }

        const passed =
            support +
            Math.random() * 20 >
            55;

        if (passed) {

            GAME.stats.billsPassed++;

            GAME.popularity += 2;

            GAME.reputation += 1;

        } else {

            GAME.popularity -= 1;

            GAME.reputation -= 1;
        }

        addNews(
            `${bill.name}: votação ${passed ? "aprovada" : "rejeitada"} no parlamento fictício.`
        );

        PARLIAMENT.currentBill =
            randomFrom(
                PARLIAMENT.bills
            );

        GAME.parliament.currentBill =
            PARLIAMENT.currentBill;

        syncPlayerVoteIntent();

        saveGame();

        renderEverything();
    }

    /* =====================================================
       NEGOCIAÇÃO
       ===================================================== */

    function negotiateBill() {

        if (GAME.energy < 4) {

            showToast(
                "⚡",
                "Energia insuficiente."
            );

            return;
        }

        GAME.party.influence += 2;

        GAME.reputation += 1;

        GAME.energy -= 4;

        saveGame();

        renderEverything();
    }

    /* =====================================================
       RENDER
       ===================================================== */

    function renderParliament() {

        const chamberElement =
            document.getElementById(
                "chamberPlenary"
            );

        const currentBillElement =
            document.getElementById(
                "currentBill"
            );

        if (
            chamberElement
        ) {

            const isSenate =
                PARLIAMENT.chamber ===
                "senate";

            const members =
                isSenate
                    ? PARLIAMENT.senate
                    : PARLIAMENT.members;

            chamberElement.innerHTML = `
                <div class="parliament-card">

                    <h3>
                        ${
                            isSenate
                                ? "Senado"
                                : "Câmara dos Deputados"
                        }
                    </h3>

                    <p>
                        Membros fictícios:
                        <strong>
                            ${members.length}
                        </strong>
                    </p>

                    <p>
                        Apoio partidário:
                        <strong>
                            ${Math.round(
                                GAME.party.support
                            )}%
                        </strong>
                    </p>

                    <p>
                        Influência:
                        <strong>
                            ${Math.round(
                                GAME.party.influence
                            )}
                        </strong>
                    </p>

                </div>
            `;
        }

        if (
            currentBillElement &&
            PARLIAMENT.currentBill
        ) {

            const bill =
                PARLIAMENT.currentBill;

            currentBillElement.innerHTML = `
                <div class="bill-card">

                    <h3>
                        ${escapeHTML(
                            bill.name
                        )}
                    </h3>

                    <p>
                        Tema:
                        ${escapeHTML(
                            ISSUE_BY_ID[
                                bill.issue
                            ]?.name ||
                            bill.issue
                        )}
                    </p>

                    <p>
                        Apoio estimado:
                        ${Math.round(
                            bill.support
                        )}%
                    </p>

                    <div class="bill-actions">

                        <button
                            type="button"
                            onclick="voteOnBill('yes')"
                        >
                            Votar a favor
                        </button>

                        <button
                            type="button"
                            onclick="voteOnBill('no')"
                        >
                            Votar contra
                        </button>

                        <button
                            type="button"
                            onclick="negotiateBill()"
                        >
                            Negociar
                        </button>

                    </div>

                </div>
            `;
        }

        const senateElement =
            document.getElementById(
                "senatePlenary"
            );

        if (
            senateElement
        ) {

            senateElement.innerHTML = `
                <div class="parliament-card">

                    <h3>
                        Senado Federal
                    </h3>

                    <p>
                        ${PARLIAMENT.senate.length}
                        senadores fictícios
                    </p>

                </div>
            `;
        }
    }

    /* =====================================================
       EXPORT
       ===================================================== */

    Object.assign(window, {

        PARLIAMENT,

        initializeParliament,

        setParliamentChamber,

        voteOnBill,

        negotiateBill,

        renderParliament
    });

    /* =====================================================
       INICIALIZAÇÃO
       ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            if (
                window.GAME &&
                GAME.started
            ) {
                initializeParliament();

                renderParliament();
            }

        }
    );

})();