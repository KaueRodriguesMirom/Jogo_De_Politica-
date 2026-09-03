/* =========================================================
   BRASIL POLÍTICO V3
   DATA.JS — Dados, listas e geradores
   ========================================================= */

(function () {
    "use strict";

    /* Evita execução duplicada */
    if (window.POLITICAL_DATA && window.POLITICAL_DATA.__v3DataLoaded) {
        return;
    }

    /* =====================================================
       UTILITÁRIOS
       ===================================================== */

    function randomFrom(array) {
        if (!Array.isArray(array) || array.length === 0) {
            return null;
        }

        return array[Math.floor(Math.random() * array.length)];
    }

    function clamp(value, min = 0, max = 100) {
        return Math.max(min, Math.min(max, Number(value) || 0));
    }

    function chance(percent) {
        return Math.random() * 100 < percent;
    }

    function generateId(prefix = "id") {
        return (
            prefix +
            "_" +
            Date.now().toString(36) +
            "_" +
            Math.random().toString(36).substring(2, 8)
        );
    }

    function formatMoney(value) {
        value = Number(value) || 0;

        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function formatNumber(value) {
        return Number(value || 0).toLocaleString("pt-BR");
    }

    /* =====================================================
       NOMES FICTÍCIOS
       ===================================================== */

    const FICTIONAL_FIRST_NAMES = [
        "Adriana", "Aline", "Amanda", "André", "Antônio",
        "Beatriz", "Bruno", "Caio", "Camila", "Carlos",
        "Carolina", "Cecília", "Clara", "Daniel", "Daniela",
        "Diego", "Eduardo", "Elisa", "Felipe", "Fernanda",
        "Flávia", "Gabriel", "Gustavo", "Helena", "Henrique",
        "Isabela", "João", "Júlia", "Juliana", "Laura",
        "Leonardo", "Letícia", "Lucas", "Luana", "Marcelo",
        "Marcos", "Mariana", "Marina", "Mateus", "Maurício",
        "Natália", "Nicolas", "Otávio", "Patrícia", "Paulo",
        "Pedro", "Rafael", "Raquel", "Renato", "Ricardo",
        "Roberta", "Rodrigo", "Samuel", "Sérgio", "Sofia",
        "Tatiana", "Thiago", "Valentina", "Vinícius", "Victor",
        "Vitória", "Wesley"
    ];

    const FICTIONAL_LAST_NAMES = [
        "Albuquerque", "Almeida", "Andrade", "Barbosa",
        "Barros", "Campos", "Cardoso", "Carvalho", "Castro",
        "Costa", "Duarte", "Farias", "Fernandes", "Ferreira",
        "Freitas", "Gomes", "Gonçalves", "Lacerda", "Leite",
        "Lima", "Lopes", "Machado", "Macedo", "Mendes",
        "Monteiro", "Moraes", "Moreira", "Nascimento",
        "Nogueira", "Oliveira", "Pacheco", "Pereira",
        "Pires", "Ramos", "Reis", "Ribeiro", "Rocha",
        "Rodrigues", "Sampaio", "Santos", "Silva", "Soares",
        "Souza", "Tavares", "Teixeira", "Torres",
        "Vasconcelos", "Vieira"
    ];

    function generatePersonName() {
        return (
            randomFrom(FICTIONAL_FIRST_NAMES) +
            " " +
            randomFrom(FICTIONAL_LAST_NAMES)
        );
    }

    /* =====================================================
       ESTADOS
       ===================================================== */

    const STATES = [
        { uf: "AC", name: "Acre", capital: "Rio Branco", region: "Norte", gameWeight: 1 },
        { uf: "AL", name: "Alagoas", capital: "Maceió", region: "Nordeste", gameWeight: 2 },
        { uf: "AP", name: "Amapá", capital: "Macapá", region: "Norte", gameWeight: 1 },
        { uf: "AM", name: "Amazonas", capital: "Manaus", region: "Norte", gameWeight: 3 },
        { uf: "BA", name: "Bahia", capital: "Salvador", region: "Nordeste", gameWeight: 7 },
        { uf: "CE", name: "Ceará", capital: "Fortaleza", region: "Nordeste", gameWeight: 5 },
        { uf: "DF", name: "Distrito Federal", capital: "Brasília", region: "Centro-Oeste", gameWeight: 3 },
        { uf: "ES", name: "Espírito Santo", capital: "Vitória", region: "Sudeste", gameWeight: 3 },
        { uf: "GO", name: "Goiás", capital: "Goiânia", region: "Centro-Oeste", gameWeight: 4 },
        { uf: "MA", name: "Maranhão", capital: "São Luís", region: "Nordeste", gameWeight: 4 },
        { uf: "MT", name: "Mato Grosso", capital: "Cuiabá", region: "Centro-Oeste", gameWeight: 3 },
        { uf: "MS", name: "Mato Grosso do Sul", capital: "Campo Grande", region: "Centro-Oeste", gameWeight: 2 },
        { uf: "MG", name: "Minas Gerais", capital: "Belo Horizonte", region: "Sudeste", gameWeight: 9 },
        { uf: "PA", name: "Pará", capital: "Belém", region: "Norte", gameWeight: 5 },
        { uf: "PB", name: "Paraíba", capital: "João Pessoa", region: "Nordeste", gameWeight: 2 },
        { uf: "PR", name: "Paraná", capital: "Curitiba", region: "Sul", gameWeight: 6 },
        { uf: "PE", name: "Pernambuco", capital: "Recife", region: "Nordeste", gameWeight: 6 },
        { uf: "PI", name: "Piauí", capital: "Teresina", region: "Nordeste", gameWeight: 2 },
        { uf: "RJ", name: "Rio de Janeiro", capital: "Rio de Janeiro", region: "Sudeste", gameWeight: 8 },
        { uf: "RN", name: "Rio Grande do Norte", capital: "Natal", region: "Nordeste", gameWeight: 2 },
        { uf: "RS", name: "Rio Grande do Sul", capital: "Porto Alegre", region: "Sul", gameWeight: 6 },
        { uf: "RO", name: "Rondônia", capital: "Porto Velho", region: "Norte", gameWeight: 2 },
        { uf: "RR", name: "Roraima", capital: "Boa Vista", region: "Norte", gameWeight: 1 },
        { uf: "SC", name: "Santa Catarina", capital: "Florianópolis", region: "Sul", gameWeight: 5 },
        { uf: "SP", name: "São Paulo", capital: "São Paulo", region: "Sudeste", gameWeight: 12 },
        { uf: "SE", name: "Sergipe", capital: "Aracaju", region: "Nordeste", gameWeight: 1 },
        { uf: "TO", name: "Tocantins", capital: "Palmas", region: "Norte", gameWeight: 1 }
    ];

    /* =====================================================
       CIDADES
       ===================================================== */

    const CITY_RAW = {
        AC: [["Rio Branco", 5], ["Cruzeiro do Sul", 2], ["Sena Madureira", 1]],
        AL: [["Maceió", 7], ["Arapiraca", 3], ["Rio Largo", 1]],
        AP: [["Macapá", 6], ["Santana", 2], ["Laranjal do Jari", 1]],
        AM: [["Manaus", 9], ["Parintins", 2], ["Itacoatiara", 1]],
        BA: [["Salvador", 9], ["Feira de Santana", 5], ["Vitória da Conquista", 3], ["Camaçari", 2], ["Juazeiro", 2]],
        CE: [["Fortaleza", 9], ["Caucaia", 4], ["Juazeiro do Norte", 3], ["Maracanaú", 2], ["Sobral", 2]],
        DF: [["Brasília", 10], ["Taguatinga", 3], ["Ceilândia", 4]],
        ES: [["Vitória", 4], ["Vila Velha", 4], ["Serra", 4], ["Cariacica", 3], ["Linhares", 2]],
        GO: [["Goiânia", 7], ["Aparecida de Goiânia", 4], ["Anápolis", 3], ["Rio Verde", 2], ["Luziânia", 2]],
        MA: [["São Luís", 7], ["Imperatriz", 3], ["Timon", 2], ["Caxias", 1]],
        MT: [["Cuiabá", 5], ["Várzea Grande", 3], ["Rondonópolis", 3], ["Sinop", 2]],
        MS: [["Campo Grande", 7], ["Dourados", 3], ["Três Lagoas", 2], ["Corumbá", 1]],
        MG: [["Belo Horizonte", 9], ["Uberlândia", 5], ["Contagem", 4], ["Juiz de Fora", 3], ["Betim", 3], ["Montes Claros", 2], ["Uberaba", 2]],
        PA: [["Belém", 7], ["Ananindeua", 4], ["Santarém", 3], ["Marabá", 2], ["Parauapebas", 2]],
        PB: [["João Pessoa", 7], ["Campina Grande", 4], ["Santa Rita", 2], ["Patos", 1]],
        PR: [["Curitiba", 8], ["Londrina", 4], ["Maringá", 3], ["Ponta Grossa", 3], ["Cascavel", 2], ["São José dos Pinhais", 3]],
        PE: [["Recife", 8], ["Jaboatão dos Guararapes", 4], ["Olinda", 3], ["Caruaru", 3], ["Petrolina", 2]],
        PI: [["Teresina", 7], ["Parnaíba", 2], ["Picos", 1]],
        RJ: [["Rio de Janeiro", 10], ["São Gonçalo", 4], ["Duque de Caxias", 4], ["Nova Iguaçu", 4], ["Niterói", 3], ["Petrópolis", 2]],
        RN: [["Natal", 7], ["Mossoró", 3], ["Parnamirim", 2]],
        RS: [["Porto Alegre", 8], ["Caxias do Sul", 4], ["Canoas", 3], ["Pelotas", 2], ["Santa Maria", 2], ["Novo Hamburgo", 2]],
        RO: [["Porto Velho", 6], ["Ji-Paraná", 2], ["Ariquemes", 1]],
        RR: [["Boa Vista", 7], ["Rorainópolis", 1]],
        SC: [["Florianópolis", 5], ["Joinville", 5], ["Blumenau", 3], ["São José", 3], ["Chapecó", 2], ["Itajaí", 2]],
        SP: [["São Paulo", 12], ["Guarulhos", 5], ["Campinas", 4], ["São Bernardo do Campo", 4], ["Santo André", 3], ["Osasco", 3], ["São José dos Campos", 3], ["Ribeirão Preto", 2], ["Sorocaba", 3], ["Santos", 2], ["Mogi das Cruzes", 2], ["Piracicaba", 2]],
        SE: [["Aracaju", 7], ["Nossa Senhora do Socorro", 2], ["Lagarto", 1]],
        TO: [["Palmas", 6], ["Araguaína", 2], ["Gurupi", 1]]
    };

    const CITIES = [];

    Object.entries(CITY_RAW).forEach(([uf, cities]) => {
        const state = STATES.find(s => s.uf === uf);

        cities.forEach(([city, populationWeight]) => {
            CITIES.push({
                id:
                    uf +
                    "-" +
                    city
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/[^a-z0-9]+/g, "-"),
                city,
                name: city,
                state: state.name,
                uf,
                populationWeight,
                region: state.region
            });
        });
    });

    /* =====================================================
       PARTIDOS
       ===================================================== */

    const PARTIES = [
        ["MDB", "Movimento Democrático Brasileiro", 15, null],
        ["PDT", "Partido Democrático Trabalhista", 12, null],
        ["PT", "Partido dos Trabalhadores", 13, "Brasil da Esperança"],
        ["PCdoB", "Partido Comunista do Brasil", 65, "Brasil da Esperança"],
        ["PSB", "Partido Socialista Brasileiro", 40, null],
        ["PSDB", "Partido da Social Democracia Brasileira", 45, "PSDB Cidadania"],
        ["AGIR", "AGIR", 36, null],
        ["MOBILIZA", "Mobiliza", 33, null],
        ["CIDADANIA", "Cidadania", 23, "PSDB Cidadania"],
        ["PV", "Partido Verde", 43, "Brasil da Esperança"],
        ["AVANTE", "Avante", 70, null],
        ["PP", "Progressistas", 11, "União Progressista"],
        ["PSTU", "Partido Socialista dos Trabalhadores Unificado", 16, null],
        ["PCB", "Partido Comunista Brasileiro", 21, null],
        ["PRTB", "Partido Renovador Trabalhista Brasileiro", 28, null],
        ["DC", "Democracia Cristã", 27, null],
        ["PCO", "Partido da Causa Operária", 29, null],
        ["PODE", "Podemos", 20, null],
        ["REPUBLICANOS", "Republicanos", 10, null],
        ["PSOL", "Partido Socialismo e Liberdade", 50, "PSOL REDE"],
        ["PL", "Partido Liberal", 22, null],
        ["PSD", "Partido Social Democrático", 55, null],
        ["SOLIDARIEDADE", "Solidariedade", 77, "Renovação Solidária"],
        ["NOVO", "Partido Novo", 30, null],
        ["REDE", "Rede Sustentabilidade", 18, "PSOL REDE"],
        ["DEMOCRATA", "Democrata", 25, null],
        ["UP", "Unidade Popular", 80, null],
        ["UNIÃO", "União Brasil", 44, "União Progressista"],
        ["PRD", "Partido Renovação Democrática", 25, "Renovação Solidária"],
        ["MISSÃO", "Missão", 14, null]
    ].map(p => ({
        id: p[0],
        acronym: p[0],
        name: p[1],
        number: p[2],
        federation: p[3]
    }));

    const FEDERATIONS = {
        "uniao-progressista": {
            name: "União Progressista",
            parties: ["UNIÃO", "PP"]
        },

        "renovacao-solidaria": {
            name: "Renovação Solidária",
            parties: ["PRD", "SOLIDARIEDADE"]
        },

        "brasil-esperanca": {
            name: "Brasil da Esperança",
            parties: ["PT", "PCdoB", "PV"]
        },

        "psdb-cidadania": {
            name: "PSDB Cidadania",
            parties: ["PSDB", "CIDADANIA"]
        },

        "psol-rede": {
            name: "PSOL REDE",
            parties: ["PSOL", "REDE"]
        }
    };

    /* =====================================================
       TEMAS
       ===================================================== */

    const ISSUES = [
        { id: "economia", name: "Economia", description: "Contas públicas, crescimento e atividade econômica.", weight: 1.2 },
        { id: "saude", name: "Saúde", description: "Atendimento, hospitais e políticas de saúde.", weight: 1.2 },
        { id: "educacao", name: "Educação", description: "Escolas, ensino técnico, universidades e aprendizagem.", weight: 1.2 },
        { id: "seguranca", name: "Segurança", description: "Prevenção, integração e segurança pública.", weight: 1.1 },
        { id: "infraestrutura", name: "Infraestrutura", description: "Transportes, obras e serviços estruturais.", weight: 1 },
        { id: "meioAmbiente", name: "Meio ambiente", description: "Preservação, sustentabilidade e adaptação.", weight: 0.9 },
        { id: "emprego", name: "Emprego", description: "Trabalho, renda e desenvolvimento produtivo.", weight: 1 },
        { id: "administracao", name: "Administração", description: "Gestão pública, transparência e eficiência.", weight: 1 },
        { id: "habitacao", name: "Habitação", description: "Moradia, urbanização e áreas de risco.", weight: 0.9 },
        { id: "tecnologia", name: "Tecnologia", description: "Digitalização, inovação e serviços digitais.", weight: 0.8 },
        { id: "agricultura", name: "Agricultura", description: "Produção rural, logística e desenvolvimento regional.", weight: 0.8 },
        { id: "cultura", name: "Cultura", description: "Patrimônio, produção cultural e economia criativa.", weight: 0.6 }
    ];

    const ISSUE_BY_ID = {};

    ISSUES.forEach(issue => {
        ISSUE_BY_ID[issue.id] = issue;
    });

    /* =====================================================
       JORNALISTAS FICTÍCIOS
       ===================================================== */

    const FICTIONAL_JOURNALISTS = [
        ["Helena Duarte", "Jornal Nacional Independente", "técnica", "analítica"],
        ["Rafael Monteiro", "Rede Pública de Notícias", "confrontadora", "direto"],
        ["Camila Nogueira", "Canal Brasil Agora", "moderada", "equilibrada"],
        ["Eduardo Vasconcelos", "Diário da República", "econômica", "objetivo"],
        ["Marina Tavares", "Observatório Político", "institucional", "questionadora"],
        ["Lucas Almeida", "Notícias em Foco", "popular", "informal"],
        ["Renata Campos", "Panorama Nacional", "políticas públicas", "detalhista"],
        ["Felipe Andrade", "República em Debate", "debate", "provocador"]
    ].map((x, i) => ({
        id: "journalist_" + (i + 1),
        name: x[0],
        outlet: x[1],
        style: x[2],
        tone: x[3]
    }));

    /* =====================================================
       GOVERNADORES / PREFEITOS
       ===================================================== */

    const GOVERNORS = {};
    const MAYORS = {};

    STATES.forEach(state => {
        GOVERNORS[state.uf] = {
            id: generateId("governor"),
            name: generatePersonName(),
            party: randomFrom(PARTIES).acronym,
            role: "Governador",
            state: state.uf,
            approval: 35 + Math.floor(Math.random() * 35),
            reputation: 40 + Math.floor(Math.random() * 40)
        };
    });

    CITIES.forEach(city => {
        MAYORS[city.id] = {
            id: generateId("mayor"),
            name: generatePersonName(),
            party: randomFrom(PARTIES).acronym,
            role: "Prefeito",
            city: city.city,
            state: city.uf,
            approval: 35 + Math.floor(Math.random() * 40),
            reputation: 40 + Math.floor(Math.random() * 35)
        };
    });

    /* =====================================================
       MINISTÉRIOS
       ===================================================== */

    const GOVERNMENT_MINISTRIES = [
        ["fazenda", "Ministério da Fazenda", "economia"],
        ["saude", "Ministério da Saúde", "saude"],
        ["educacao", "Ministério da Educação", "educacao"],
        ["justica", "Ministério da Justiça", "seguranca"],
        ["infraestrutura", "Ministério da Infraestrutura", "infraestrutura"],
        ["meio_ambiente", "Ministério do Meio Ambiente", "meioAmbiente"],
        ["trabalho", "Ministério do Trabalho", "emprego"],
        ["gestao", "Ministério da Gestão", "administracao"],
        ["cidades", "Ministério das Cidades", "habitacao"],
        ["tecnologia", "Ministério da Tecnologia", "tecnologia"],
        ["agricultura", "Ministério da Agricultura", "agricultura"],
        ["cultura", "Ministério da Cultura", "cultura"]
    ].map(x => ({
        id: x[0],
        name: x[1],
        issue: x[2]
    }));

    const MINISTERS = {};

    GOVERNMENT_MINISTRIES.forEach(ministry => {
        MINISTERS[ministry.id] = {
            id: generateId("minister"),
            name: generatePersonName(),
            party: randomFrom(PARTIES).acronym,
            role: "Ministro",
            ministry: ministry.name,
            issue: ministry.issue,
            approval: 40 + Math.floor(Math.random() * 30)
        };
    });

    /* =====================================================
       ENTREVISTAS
       ===================================================== */

    const INTERVIEW_QUESTIONS = [
        {
            id: "int_01",
            issue: "economia",
            question: "Qual será sua prioridade econômica?",
            answers: [
                { text: "Controle e planejamento", reputation: 2, popularity: 1 },
                { text: "Acelerar investimentos", reputation: -1, popularity: 3 },
                { text: "Buscar equilíbrio", reputation: 2, popularity: 2 }
            ]
        },

        {
            id: "int_02",
            issue: "saude",
            question: "Como reduzir as filas na saúde?",
            answers: [
                { text: "Melhorar gestão", reputation: 2, popularity: 2 },
                { text: "Aumentar investimentos", reputation: 1, popularity: 3 },
                { text: "Criar metas de atendimento", reputation: 3, popularity: 1 }
            ]
        },

        {
            id: "int_03",
            issue: "educacao",
            question: "Qual deve ser a prioridade da educação?",
            answers: [
                { text: "Qualidade do ensino", reputation: 2, popularity: 2 },
                { text: "Infraestrutura", reputation: 1, popularity: 2 },
                { text: "Valorização profissional", reputation: 1, popularity: 3 }
            ]
        },

        {
            id: "int_04",
            issue: "seguranca",
            question: "Como melhorar a segurança?",
            answers: [
                { text: "Prevenção", reputation: 2, popularity: 2 },
                { text: "Tecnologia", reputation: 2, popularity: 2 },
                { text: "Integração das forças", reputation: 3, popularity: 1 }
            ]
        },

        {
            id: "int_05",
            issue: "emprego",
            question: "Como estimular a criação de empregos?",
            answers: [
                { text: "Apoiar empresas", reputation: 1, popularity: 2 },
                { text: "Qualificação profissional", reputation: 3, popularity: 2 },
                { text: "Investimentos públicos", reputation: 0, popularity: 3 }
            ]
        },

        {
            id: "int_06",
            issue: "tecnologia",
            question: "Como modernizar o governo?",
            answers: [
                { text: "Digitalizar serviços", reputation: 3, popularity: 2 },
                { text: "Automatizar processos", reputation: 3, popularity: 1 },
                { text: "Criar canais digitais", reputation: 2, popularity: 2 }
            ]
        }
    ];

    /* =====================================================
       POLÍTICAS PÚBLICAS
       ===================================================== */

    const POLICY_PROPOSALS = [
        { id: "policy_01", name: "Programa Nacional de Atendimento Digital", issue: "tecnologia", cost: 850000000, difficulty: 55, popularity: 4, reputation: 3 },
        { id: "policy_02", name: "Plano de Modernização da Saúde", issue: "saude", cost: 1200000000, difficulty: 65, popularity: 5, reputation: 4 },
        { id: "policy_03", name: "Programa de Qualificação Profissional", issue: "emprego", cost: 700000000, difficulty: 48, popularity: 4, reputation: 3 },
        { id: "policy_04", name: "Plano de Infraestrutura Regional", issue: "infraestrutura", cost: 1500000000, difficulty: 70, popularity: 6, reputation: 3 },
        { id: "policy_05", name: "Programa de Transparência Pública", issue: "administracao", cost: 180000000, difficulty: 35, popularity: 2, reputation: 6 },
        { id: "policy_06", name: "Plano Nacional de Educação Técnica", issue: "educacao", cost: 900000000, difficulty: 60, popularity: 5, reputation: 5 },
        { id: "policy_07", name: "Programa de Desenvolvimento Rural", issue: "agricultura", cost: 600000000, difficulty: 50, popularity: 3, reputation: 4 },
        { id: "policy_08", name: "Plano de Habitação e Urbanização", issue: "habitacao", cost: 1100000000, difficulty: 68, popularity: 6, reputation: 3 },
        { id: "policy_09", name: "Programa de Gestão Ambiental", issue: "meioAmbiente", cost: 450000000, difficulty: 52, popularity: 3, reputation: 5 },
        { id: "policy_10", name: "Programa de Equilíbrio Fiscal", issue: "economia", cost: 250000000, difficulty: 72, popularity: -1, reputation: 7 }
    ];

    /* =====================================================
       PROJETOS DE LEI
       ===================================================== */

    const BILL_TEMPLATES = [
        { id: "bill_01", name: "Marco Nacional de Transparência Pública", issue: "administracao", difficulty: 45, support: 58 },
        { id: "bill_02", name: "Programa de Modernização dos Serviços de Saúde", issue: "saude", difficulty: 58, support: 61 },
        { id: "bill_03", name: "Plano de Expansão da Educação Técnica", issue: "educacao", difficulty: 55, support: 64 },
        { id: "bill_04", name: "Programa de Infraestrutura Regional", issue: "infraestrutura", difficulty: 70, support: 52 },
        { id: "bill_05", name: "Programa de Incentivo à Inovação", issue: "tecnologia", difficulty: 48, support: 57 },
        { id: "bill_06", name: "Plano de Qualificação para o Trabalho", issue: "emprego", difficulty: 50, support: 63 },
        { id: "bill_07", name: "Programa Nacional de Habitação", issue: "habitacao", difficulty: 68, support: 66 },
        { id: "bill_08", name: "Política Nacional de Desenvolvimento Sustentável", issue: "meioAmbiente", difficulty: 62, support: 49 },
        { id: "bill_09", name: "Plano Nacional de Segurança Integrada", issue: "seguranca", difficulty: 64, support: 60 },
        { id: "bill_10", name: "Programa de Desenvolvimento Agrícola", issue: "agricultura", difficulty: 51, support: 56 }
    ];

    /* =====================================================
       ESCÂNDALOS FICTÍCIOS
       ===================================================== */

    const SCANDAL_TEMPLATES = [
        { id: "scandal_01", title: "Questionamentos sobre contrato público", severity: 25, reputation: -5, popularity: -3 },
        { id: "scandal_02", title: "Críticas sobre gastos da campanha", severity: 20, reputation: -4, popularity: -2 },
        { id: "scandal_03", title: "Aliado envolvido em investigação fictícia", severity: 30, reputation: -6, popularity: -4 },
        { id: "scandal_04", title: "Documento administrativo gera controvérsia", severity: 15, reputation: -2, popularity: -1 },
        { id: "scandal_05", title: "Oposição questiona decisão do governo", severity: 10, reputation: -1, popularity: -1 },
        { id: "scandal_06", title: "Debate sobre possível conflito de interesses", severity: 28, reputation: -5, popularity: -3 }
    ];

    /* =====================================================
       EVENTOS
       ===================================================== */

    const EVENT_TEMPLATES = [
        {
            id: "event_01",
            title: "Reunião comunitária",
            description: "Uma reunião comunitária exige uma decisão.",
            category: "social",
            options: [
                { text: "Participar pessoalmente", effects: { popularity: 2, reputation: 1, energy: -8 } },
                { text: "Enviar equipe", effects: { reputation: 1, energy: -2 } }
            ]
        },

        {
            id: "event_02",
            title: "Crítica nas redes sociais",
            description: "Uma crítica fictícia ganhou repercussão nas redes.",
            category: "media",
            options: [
                { text: "Responder com dados", effects: { reputation: 2, energy: -4 } },
                { text: "Ignorar", effects: { popularity: -1 } }
            ]
        },

        {
            id: "event_03",
            title: "Convite para entrevista",
            description: "Um veículo fictício convidou você para uma entrevista.",
            category: "media",
            options: [
                { text: "Aceitar", effects: { popularity: 2, followers: 250, energy: -5 } },
                { text: "Recusar", effects: { energy: 1 } }
            ]
        },

        {
            id: "event_04",
            title: "Problema de infraestrutura",
            description: "Uma região relatou problemas de infraestrutura.",
            category: "local",
            options: [
                { text: "Visitar o local", effects: { popularity: 3, reputation: 1, energy: -8 } },
                { text: "Solicitar relatório", effects: { reputation: 2, energy: -3 } }
            ]
        },

        {
            id: "event_05",
            title: "Pesquisa favorável",
            description: "Uma pesquisa fictícia mostrou crescimento da intenção de voto.",
            category: "poll",
            options: [
                { text: "Comemorar publicamente", effects: { popularity: 2, followers: 400 } },
                { text: "Manter cautela", effects: { reputation: 2 } }
            ]
        },

        {
            id: "event_06",
            title: "Pesquisa desfavorável",
            description: "Uma pesquisa fictícia mostrou queda na intenção de voto.",
            category: "poll",
            options: [
                { text: "Intensificar campanha", effects: { popularity: 2, energy: -10 } },
                { text: "Reavaliar estratégia", effects: { reputation: 2, energy: -4 } }
            ]
        },

        {
            id: "event_07",
            title: "Convite partidário",
            description: "A direção partidária fictícia solicitou uma reunião.",
            category: "party",
            options: [
                { text: "Aceitar reunião", effects: { reputation: 2, energy: -5 } },
                { text: "Adiar", effects: { partySupport: -2 } }
            ]
        },

        {
            id: "event_08",
            title: "Conflito interno",
            description: "Um conflito interno surgiu na equipe.",
            category: "party",
            options: [
                { text: "Mediar", effects: { reputation: 3, negotiation: 2, energy: -8 } },
                { text: "Não interferir", effects: { partySupport: -1 } }
            ]
        },

        {
            id: "event_09",
            title: "Oportunidade de aliança",
            description: "Uma possível aliança política fictícia foi apresentada.",
            category: "alliance",
            options: [
                { text: "Negociar", effects: { negotiation: 2, energy: -6 } },
                { text: "Recusar", effects: { reputation: 1 } }
            ]
        },

        {
            id: "event_10",
            title: "Debate inesperado",
            description: "Você recebeu um convite inesperado para um debate.",
            category: "debate",
            options: [
                { text: "Aceitar", effects: { charisma: 2, popularity: 2, energy: -10 } },
                { text: "Recusar", effects: { popularity: -1 } }
            ]
        },

        {
            id: "event_11",
            title: "Apoio voluntário",
            description: "Voluntários fictícios ofereceram ajuda à campanha.",
            category: "campaign",
            options: [
                { text: "Organizar equipe", effects: { volunteers: 15, reputation: 1 } },
                { text: "Agradecer e recusar", effects: { reputation: 1 } }
            ]
        },

        {
            id: "event_12",
            title: "Proposta de política pública",
            description: "Uma proposta de política pública chegou à sua equipe.",
            category: "policy",
            options: [
                { text: "Aprofundar estudos", effects: { preparation: 3, energy: -4 } },
                { text: "Apresentar imediatamente", effects: { popularity: 2, reputation: -1 } }
            ]
        },

        {
            id: "event_13",
            title: "Problema de transporte",
            description: "Moradores relataram dificuldades de transporte.",
            category: "infrastructure",
            options: [
                { text: "Visitar a região", effects: { popularity: 3, energy: -8 } },
                { text: "Solicitar diagnóstico", effects: { reputation: 2 } }
            ]
        },

        {
            id: "event_14",
            title: "Discussão sobre saúde",
            description: "Representantes apresentaram propostas para a saúde.",
            category: "health",
            options: [
                { text: "Ouvir as propostas", effects: { reputation: 3, preparation: 2, energy: -5 } },
                { text: "Prometer solução imediata", effects: { popularity: 2, reputation: -2 } }
            ]
        },

        {
            id: "event_15",
            title: "Reunião com educadores",
            description: "Educadores solicitaram uma reunião.",
            category: "education",
            options: [
                { text: "Participar", effects: { reputation: 3, popularity: 1, energy: -6 } },
                { text: "Enviar assessores", effects: { reputation: 1 } }
            ]
        },

        {
            id: "event_16",
            title: "Boato político",
            description: "Um boato fictício circulou nas redes.",
            category: "media",
            options: [
                { text: "Desmentir imediatamente", effects: { reputation: 2, energy: -4 } },
                { text: "Não alimentar o rumor", effects: { reputation: 1 } }
            ]
        },

        {
            id: "event_17",
            title: "Aumento de seguidores",
            description: "A campanha ganhou seguidores rapidamente.",
            category: "campaign",
            options: [
                { text: "Aproveitar o momento", effects: { followers: 1500, popularity: 3 } },
                { text: "Manter estratégia", effects: { followers: 500 } }
            ]
        },

        {
            id: "event_18",
            title: "Crítica de adversário",
            description: "Um adversário fictício fez uma crítica pública.",
            category: "campaign",
            options: [
                { text: "Responder", effects: { charisma: 1, popularity: 1, energy: -4 } },
                { text: "Não responder", effects: { reputation: 1 } }
            ]
        },

        {
            id: "event_19",
            title: "Problema na equipe",
            description: "Um problema de organização surgiu na campanha.",
            category: "management",
            options: [
                { text: "Reorganizar funções", effects: { organization: 2, energy: -5 } },
                { text: "Substituir integrante", effects: { cash: -3000, organization: 3 } }
            ]
        },

        {
            id: "event_20",
            title: "Evento lotado",
            description: "Um evento de campanha recebeu público acima do esperado.",
            category: "campaign",
            options: [
                { text: "Fazer discurso extra", effects: { popularity: 4, followers: 700, energy: -8 } },
                { text: "Encerrar no horário", effects: { reputation: 2, energy: -3 } }
            ]
        }
    ];

    /* =====================================================
       EVENTOS PROCEDURAIS
       ===================================================== */

    const EVENT_LOCATIONS = [
        "São Paulo",
        "Rio de Janeiro",
        "Belo Horizonte",
        "Salvador",
        "Brasília",
        "Recife",
        "Fortaleza",
        "Curitiba",
        "Porto Alegre",
        "Manaus",
        "Belém",
        "Goiânia",
        "Campinas",
        "Santos",
        "Florianópolis"
    ];

    const EVENT_SITUATIONS = [
        "lideranças locais solicitaram uma reunião",
        "uma associação apresentou uma proposta",
        "um grupo de moradores pediu atenção ao problema",
        "uma organização apresentou dados sobre a região",
        "uma equipe técnica sugeriu uma mudança",
        "um grupo de trabalhadores solicitou diálogo",
        "representantes da comunidade enviaram sugestões",
        "uma comissão pediu esclarecimentos",
        "uma entidade apresentou uma alternativa",
        "um grupo de estudantes solicitou uma reunião"
    ];

    const EVENT_TOPICS = [
        "saúde",
        "educação",
        "emprego",
        "infraestrutura",
        "segurança",
        "tecnologia",
        "habitação",
        "meio ambiente",
        "transporte",
        "administração pública",
        "economia",
        "cultura"
    ];

    function generateProceduralEvents(amount = 200) {
        const events = [];

        for (let i = 0; i < amount; i++) {
            const location = randomFrom(EVENT_LOCATIONS);
            const situation = randomFrom(EVENT_SITUATIONS);
            const topic = randomFrom(EVENT_TOPICS);

            events.push({
                id: generateId("procedural_event"),

                title: `Situação política em ${location}`,

                description:
                    `${situation} envolvendo ${topic}.`,

                category: "procedural",

                location,
                topic,

                options: [
                    {
                        text: "Participar pessoalmente",
                        effects: {
                            popularity: 1 + Math.floor(Math.random() * 4),
                            reputation: Math.floor(Math.random() * 3),
                            energy: -(4 + Math.floor(Math.random() * 7))
                        }
                    },

                    {
                        text: "Enviar equipe técnica",
                        effects: {
                            reputation: 1 + Math.floor(Math.random() * 3),
                            energy: -2
                        }
                    },

                    {
                        text: "Solicitar mais informações",
                        effects: {
                            preparation: 1 + Math.floor(Math.random() * 3),
                            reputation: 1
                        }
                    }
                ]
            });
        }

        return events;
    }

    const PROCEDURAL_EVENTS = generateProceduralEvents(200);

    /* =====================================================
       NOTÍCIAS
       ===================================================== */

    const NEWS_TEMPLATES = [
        "Pesquisa fictícia mostra mudança na intenção de voto.",
        "Partidos discutem novas alianças para a próxima eleição.",
        "Comissão parlamentar inicia análise de novo projeto.",
        "Debate sobre orçamento ganha espaço no cenário político.",
        "Lideranças regionais apresentam novas propostas.",
        "Campanha amplia presença em municípios estratégicos.",
        "Pesquisa aponta maior interesse dos eleitores por saúde.",
        "Educação aparece entre os principais temas da semana.",
        "Infraestrutura ganha destaque nas discussões públicas.",
        "Representantes partidários iniciam rodada de negociações.",
        "Nova proposta de transparência é apresentada.",
        "Debate sobre empregos movimenta campanha eleitoral.",
        "Parlamentares analisam mudanças em projeto fictício.",
        "Governadores fictícios discutem cooperação regional.",
        "Prefeituras fictícias apresentam novos planos de investimento.",
        "Candidatos intensificam agendas de campanha.",
        "Redes sociais se tornam foco das campanhas.",
        "Novas pesquisas estaduais são divulgadas.",
        "Eleitores acompanham debate entre candidatos.",
        "Comissões parlamentares recebem especialistas fictícios."
    ];

    /* =====================================================
       DEBATES
       ===================================================== */

    const DEBATE_QUESTIONS = [
        {
            id: "debate_01",
            issue: "economia",
            question: "Como equilibrar crescimento econômico e responsabilidade fiscal?",
            followUps: [
                "Qual seria sua primeira medida?",
                "Como financiaria essa proposta?",
                "Que resultado esperaria no primeiro ano?"
            ]
        },

        {
            id: "debate_02",
            issue: "saude",
            question: "Como reduzir o tempo de espera no atendimento público?",
            followUps: [
                "Como mediria o resultado?",
                "Qual seria a prioridade?",
                "Quanto custaria?"
            ]
        },

        {
            id: "debate_03",
            issue: "educacao",
            question: "Qual deve ser a prioridade para melhorar a educação?",
            followUps: [
                "Como apoiar professores?",
                "Como melhorar a infraestrutura?",
                "Como medir aprendizagem?"
            ]
        },

        {
            id: "debate_04",
            issue: "seguranca",
            question: "Qual estratégia de segurança pública você priorizaria?",
            followUps: [
                "Qual seria a primeira ação?",
                "Qual seria o papel da tecnologia?",
                "Como medir resultados?"
            ]
        },

        {
            id: "debate_05",
            issue: "infraestrutura",
            question: "Quais investimentos deveriam receber prioridade?",
            followUps: [
                "Como escolher as obras?",
                "Como evitar atrasos?",
                "Como financiar?"
            ]
        },

        {
            id: "debate_06",
            issue: "emprego",
            question: "Como criar mais oportunidades de trabalho?",
            followUps: [
                "Qual setor seria priorizado?",
                "Como apoiar pequenos negócios?",
                "Como medir os resultados?"
            ]
        },

        {
            id: "debate_07",
            issue: "meioAmbiente",
            question: "Como conciliar desenvolvimento e preservação ambiental?",
            followUps: [
                "Quais seriam as prioridades?",
                "Como fiscalizar?",
                "Como incentivar inovação?"
            ]
        },

        {
            id: "debate_08",
            issue: "administracao",
            question: "Como aumentar a eficiência do governo?",
            followUps: [
                "Qual área seria reformada primeiro?",
                "Como combater desperdícios?",
                "Como garantir transparência?"
            ]
        },

        {
            id: "debate_09",
            issue: "habitacao",
            question: "Como enfrentar problemas de moradia?",
            followUps: [
                "Qual seria a fonte de recursos?",
                "Como escolher os projetos?",
                "Como evitar áreas de risco?"
            ]
        },

        {
            id: "debate_10",
            issue: "tecnologia",
            question: "Como usar tecnologia para melhorar os serviços públicos?",
            followUps: [
                "Quais serviços seriam digitalizados?",
                "Como proteger os dados?",
                "Como garantir inclusão digital?"
            ]
        }
    ];

    const DEBATE_FOLLOWUPS = [
        "Como você financiaria essa proposta?",
        "Qual seria sua primeira medida?",
        "Qual seria o prazo?",
        "Como fiscalizaria?",
        "Qual seria a meta?",
        "Como convenceria outros partidos?",
        "O que aconteceria se a proposta não funcionasse?",
        "Qual seria o custo?",
        "Como mediria o resultado?",
        "Quem seria responsável?",
        "Como explicaria essa decisão ao eleitor?",
        "Você mudaria sua proposta diante de novas evidências?"
    ];

    /* =====================================================
       CAMPANHA
       ===================================================== */

    const CAMPAIGN_STRATEGIES = {
        digital: {
            name: "Digital",
            description: "Foco em redes sociais e comunicação digital.",
            cost: 3500,
            popularity: 2,
            followers: 800,
            energy: 3
        },

        rua: {
            name: "Rua",
            description: "Foco em contato direto com eleitores.",
            cost: 2500,
            popularity: 3,
            followers: 350,
            energy: 8
        },

        institucional: {
            name: "Institucional",
            description: "Foco em propostas e credibilidade.",
            cost: 1800,
            popularity: 1,
            followers: 150,
            energy: 2
        },

        regional: {
            name: "Regional",
            description: "Foco em cidades estratégicas.",
            cost: 4000,
            popularity: 4,
            followers: 450,
            energy: 6
        },

        mobilizacao: {
            name: "Mobilização",
            description: "Foco em voluntários e presença local.",
            cost: 2800,
            popularity: 3,
            followers: 500,
            energy: 7
        }
    };

    /* =====================================================
       PESQUISAS
       ===================================================== */

    const POLL_SOURCES = [
        "Instituto Horizonte",
        "DataBrasil",
        "Opinião Nacional",
        "Pesquisa Cívica",
        "Observatório Eleitoral"
    ];

    /* =====================================================
       GERADORES DE POLÍTICOS
       ===================================================== */

    function generateFictionalPolitician(options = {}) {
        return {
            id: generateId("politician"),

            name: options.name || generatePersonName(),

            party:
                options.party ||
                randomFrom(PARTIES).acronym,

            role:
                options.role ||
                "Político",

            state:
                options.state ||
                null,

            city:
                options.city ||
                null,

            ministry:
                options.ministry ||
                null,

            popularity:
                20 + Math.floor(Math.random() * 60),

            reputation:
                30 + Math.floor(Math.random() * 60),

            charisma:
                35 + Math.floor(Math.random() * 55),

            communication:
                35 + Math.floor(Math.random() * 55),

            negotiation:
                35 + Math.floor(Math.random() * 55)
        };
    }

    function generateFictionalMayor(city) {
        return generateFictionalPolitician({
            role: "Prefeito",
            city: city.city,
            state: city.uf
        });
    }

    function generateFictionalGovernor(state) {
        return generateFictionalPolitician({
            role: "Governador",
            state: state.uf
        });
    }

    function generateFictionalMinister(ministry) {
        return generateFictionalPolitician({
            role: "Ministro",
            ministry: ministry.name
        });
    }

    function generateRandomEvent() {
        return randomFrom([
            ...EVENT_TEMPLATES,
            ...PROCEDURAL_EVENTS
        ]);
    }

    /* =====================================================
       OBJETO PRINCIPAL
       ===================================================== */

    const POLITICAL_DATA = {
        __v3DataLoaded: true,

        POLL_SOURCES: [
    "Instituto Horizonte",
    "DataBrasil",
    "Opinião Nacional",
    "Pesquisa Cívica",
    "Observatório Eleitoral"
],

        STATES,
        CITIES,

        PARTIES,
        FEDERATIONS,

        ISSUES,
        ISSUE_BY_ID,

        FICTIONAL_FIRST_NAMES,
        FICTIONAL_LAST_NAMES,
        FICTIONAL_JOURNALISTS,

        GOVERNORS,
        MAYORS,
        MINISTERS,
        GOVERNMENT_MINISTRIES,

        INTERVIEW_QUESTIONS,
        POLICY_PROPOSALS,
        BILL_TEMPLATES,

        SCANDAL_TEMPLATES,

        EVENT_TEMPLATES,
        PROCEDURAL_EVENTS,

        NEWS_TEMPLATES,

        DEBATE_QUESTIONS,
        DEBATE_FOLLOWUPS,

        CAMPAIGN_STRATEGIES,

        POLL_SOURCES,

        randomFrom,
        clamp,
        chance,
        generateId,

        formatMoney,
        formatNumber,

        generatePersonName,

        generateFictionalPolitician,
        generateFictionalMayor,
        generateFictionalGovernor,
        generateFictionalMinister,

        generateRandomEvent
    };

    /* Aliases */
    POLITICAL_DATA.PARTY_LIST = PARTIES;
    POLITICAL_DATA.STATE_LIST = STATES;
    POLITICAL_DATA.CITY_LIST = CITIES;

    POLITICAL_DATA.EVENTS = [
        ...EVENT_TEMPLATES,
        ...PROCEDURAL_EVENTS
    ];

    POLITICAL_DATA.BILLS = BILL_TEMPLATES;
    POLITICAL_DATA.MINISTRIES = GOVERNMENT_MINISTRIES;

    /* =====================================================
       EXPORTAÇÕES
       ===================================================== */

    window.POLITICAL_DATA = POLITICAL_DATA;

    window.STATES = STATES;
    window.CITIES = CITIES;
    window.PARTIES = PARTIES;
    window.FEDERATIONS = FEDERATIONS;
    window.ISSUES = ISSUES;
    window.NEWS_TEMPLATES = NEWS_TEMPLATES;
    window.GOVERNORS = GOVERNORS;
    window.MAYORS = MAYORS;
    window.MINISTERS = MINISTERS;

    window.BILL_TEMPLATES = BILL_TEMPLATES;
    window.EVENT_TEMPLATES = EVENT_TEMPLATES;
    window.PROCEDURAL_EVENTS = PROCEDURAL_EVENTS;

    if (typeof window.CAMPAIGN_STRATEGIES === "undefined") {
        window.CAMPAIGN_STRATEGIES = CAMPAIGN_STRATEGIES;
    }

    if (typeof window.DEBATE_QUESTIONS === "undefined") {
        window.DEBATE_QUESTIONS = DEBATE_QUESTIONS;
    }

    window.randomFrom = randomFrom;
    window.clamp = clamp;
    window.chance = chance;
    window.generateId = generateId;

    window.formatMoney = formatMoney;
    window.formatNumber = formatNumber;

    window.generatePersonName = generatePersonName;

    window.generateFictionalPolitician = generateFictionalPolitician;
    window.generateFictionalMayor = generateFictionalMayor;
    window.generateFictionalGovernor = generateFictionalGovernor;
    window.generateFictionalMinister = generateFictionalMinister;

    window.generateRandomEvent = generateRandomEvent;

})();