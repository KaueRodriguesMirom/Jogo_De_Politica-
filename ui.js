/* =========================================================
   BRASIL POLÍTICO V3
   UI.JS — Interface completa
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       UTILITÁRIOS
    ===================================================== */

    function $(id) {
        return document.getElementById(id);
    }

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function money(value) {

        if (typeof window.formatMoney === "function") {
            return window.formatMoney(value);
        }

        return Number(value || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function number(value) {

        if (typeof window.formatNumber === "function") {
            return window.formatNumber(value);
        }

        return Number(value || 0).toLocaleString("pt-BR");
    }

    function clampValue(value, min, max) {

        value = Number(value) || 0;

        return Math.max(
            min,
            Math.min(max, value)
        );
    }

    function setText(id, value) {

        const element = $(id);

        if (element) {
            element.textContent = value ?? "";
        }
    }

    function setWidth(id, value) {

        const element = $(id);

        if (!element) {
            return;
        }

        element.style.width =
            `${clampValue(value, 0, 100)}%`;
    }

    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(first, second) {

        let message = "";
        let icon = "ℹ️";

        const validTypes = [
            "success",
            "info",
            "warning",
            "error"
        ];

        if (validTypes.includes(second)) {

            message = first;

            if (second === "success") {
                icon = "✅";
            } else if (second === "warning") {
                icon = "⚠️";
            } else if (second === "error") {
                icon = "❌";
            }

        } else {

            icon = first || "ℹ️";
            message = second || "";
        }

        const toast = $("toast");

        if (!toast) {

            console.log(
                `${icon} ${message}`
            );

            return;
        }

        const toastIcon =
            $("toastIcon");

        const toastMessage =
            $("toastMessage");

        if (toastIcon) {
            toastIcon.textContent = icon;
        }

        if (toastMessage) {
            toastMessage.textContent = message;
        }

        toast.classList.add("show");

        clearTimeout(
            window.__toastTimer
        );

        window.__toastTimer =
            setTimeout(function () {

                toast.classList.remove(
                    "show"
                );

            }, 3000);
    }

    /* =====================================================
       TELAS PRINCIPAIS
    ===================================================== */

    function hideAllScreens() {

        document
            .querySelectorAll(".screen")
            .forEach(function (screen) {

                screen.classList.remove(
                    "active"
                );

                screen.classList.add(
                    "hidden"
                );
            });
    }

    function showStart() {

        hideAllScreens();

        const start =
            $("startScreen");

        if (!start) {

            console.error(
                "startScreen não encontrado."
            );

            return;
        }

        start.classList.remove("hidden");
        start.classList.add("active");
    }

    function showSetup() {

        console.log(
            "Abrindo Nova Carreira..."
        );

        hideAllScreens();

        const setup =
            $("setupScreen");

        if (!setup) {

            console.error(
                "setupScreen não encontrado."
            );

            showToast(
                "❌",
                "Erro: tela de criação não encontrada."
            );

            return;
        }

        setup.classList.remove("hidden");
        setup.classList.add("active");

        populateSetup();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        console.log(
            "Tela de Nova Carreira aberta."
        );
    }

    function showGame() {

        hideAllScreens();

        const game =
            $("gameScreen");

        if (!game) {

            console.error(
                "gameScreen não encontrado."
            );

            return;
        }

        game.classList.remove("hidden");
        game.classList.add("active");

        renderEverything();
    }

    /* =====================================================
       CONFIGURAÇÃO DO PERSONAGEM
    ===================================================== */

    let selectedParty = null;
    let selectedIdeology = "Centro";
    let selectedCareer = "deputado-federal";

    function populateSetup() {

        const partyGrid =
            $("partyGrid");

        if (!partyGrid) {
            return;
        }

        const parties =
            window.PARTIES ||
            window.POLITICAL_DATA?.PARTIES ||
            [];

        partyGrid.innerHTML = "";

        if (!parties.length) {

            partyGrid.innerHTML = `
                <div class="empty-state">
                    <span>⚠️</span>
                    <h3>Partidos não carregados</h3>
                    <p>
                        Verifique o carregamento do data.js.
                    </p>
                </div>
            `;

        } else {

            parties.forEach(function (party) {

                const button =
                    document.createElement("button");

                button.type = "button";
                button.className = "party-card";
                button.dataset.party = party.id;

                button.innerHTML = `

                    <strong>
                        ${escapeHTML(
                            party.acronym ||
                            party.sigla ||
                            party.id
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            party.name ||
                            party.nome ||
                            ""
                        )}
                    </span>

                    ${
                        party.number
                            ? `
                                <small>
                                    Nº ${escapeHTML(
                                        party.number
                                    )}
                                </small>
                            `
                            : ""
                    }

                `;

                button.addEventListener(
                    "click",
                    function () {

                        selectParty(
                            party.id,
                            button
                        );
                    }
                );

                partyGrid.appendChild(button);
            });
        }

        const state =
            $("playerState");

        if (state && !state.value) {
            state.value = "SP";
        }

        selectedIdeology = "Centro";
        selectedCareer = "deputado-federal";
        selectedParty = null;

        document
            .querySelectorAll(".ideology-card")
            .forEach(function (card) {

                card.classList.remove(
                    "selected",
                    "active"
                );

                const text =
                    card.textContent
                        .toLowerCase();

                if (
                    text.includes("centro") &&
                    !text.includes("esquerda") &&
                    !text.includes("direita")
                ) {

                    card.classList.add(
                        "selected"
                    );
                }
            });

        document
            .querySelectorAll(".career-card")
            .forEach(function (card) {

                card.classList.remove(
                    "selected",
                    "active"
                );
            });

        const firstCareer =
            document.querySelector(
                '.career-card[onclick*="deputado-federal"]'
            );

        if (firstCareer) {
            firstCareer.classList.add(
                "selected"
            );
        }

        updateCities();
    }

    function selectParty(
        party,
        element
    ) {

        selectedParty = party;

        document
            .querySelectorAll(
                "#partyGrid .party-card"
            )
            .forEach(function (card) {

                card.classList.remove(
                    "selected",
                    "active"
                );
            });

        if (element) {

            element.classList.add(
                "selected"
            );

            element.classList.add(
                "active"
            );
        }
    }

    function selectIdeology(
        element,
        ideology
    ) {

        selectedIdeology = ideology;

        document
            .querySelectorAll(
                ".ideology-card"
            )
            .forEach(function (card) {

                card.classList.remove(
                    "selected",
                    "active"
                );
            });

        if (element) {

            element.classList.add(
                "selected"
            );

            element.classList.add(
                "active"
            );
        }
    }

    function selectCareer(
        element,
        career
    ) {

        selectedCareer = career;

        document
            .querySelectorAll(
                ".career-card"
            )
            .forEach(function (card) {

                card.classList.remove(
                    "selected",
                    "active"
                );
            });

        if (element) {

            element.classList.add(
                "selected"
            );

            element.classList.add(
                "active"
            );
        }
    }

    function updateCities() {

        const city =
            $("playerCity");

        if (!city) {
            return;
        }

        if (!city.value.trim()) {

            const state =
                $("playerState");

            if (
                state &&
                state.value === "SP"
            ) {

                city.value =
                    "São Paulo";
            }
        }
    }

    /* =====================================================
       CRIAR PERSONAGEM
    ===================================================== */

    async function createCharacter() {

        const name =
            $("playerName")?.value.trim() ||
            "";

        const age =
            Number(
                $("playerAge")?.value || 0
            );

        const state =
            $("playerState")?.value ||
            "";

        const city =
            $("playerCity")?.value.trim() ||
            "";

        if (!name) {

            showToast(
                "⚠️",
                "Digite o nome do personagem."
            );

            $("playerName")?.focus();

            return;
        }

        if (
            !Number.isFinite(age) ||
            age < 18 ||
            age > 90
        ) {

            showToast(
                "⚠️",
                "A idade deve estar entre 18 e 90 anos."
            );

            $("playerAge")?.focus();

            return;
        }

        if (!state) {

            showToast(
                "⚠️",
                "Selecione um estado."
            );

            return;
        }

        if (!city) {

            showToast(
                "⚠️",
                "Digite a cidade."
            );

            $("playerCity")?.focus();

            return;
        }

        if (!selectedParty) {

            const parties =
                window.PARTIES ||
                window.POLITICAL_DATA?.PARTIES ||
                [];

            if (parties.length) {
                selectedParty =
                    parties[0].id;
            }
        }

        const config = {

            name,
            age,
            state,
            city,

            party:
                selectedParty,

            ideology:
                selectedIdeology || "Centro",

            career:
                selectedCareer || "deputado-federal"
        };

        console.log(
            "Configuração da nova carreira:",
            config
        );

        if (
            typeof window.initializeGame !==
            "function"
        ) {

            console.error(
                "initializeGame não foi encontrado."
            );

            showToast(
                "❌",
                "Erro: game.js não foi carregado."
            );

            return;
        }

        try {

        await window.initializeGame(
            config
        );

        showGame();

        showToast(
            "🎉",
            "Nova carreira iniciada!"
        );

        } catch (error) {

            console.error(
                "Erro ao iniciar carreira:",
                error
            );

            showToast(
                "❌",
                "Erro ao iniciar a carreira. Veja o Console."
            );
        }
    }

    /* =====================================================
       NAVEGAÇÃO
    ===================================================== */

    function showView(page) {

        const pages =
            document.querySelectorAll(
                "#gameScreen .page"
            );

        pages.forEach(
            function (view) {

                view.classList.remove(
                    "active-page"
                );

                view.classList.add(
                    "hidden"
                );
            }
        );

        const target =
            $(`${page}Page`);

        if (!target) {

            console.error(
                "Página não encontrada:",
                page
            );

            return;
        }

        target.classList.remove(
            "hidden"
        );

        target.classList.add(
            "active-page"
        );

        document
            .querySelectorAll(
                ".nav-item[data-page]"
            )
            .forEach(function (item) {

                item.classList.remove(
                    "active"
                );

                if (
                    item.dataset.page === page
                ) {

                    item.classList.add(
                        "active"
                    );
                }
            });

        const sidebar =
            $("sidebar");

        if (
            sidebar &&
            window.innerWidth <= 950
        ) {

            sidebar.classList.remove(
                "open"
            );

            sidebar.classList.remove(
                "active"
            );
        }

        renderEverything();
    }

    function navigateTo(page) {

        if (!page) {
            return;
        }

        const game =
            $("gameScreen");

        if (game) {

            game.classList.remove(
                "hidden"
            );

            game.classList.add(
                "active"
            );
        }

        showView(page);
    }

    /* =====================================================
       AÇÕES
    ===================================================== */

    function action(type) {

        if (
            typeof window.performAction !==
            "function"
        ) {

            showToast(
                "❌",
                "Motor de ações não carregado."
            );

            return;
        }

        window.performAction(type);
    }

    /* =====================================================
       SIDEBAR
    ===================================================== */

    function toggleSidebar() {

        const sidebar =
            $("sidebar");

        if (!sidebar) {
            return;
        }

        sidebar.classList.toggle(
            "open"
        );
    }

    /* =====================================================
       AVANÇO AUTOMÁTICO
    ===================================================== */

    function toggleAutoDay() {

        if (window.__autoDayTimer) {

            clearInterval(
                window.__autoDayTimer
            );

            window.__autoDayTimer = null;

            showToast(
                "⏸️",
                "Avanço automático desativado."
            );

            return;
        }

        window.__autoDayTimer =
            setInterval(
                function () {

                    if (
                        window.GAME &&
                        window.GAME.started &&
                        typeof window.nextDay ===
                        "function"
                    ) {

                        window.nextDay();
                    }

                },
                5000
            );

        showToast(
            "▶️",
            "Avanço automático ativado."
        );
    }

    /* =====================================================
       MAPA
    ===================================================== */

    function renderMap() {

        const map =
            $("brazilMap");

        if (!map) {
            return;
        }

        const states =
            window.STATES ||
            window.POLITICAL_DATA?.STATES ||
            [];

        if (!states.length) {

            map.innerHTML = `
                <div class="empty-state">
                    <span>⚠️</span>
                    <h3>Estados não carregados</h3>
                </div>
            `;

            return;
        }

        map.innerHTML =
            states.map(
                function (state) {

                    const data =
                        window.GAME
                            ?.states
                            ?.[state.uf];

                    const support =
                        Math.round(
                            data?.support || 0
                        );

                    const visited =
                        Boolean(
                            data?.visited
                        );

                    return `

                        <button
                            type="button"
                            class="state-button ${
                                visited
                                    ? "visited"
                                    : ""
                            }"
                            onclick="visitState('${escapeHTML(
                                state.uf
                            )}')"
                        >

                            <strong>
                                ${escapeHTML(
                                    state.uf
                                )}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    state.name
                                )}
                            </small>

                            <span class="state-percentage">
                                ${support}%
                            </span>

                        </button>
                    `;
                }
            ).join("");
    }

    function visitState(uf) {

        const game =
            window.GAME;

        if (!game) {
            return;
        }

        if (
            typeof window.campaignVisitState ===
            "function"
        ) {

            window.campaignVisitState(
                uf
            );

            return;
        }

        const state =
            game.states?.[uf];

        const stateInfo =
            (
                window.STATES ||
                []
            ).find(
                function (item) {
                    return item.uf === uf;
                }
            );

        if (
            !state ||
            !stateInfo
        ) {
            return;
        }

        state.visited = true;

        game.campaign.visitedStates =
            game.campaign.visitedStates ||
            [];

        if (
            !game.campaign.visitedStates
                .includes(uf)
        ) {

            game.campaign.visitedStates
                .push(uf);
        }

        renderStateDetails(
            stateInfo,
            state
        );

        if (
            typeof window.saveGame ===
            "function"
        ) {

            window.saveGame();
        }

        renderMap();
    }

    function renderStateDetails(
        stateInfo,
        stateData
    ) {

        const details =
            $("stateDetails");

        if (!details) {
            return;
        }

        details.innerHTML = `

            <div class="state-detail-card">

                <div class="eyebrow">
                    ESTADO
                </div>

                <h3>
                    ${escapeHTML(
                        stateInfo.name
                    )}
                    (${escapeHTML(
                        stateInfo.uf
                    )})
                </h3>

                <p>
                    Capital:
                    <strong>
                        ${escapeHTML(
                            stateInfo.capital
                        )}
                    </strong>
                </p>

                <p>
                    Região:
                    <strong>
                        ${escapeHTML(
                            stateInfo.region
                        )}
                    </strong>
                </p>

                <p>
                    Apoio:
                    <strong>
                        ${Math.round(
                            stateData.support || 0
                        )}%
                    </strong>
                </p>

                <p>
                    Status:
                    <strong>
                        ${
                            stateData.visited
                                ? "Visitado"
                                : "Não visitado"
                        }
                    </strong>
                </p>

            </div>
        `;
    }

    /* =====================================================
       DASHBOARD
    ===================================================== */

    function renderDashboard() {

        const game =
            window.GAME;

        if (!game) {
            return;
        }

        const player =
            game.player || {};

        const popularity =
            clampValue(
                game.popularity,
                0,
                100
            );

        const reputation =
            clampValue(
                game.reputation,
                0,
                100
            );

        const votes =
            clampValue(
                game.voteIntent,
                0,
                100
            );

        setText(
            "welcomeName",
            player.name ||
            "Candidato"
        );

        setText(
            "sidebarName",
            player.name ||
            "Candidato"
        );

        const party =
            getParty(
                player.party
            );

        setText(
            "sidebarParty",
            party
                ? (
                    party.acronym ||
                    party.sigla ||
                    party.id
                )
                : (
                    player.party ||
                    "Sem partido"
                )
        );

        setText(
            "popularity",
            `${Math.round(
                popularity
            )}%`
        );

        setWidth(
            "popularityBar",
            popularity
        );

        setText(
            "reputation",
            `${Math.round(
                reputation
            )}%`
        );

        setWidth(
            "reputationBar",
            reputation
        );

        setText(
            "votes",
            `${votes.toFixed(1)}%`
        );

        setWidth(
            "votesBar",
            votes
        );

        setText(
            "followers",
            number(game.followers)
        );

        setText(
            "followersGrowth",
            `+${number(
                Math.max(
                    0,
                    Math.round(
                        game.followers * 0.01
                    )
                )
            )}`
        );

        setText(
            "agendaEnergy",
            `${Math.round(
                game.energy
            )}/${Math.round(
                game.maxEnergy
            )}`
        );

        setText(
            "moneyDisplay",
            money(game.money)
        );

        setText(
            "energyDisplay",
            Math.round(game.energy)
        );

        setText(
            "dateDisplay",
            game.date
        );

        setText(
            "phaseDisplay",
            game.phase
        );

        setText(
            "pollDay",
            `Dia ${game.day}`
        );

        renderNewsFeed(
            $("newsFeed"),
            game.news
        );

        renderPollChart(
            $("pollChart"),
            game.polls
        );

        renderEvent();
    }

    /* =====================================================
       NOTÍCIAS
    ===================================================== */

    function renderNewsFeed(
        element,
        news
    ) {

        if (!element) {
            return;
        }

        if (
            !Array.isArray(news) ||
            !news.length
        ) {

            element.innerHTML =
                "<p>Nenhuma notícia ainda.</p>";

            return;
        }

        element.innerHTML =
            news
                .slice(0, 10)
                .map(
                    function (item) {

                        return `

                            <article class="news-item">

                                <small>
                                    ${escapeHTML(
                                        item.date || ""
                                    )}
                                </small>

                                <strong>
                                    ${escapeHTML(
                                        item.title || ""
                                    )}
                                </strong>

                            </article>
                        `;
                    }
                )
                .join("");
    }

    function renderNews() {

        const game =
            window.GAME;

        if (!game) {
            return;
        }

        renderNewsFeed(
            $("newsFeed"),
            game.news
        );

        renderNewsFeed(
            $("fullNewsFeed"),
            game.news
        );
    }

    /* =====================================================
       PESQUISAS
    ===================================================== */

    function renderPollChart(
        element,
        polls
    ) {

        if (!element) {
            return;
        }

        if (
            !Array.isArray(polls) ||
            !polls.length
        ) {

            element.innerHTML =
                "<p>Sem pesquisas disponíveis.</p>";

            return;
        }

        const latest =
            polls[0];

        element.innerHTML = `

            <div class="poll-summary">

                <div>
                    <small>
                        Intenção de voto
                    </small>

                    <strong>
                        ${Number(
                            latest.candidate || 0
                        ).toFixed(1)}%
                    </strong>
                </div>

                <div>
                    <small>
                        Indecisos
                    </small>

                    <strong>
                        ${Number(
                            latest.undecided || 0
                        ).toFixed(1)}%
                    </strong>
                </div>

                <div>
                    <small>
                        Outros
                    </small>

                    <strong>
                        ${Number(
                            latest.other || 0
                        ).toFixed(1)}%
                    </strong>
                </div>

            </div>
        `;
    }

    function renderPolls() {

        const game =
            window.GAME;

        if (!game) {
            return;
        }

        renderPollChart(
            $("largePollChart"),
            game.polls
        );

        const list =
            $("statePollList");

        if (!list) {
            return;
        }

        const states =
            window.STATES ||
            window.POLITICAL_DATA?.STATES ||
            [];

        list.innerHTML =
            states.map(
                function (state) {

                    const data =
                        game.states?.[
                            state.uf
                        ];

                    const support =
                        Math.round(
                            data?.support || 0
                        );

                    return `

                        <div class="state-poll-row">

                            <span>
                                ${escapeHTML(
                                    state.uf
                                )}
                                -
                                ${escapeHTML(
                                    state.name
                                )}
                            </span>

                            <strong>
                                ${support}%
                            </strong>

                        </div>
                    `;
                }
            ).join("");
    }

    /* =====================================================
       EVENTOS
    ===================================================== */

    function renderEvent() {

        const game =
            window.GAME;

        const panel =
            $("eventPanel");

        const content =
            $("eventContent");

        if (
            !panel ||
            !content
        ) {
            return;
        }

        if (!game?.event) {

            panel.classList.add(
                "hidden"
            );

            content.innerHTML = "";

            return;
        }

        const event =
            game.event;

        panel.classList.remove(
            "hidden"
        );

        content.innerHTML = `

            <div class="event-card">

                <h3>
                    ${escapeHTML(
                        event.title ||
                        event.name ||
                        "Evento"
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        event.description || ""
                    )}
                </p>

                <div class="event-options">

                    ${
                        (event.options || [])
                            .map(
                                function (
                                    option,
                                    index
                                ) {

                                    return `

                                        <button
                                            type="button"
                                            class="btn btn-primary"
                                            onclick="chooseEvent('${escapeHTML(
                                                event.id
                                            )}', ${index})"
                                        >
                                            ${escapeHTML(
                                                option.text ||
                                                option.label ||
                                                `Opção ${
                                                    index + 1
                                                }`
                                            )}
                                        </button>
                                    `;
                                }
                            )
                            .join("")
                    }

                </div>

            </div>
        `;
    }

    /* =====================================================
       CAMPANHA
    ===================================================== */

    function renderCampaign() {

        const game =
            window.GAME;

        if (!game) {
            return;
        }

        setText(
            "campaignMoney",
            money(game.money)
        );

        setText(
            "campaignStaff",
            number(
                game.campaign?.staff || 0
            )
        );

        setText(
            "campaignVolunteers",
            number(
                game.campaign?.volunteers || 0
            )
        );

        setText(
            "campaignReach",
            number(game.followers)
        );

        const agenda =
            $("campaignAgenda");

        if (!agenda) {
            return;
        }

        const items =
            game.campaign?.agenda || [];

        if (!items.length) {

            agenda.innerHTML =
                "<p>Nenhum compromisso agendado.</p>";

            return;
        }

        agenda.innerHTML =
            items
                .map(
                    function (item) {

                        return `

                            <div class="agenda-item">

                                ${escapeHTML(
                                    typeof item === "string"
                                        ? item
                                        : item.title ||
                                          "Compromisso"
                                )}

                            </div>
                        `;
                    }
                )
                .join("");
    }

    /* =====================================================
       PARTIDO
    ===================================================== */

    function getParty(id) {

        const parties =
            window.PARTIES ||
            window.POLITICAL_DATA?.PARTIES ||
            [];

        return parties.find(
            function (party) {

                return (
                    party.id === id ||
                    party.acronym === id ||
                    party.sigla === id
                );
            }
        );
    }

    function renderParty() {

        const game =
            window.GAME;

        if (!game) {
            return;
        }

        const party =
            getParty(
                game.player?.party
            );

        if (!party) {
            return;
        }

        setText(
            "partyPageSigla",
            party.acronym ||
            party.sigla ||
            party.id
        );

        setText(
            "partyPageName",
            party.name ||
            party.nome ||
            ""
        );

        const support =
            clampValue(
                game.party?.support,
                0,
                100
            );

        setText(
            "partySupport",
            `${Math.round(
                support
            )}%`
        );

        setWidth(
            "partySupportBar",
            support
        );
    }

    /* =====================================================
       ORÇAMENTO
    ===================================================== */

    function renderBudget() {

        const game =
            window.GAME;

        if (!game) {
            return;
        }

        setText(
            "budgetBalance",
            money(game.money)
        );

        const bars =
            $("budgetBars");

        if (!bars) {
            return;
        }

        const expenses =
            game.budget?.expensesByType || {};

        const entries = [

            [
                "Campanha",
                expenses.campaign || 0
            ],

            [
                "Equipe",
                expenses.staff || 0
            ],

            [
                "Viagens",
                expenses.travel || 0
            ],

            [
                "Outros",
                expenses.other || 0
            ]
        ];

        const maximum =
            Math.max(
                1,
                ...entries.map(
                    function (item) {
                        return Number(item[1]);
                    }
                )
            );

        bars.innerHTML =
            entries
                .map(
                    function (item) {

                        const percent =
                            (
                                Number(item[1]) /
                                maximum
                            ) * 100;

                        return `

                            <div class="budget-row">

                                <div>
                                    <span>
                                        ${escapeHTML(
                                            item[0]
                                        )}
                                    </span>

                                    <strong>
                                        ${money(
                                            item[1]
                                        )}
                                    </strong>
                                </div>

                                <div class="budget-bar">

                                    <span
                                        style="width:${percent}%"
                                    ></span>

                                </div>

                            </div>
                        `;
                    }
                )
                .join("");
    }

    /* =====================================================
       PARLAMENTO
    ===================================================== */

    function renderParliament() {

        if (
            typeof window.renderParliamentUI ===
            "function"
        ) {

            try {

                window.renderParliamentUI();

            } catch (error) {

                console.error(
                    "Erro no Parlamento:",
                    error
                );
            }
        }

        const game =
            window.GAME;

        if (!game) {
            return;
        }

        const bill =
            game.parliament
                ?.currentBill;

        const currentBill =
            $("currentBill");

        if (
            currentBill &&
            bill
        ) {

            currentBill.innerHTML = `

                <div class="bill-number">
                    ${escapeHTML(
                        bill.number ||
                        "PROJETO DE LEI"
                    )}
                </div>

                <h3>
                    ${escapeHTML(
                        bill.title ||
                        bill.name ||
                        "Projeto de Lei"
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        bill.description || ""
                    )}
                </p>
            `;
        }

        const chamber =
            $("chamberPlenary");

        if (
            chamber &&
            !chamber.innerHTML.trim()
        ) {

            chamber.innerHTML = `

                <div class="parliament-placeholder">

                    <h3>
                        Câmara dos Deputados
                    </h3>

                    <p>
                        Plenário aguardando votação.
                    </p>

                </div>
            `;
        }

        const senate =
            $("senatePlenary");

        if (
            senate &&
            !senate.innerHTML.trim()
        ) {

            senate.innerHTML = `

                <div class="parliament-placeholder">

                    <h3>
                        Senado Federal
                    </h3>

                    <p>
                        Plenário aguardando votação.
                    </p>

                </div>
            `;
        }
    }

    function openParliamentTab(tab) {

        const chamber =
            $("chamberTab");

        const senate =
            $("senateTab");

        const tabs =
            document.querySelectorAll(
                ".parliament-tab"
            );

        tabs.forEach(
            function (button) {

                button.classList.remove(
                    "active"
                );
            }
        );

        if (tab === "senate") {

            chamber?.classList.add("hidden");
            senate?.classList.remove("hidden");

            if (tabs[1]) {
                tabs[1].classList.add("active");
            }

        } else {

            senate?.classList.add("hidden");
            chamber?.classList.remove("hidden");

            if (tabs[0]) {
                tabs[0].classList.add("active");
            }
        }

        if (
            typeof window.switchParliamentTab ===
            "function"
        ) {

            try {

                window.switchParliamentTab(tab);

            } catch (error) {

                console.error(
                    error
                );
            }
        }
    }

    /* =====================================================
       DEBATES
    ===================================================== */

    function renderDebates() {

        const arena =
            $("debateArena");

        if (!arena) {

            console.error(
                "Elemento #debateArena não encontrado."
            );

            return;
        }

        if (
            typeof window.renderDebate !==
            "function"
        ) {

            console.error(
                "renderDebate() não foi encontrado."
            );

            arena.innerHTML = `
                <div class="empty-state">
                    <span>⚠️</span>
                    <h3>Sistema de debates não carregado</h3>
                    <p>Verifique o carregamento do debate.js.</p>
                </div>
            `;

            return;
        }

        try {

            window.renderDebate();

        } catch (error) {

            console.error(
                "Erro ao renderizar debates:",
                error
            );

            arena.innerHTML = `
                <div class="empty-state">
                    <span>❌</span>
                    <h3>Erro no sistema de debates</h3>
                    <p>Abra o Console (F12) para ver o erro.</p>
                </div>
            `;
        }
    }

    function openDebates() {

    console.log("Abrindo Debates...");

    const game =
        window.GAME;

    if (
        !game ||
        !game.started
    ) {

        showToast(
            "⚠️",
            "Inicie uma carreira antes de participar de um debate."
        );

        return;
    }

    /*
     * Apenas abre a página.
     * Não inicia debate automaticamente.
     */

    navigateTo("debates");

    if (
        typeof window.renderDebate ===
        "function"
    ) {

        window.renderDebate();
    }
}

    /* =====================================================
       SALVAR
    ===================================================== */

    async function saveGameUI() {

    if (
        typeof window.saveGame !==
        "function"
    ) {

        showToast(
            "❌",
            "Sistema de salvamento não carregado."
        );

        return false;
    }

    try {

        const result =
            await window.saveGame();

        if (result) {

            showToast(
                "✅",
                "Jogo salvo no arquivo JSON!"
            );

        } else {

            showToast(
                "❌",
                "Não foi possível salvar o jogo."
            );
        }

        return result;

    } catch (error) {

        console.error(
            "Erro ao salvar jogo:",
            error
        );

        showToast(
            "❌",
            "Erro ao salvar o jogo."
        );

        return false;
    }
}

    /* =====================================================
       MODAIS
    ===================================================== */

    function showModal(
        title,
        content
    ) {

        const modal =
            $("modal");

        if (!modal) {
            return;
        }

        const contentElement =
            $("modalContent");

        if (contentElement) {

            if (title) {

                contentElement.innerHTML = `

                    <div class="eyebrow">
                        ${escapeHTML(title)}
                    </div>

                    <div style="margin-top:15px;">
                        ${content || ""}
                    </div>
                `;

            } else {

                contentElement.innerHTML =
                    content || "";
            }
        }

        modal.classList.remove(
            "hidden"
        );
    }

    function closeModal() {

        const modal =
            $("modal");

        if (modal) {
            modal.classList.add("hidden");
        }
    }

    function closeConfirmation() {

        const modal =
            $("confirmationModal");

        if (modal) {
            modal.classList.add("hidden");
        }
    }

    function confirmAction(
        callback,
        message
    ) {

        const modal =
            $("confirmationModal");

        const content =
            $("confirmationContent");

        if (!modal) {

            if (
                typeof callback ===
                "function"
            ) {
                callback();
            }

            return;
        }

        if (content) {

            content.innerHTML = `

                <h3>
                    Confirmação
                </h3>

                <p>
                    ${escapeHTML(
                        message ||
                        "Tem certeza que deseja continuar?"
                    )}
                </p>

                <div style="
                    display:flex;
                    gap:10px;
                    margin-top:20px;
                ">

                    <button
                        type="button"
                        class="btn btn-primary"
                        id="confirmButton"
                    >
                        Confirmar
                    </button>

                    <button
                        type="button"
                        class="btn btn-secondary"
                        onclick="closeConfirmation()"
                    >
                        Cancelar
                    </button>

                </div>
            `;
        }

        modal.classList.remove(
            "hidden"
        );

        const confirmButton =
            $("confirmButton");

        if (confirmButton) {

            confirmButton.onclick =
                function () {

                    closeConfirmation();

                    if (
                        typeof callback ===
                        "function"
                    ) {

                        callback();
                    }
                };
        }
    }

    /* =====================================================
       RENDER GERAL
    ===================================================== */

    function renderEverything() {

        const functions = [

            [
                "renderDashboard",
                renderDashboard
            ],

            [
                "renderMap",
                renderMap
            ],

            [
                "renderCampaign",
                renderCampaign
            ],

            [
                "renderPolls",
                renderPolls
            ],

            [
                "renderDebates",
                renderDebates
            ],

            [
                "renderNews",
                renderNews
            ],

            [
                "renderParty",
                renderParty
            ],

            [
                "renderBudget",
                renderBudget
            ],

            [
                "renderParliament",
                renderParliament
            ]
        ];

        functions.forEach(
            function (item) {

                try {

                    item[1]();

                } catch (error) {

                    console.error(
                        item[0] + ":",
                        error
                    );
                }
            }
        );
    }

    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    function initializeUI() {

        console.log(
            "Brasil Político V3 — UI carregada."
        );

        const start =
            $("startScreen");

        const setup =
            $("setupScreen");

        const game =
            $("gameScreen");

        if (start) {

            start.classList.add(
                "active"
            );

            start.classList.remove(
                "hidden"
            );
        }

        if (setup) {

            setup.classList.remove(
                "active"
            );

            setup.classList.add(
                "hidden"
            );
        }

        if (game) {

            game.classList.remove(
                "active"
            );

            game.classList.add(
                "hidden"
            );
        }

        updateCities();

        const state =
            $("playerState");

        if (state) {

            state.addEventListener(
                "change",
                updateCities
            );
        }
    }

    /* =====================================================
       EXPORTAÇÃO GLOBAL
    ===================================================== */

    Object.assign(
        window,
        {

            showStart,
            showSetup,
            showGame,
            showView,

            populateSetup,
            createCharacter,

            selectParty,
            selectIdeology,
            selectCareer,

            updateCities,

            navigateTo,

            action,

            toggleSidebar,
            toggleAutoDay,

            renderMap,
            visitState,

            renderEverything,
            renderDashboard,
            renderCampaign,
            renderPolls,

            renderDebates,
            openDebates,

            renderNews,
            renderParty,
            renderBudget,
            renderParliament,

            openParliamentTab,

            saveGameUI,

            showToast,

            showModal,
            closeModal,
            closeConfirmation,
            confirmAction,

            escapeHTML
        }
    );

    /* =====================================================
       DOM READY
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeUI
        );

    } else {

        initializeUI();
    }

})();