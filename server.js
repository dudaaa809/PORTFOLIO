const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
const PORT = 3000;

// =====================================
// CONFIGURAÇÕES
// =====================================

app.use(cors());

app.use(express.json());


// =====================================
// CONFIGURAÇÃO DO MYSQL
// =====================================

const config = {
    host: "localhost",
    user: "root",
    password: "123456"
};


// =====================================
// INICIAR BANCO
// =====================================

async function iniciarBanco() {

    try {

        // Conecta ao MySQL
        const conexao = await mysql.createConnection(config);

        console.log("✅ MySQL conectado!");


        // Cria o banco
        await conexao.query(`
            CREATE DATABASE IF NOT EXISTS portfolio_login
        `);

        console.log("✅ Banco portfolio_login pronto!");


        // Seleciona o banco
        await conexao.query(`
            USE portfolio_login
        `);


        // Cria a tabela
        await conexao.query(`
            CREATE TABLE IF NOT EXISTS usuarios (

                id INT AUTO_INCREMENT PRIMARY KEY,

                usuario VARCHAR(100) NOT NULL UNIQUE,

                senha VARCHAR(255) NOT NULL,

                tipo ENUM('aluna', 'professores') NOT NULL

            )
        `);

        console.log("✅ Tabela usuarios pronta!");


        // Cria/corrige usuário da aluna
        await conexao.query(`
            INSERT INTO usuarios
            (usuario, senha, tipo)

            VALUES
            ('duda@senai.com', '123456', 'aluna')

            ON DUPLICATE KEY UPDATE
            senha = '123456',
            tipo = 'aluna'
        `);


        // Cria/corrige usuário professor
        await conexao.query(`
            INSERT INTO usuarios
            (usuario, senha, tipo)

            VALUES
            ('prof@gmail.com', '123456', 'professores')

            ON DUPLICATE KEY UPDATE
            senha = '123456',
            tipo = 'professores'
        `);


        console.log("✅ Usuários configurados!");


        // Mostra os usuários
        const [usuarios] = await conexao.query(`
            SELECT id, usuario, tipo
            FROM usuarios
        `);


        console.log("");
        console.log("USUÁRIOS CADASTRADOS:");

        console.table(usuarios);


        await conexao.end();


        // =====================================
        // CONEXÃO DO SERVIDOR COM O BANCO
        // =====================================

        const banco = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "123456",
            database: "portfolio_login"
        });


        console.log("✅ Conexão com portfolio_login criada!");


        // =====================================
        // LOGIN
        // =====================================

        app.post("/login", async (req, res) => {

            const { usuario, senha } = req.body;


            console.log("");
            console.log("--------------------------------");
            console.log("Tentativa de login");
            console.log("Usuário:", usuario);


            if (!usuario || !senha) {

                return res.status(400).json({

                    sucesso: false,

                    mensagem: "Preencha usuário e senha."

                });

            }


            try {

                const [resultado] = await banco.query(
                    `
                    SELECT id, usuario, tipo
                    FROM usuarios
                    WHERE usuario = ? AND senha = ?
                    `,
                    [usuario, senha]
                );


                if (resultado.length === 0) {

                    console.log("❌ Usuário ou senha incorretos.");

                    return res.status(401).json({

                        sucesso: false,

                        mensagem: "Usuário ou senha incorretos."

                    });

                }


                const usuarioEncontrado = resultado[0];


                console.log("✅ LOGIN CORRETO!");
                console.log("Tipo:", usuarioEncontrado.tipo);


                return res.json({

                    sucesso: true,

                    mensagem: "Login realizado com sucesso!",

                    usuario: usuarioEncontrado.usuario,

                    tipo: usuarioEncontrado.tipo

                });


            } catch (erro) {

                console.error("❌ ERRO AO CONSULTAR O BANCO:");
                console.error(erro.message);


                return res.status(500).json({

                    sucesso: false,

                    mensagem: "Erro ao consultar o banco."

                });

            }

        });


        // =====================================
        // INICIAR SERVIDOR
        // =====================================

        app.listen(PORT, () => {

            console.log("");
            console.log("====================================");
            console.log("🚀 SERVIDOR DO PORTFÓLIO");
            console.log("====================================");
            console.log(`http://localhost:${PORT}`);
            console.log("====================================");
            console.log("✅ SISTEMA PRONTO PARA LOGIN!");
            console.log("====================================");
            console.log("");

        });


    } catch (erro) {

        console.error("");
        console.error("❌ ERRO AO INICIAR O BANCO:");
        console.error(erro.message);
        console.error("");

    }

}


// Inicia tudo
iniciarBanco();