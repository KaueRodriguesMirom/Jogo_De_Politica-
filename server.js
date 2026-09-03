const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5500;

const SAVE_FILE = path.join(
    __dirname,
    "data",
    "save.json"
);

app.use(express.json());
app.use(express.static(__dirname));

// ===============================
// CARREGAR SAVE
// ===============================
app.get("/api/save", (req, res) => {
    try {
        if (!fs.existsSync(SAVE_FILE)) {
            return res.json(null);
        }

        const data = fs.readFileSync(
            SAVE_FILE,
            "utf8"
        );

        res.json(JSON.parse(data));

    } catch (error) {
        console.error("Erro ao carregar save:", error);

        res.status(500).json({
            error: "Erro ao carregar save"
        });
    }
});

// ===============================
// SALVAR SAVE
// ===============================
app.post("/api/save", (req, res) => {
    try {

        fs.mkdirSync(
            path.dirname(SAVE_FILE),
            { recursive: true }
        );

        fs.writeFileSync(
            SAVE_FILE,
            JSON.stringify(req.body, null, 2),
            "utf8"
        );

        console.log("💾 Save atualizado.");

        res.json({
            success: true
        });

    } catch (error) {

        console.error("Erro ao salvar:", error);

        res.status(500).json({
            success: false,
            error: "Erro ao salvar jogo"
        });
    }
});

// ===============================
// INICIAR SERVIDOR
// ===============================
app.listen(PORT, () => {
    console.log(
        `🎮 Brasil Político rodando em http://localhost:${PORT}`
    );
});