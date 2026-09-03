/* =========================================================
   BRASIL POLÍTICO V3
   CAMPAIGN.JS
   ========================================================= */

(function () {
    "use strict";

    const CAMPAIGN =
        window.CAMPAIGN ||
        {
            active: false,
            history: []
        };

    const CAMPAIGN_STRATEGIES =
        window.CAMPAIGN_STRATEGIES ||
        POLITICAL_DATA.CAMPAIGN_STRATEGIES;

    /* =====================================================
       ESTRATÉGIA
       ===================================================== */

    function chooseCampaignStrategy(key) {

        const strategy =
            CAMPAIGN_STRATEGIES[key];

        if (!strategy) {
            return;
        }

        if (
            GAME.money <
            strategy.cost
        ) {
            showToast(
                "💰",
                "Dinheiro insuficiente."
            );

            return;
        }

        if (
            GAME.energy <
            strategy.energy
        ) {
            showToast(
                "⚡",
                "Energia insuficiente."
            );

            return;
        }

        GAME.money -=
            strategy.cost;

        GAME.energy -=
            strategy.energy;

        GAME.popularity +=
            strategy.popularity;

        GAME.followers +=
            strategy.followers;

        GAME.budget.expenses +=
            strategy.cost;

        GAME.budget.expensesByType.campaign +=
            strategy.cost;

        GAME.campaign.strategy =
            key;

        GAME.campaign.agenda.push({
            day: GAME.day,

            strategy: key
        });

        CAMPAIGN.history.push({
            day: GAME.day,

            strategy: key
        });

        syncPlayerVoteIntent();

        saveGame();

        renderEverything();
    }

    /* =====================================================
       ATUALIZAÇÃO DIÁRIA
       ===================================================== */

    function campaignDailyUpdate() {

        const key =
            GAME.campaign.strategy;

        const strategy =
            key
                ? CAMPAIGN_STRATEGIES[key]
                : null;

        if (strategy) {

            GAME.popularity +=
                strategy.popularity * 0.1;

            GAME.followers +=
                Math.round(
                    strategy.followers * 0.08
                );
        }

        GAME.energy =
            Math.min(
                GAME.maxEnergy,
                GAME.energy
            );

        syncPlayerVoteIntent();
    }

    /* =====================================================
       VISITAR CIDADE
       ===================================================== */

    function campaignCityVisit(cityValue) {

        const city =
            CITIES.find(
                c =>
                    c.city === cityValue ||
                    c.id === cityValue
            );

        if (!city) {
            return;
        }

        if (
            GAME.energy < 6
        ) {
            showToast(
                "⚡",
                "Energia insuficiente."
            );

            return;
        }

        GAME.campaign.visitedCities.push(
            city.id
        );

        if (
            !GAME.campaign.visitedStates.includes(
                city.uf
            )
        ) {
            GAME.campaign.visitedStates.push(
                city.uf
            );
        }

        GAME.popularity += 2;

        GAME.reputation += 1;

        GAME.energy -= 6;

        addNews(
            `Agenda fictícia em ${city.city}, ${city.uf}.`
        );

        syncPlayerVoteIntent();

        saveGame();

        renderEverything();
    }

    /* =====================================================
       VISITAR ESTADO
       ===================================================== */

    function visitState(uf) {

        const state =
            STATES.find(
                s => s.uf === uf
            );

        if (!state) {
            return;
        }

        if (
            GAME.energy < 7
        ) {
            showToast(
                "⚡",
                "Energia insuficiente."
            );

            return;
        }

        if (
            !GAME.states[uf]
        ) {
            GAME.states[uf] = {
                uf,

                visited: false,

                support: 30
            };
        }

        GAME.states[uf].visited =
            true;

        if (
            !GAME.campaign.visitedStates.includes(
                uf
            )
        ) {
            GAME.campaign.visitedStates.push(
                uf
            );
        }

        GAME.popularity += 2;

        GAME.reputation += 1;

        GAME.energy -= 7;

        addNews(
            `A campanha realizou uma agenda fictícia em ${state.name}.`
        );

        syncPlayerVoteIntent();

        saveGame();

        renderEverything();
    }

    /* =====================================================
       INICIAR CAMPANHA
       ===================================================== */

    function startCampaign() {

        CAMPAIGN.active = true;

        GAME.phase = "Campanha";

        renderEverything();
    }

    /* =====================================================
       EXPORT
       ===================================================== */

    Object.assign(window, {

        CAMPAIGN,

        CAMPAIGN_STRATEGIES,

        chooseCampaignStrategy,

        campaignDailyUpdate,

        campaignCityVisit,

        visitState,

        startCampaign
    });

})();