import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const host = '0.0.0.0';
const porta = 3000;

let listaInteressados = [];
let listaPets = [];
let listaAdocao = [];

const aplicacao = express();

aplicacao.use(express.urlencoded({ extended: true }));

aplicacao.use(session({
    secret: 'MinH4Ch4v3S3cr3t4',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30      //30 minutos
    }
}));

aplicacao.use(cookieParser());

function VerificarAutenticacao(requisicao, resposta, next) {
    if (requisicao.session.Autenticacao) {
        next();
    }
    else {
        resposta.redirect('/pageLogin.html');
    }
}

function autenticarUsuario(requisicao, resposta) {
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    if (usuario == 'admin' && senha == '123') {
        requisicao.session.Autenticacao = true;
        resposta.cookie('dataUltimoAcesso', new Date().toLocaleString(), {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30
        });
        resposta.redirect('/');
    }
    else {
        resposta.write('<!DOCTYPE html>');
        resposta.write('<html>');
        resposta.write('<head>');
        resposta.write('<meta charset="UTF-8">');
        resposta.write('<title>Falha na autenticação</title>');
        resposta.write('</head>');
        resposta.write('<body>');
        resposta.write('<p>Usuário ou senha inválidos!</p>');
        resposta.write('<a href="/pageLogin.html">Voltar</a>');
        if (requisicao.cookies.dataUltimoAcesso) {
            resposta.write('<p>');
            resposta.write('Seu último acesso foi em ' + requisicao.cookies.dataUltimoAcesso);
            resposta.write('</p>');
        }
        resposta.write('</body>');
        resposta.write('</html>');
        resposta.end();
    }
}

function CadastroInteressados(requisicao, resposta) {
    const nome = requisicao.body.nome;
    const email = requisicao.body.email;
    const telefone = requisicao.body.telefone;

    if (nome && email && telefone) {
        listaInteressados.push({ nome: nome, email: email, telefone: telefone });
        resposta.redirect('/listarInteressados');
    }
    else {
        resposta.write('<!DOCTYPE html>');
        resposta.write('<html>');
        resposta.write('<head>');
        resposta.write('<meta charset="UTF-8">');
        resposta.write('<title>Cadastro de interessados</title>');
        resposta.write('</head>');
        resposta.write('<body>');
        resposta.write('<p>Preencha todos os campos!!!</p>');
        resposta.write('<a href="/cadastroInteressados.html">Voltar</a>');
        resposta.write('</body>');
        resposta.write('</html>');
        resposta.end();
    }
};

function cadastroPets(requisicao, resposta) {
    const nome = requisicao.body.nome;
    const raca = requisicao.body.raca;
    const idade = requisicao.body.idade;

    if (nome && raca && idade) {
        listaPets.push({ nome: nome, raca: raca, idade: idade });
        resposta.redirect('/listarPets');
    }
    else {
        resposta.write('<!DOCTYPE html>');
        resposta.write('<html>');
        resposta.write('<head>');
        resposta.write('<meta charset="UTF-8">');
        resposta.write('<title>Cadastro de interessados</title>');
        resposta.write('</head>');
        resposta.write('<body>');
        resposta.write('<p>Preencha todos os campos!!!</p>');
        resposta.write('<a href="/cadastroPets.html">Voltar</a>');
        resposta.write('</body>');
        resposta.write('</html>');
        resposta.end();
    }
};

function cadastroAdocao(requisicao, resposta) {
    const animal = requisicao.body.animal;
    const interessado = requisicao.body.interessado;
    const data = requisicao.cookies.dataUltimoAcesso;

    if (animal && interessado) {
        listaAdocao.push({ animal: animal, interessado: interessado, data: requisicao.cookies.dataUltimoAcesso });
        resposta.redirect('/listarAdocao');
    }
    else {
        resposta.write('<!DOCTYPE html>');
        resposta.write('<html>');
        resposta.write('<head>');
        resposta.write('<meta charset="UTF-8">');
        resposta.write('<title>Adocao</title>');
        resposta.write('</head>');
        resposta.write('<body>');
        resposta.write('<p>Preencha todos os campos!!!</p>');
        resposta.write('<a href="/pageAdocao">Voltar</a>');
        resposta.write('</body>');
        resposta.write('</html>');
        resposta.end();
    }
};



aplicacao.post('/login', autenticarUsuario);

aplicacao.get('/login', (req, resp) => {
    resp.redirect('/pageLogin.html');
});

aplicacao.get('/logout', (req, resp) => {
    req.session.usuarioLogado = false;
    resp.redirect('/pageLogin.html');
});

aplicacao.use(express.static(path.join(process.cwd(), 'public')));
aplicacao.use(VerificarAutenticacao, express.static(path.join(process.cwd(), 'protected')));


aplicacao.post('/cadastrarInteressados', VerificarAutenticacao, CadastroInteressados);
aplicacao.post('/cadastrarPet', VerificarAutenticacao, cadastroPets);
aplicacao.post('/listaAdocao', VerificarAutenticacao, cadastroAdocao);

aplicacao.get('/pageAdocao', VerificarAutenticacao, (req, resp) => {
    resp.write('<!DOCTYPE html>');
    resp.write('<html lang = "pt-br">');
    resp.write('<head>');
    resp.write('<meta charset="UTF-8">');
    resp.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    resp.write('<title>Adoção</title>');
    resp.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">');
    resp.write('</head>');
    resp.write('<body>');
    resp.write('<div class="container m-5">');
    resp.write('<form method="POST" action="/listaAdocao" class="border row g-3 needs-validation">');
    resp.write('<legend>Interesse em adoção</legend>');
    resp.write('<div class="col-md-4">');
    resp.write('<label for="animal" class="form-label">Animal:</label>');
    resp.write('<select name="animal">');
    for (let i = 0; i < listaInteressados.length; i++) {
        resp.write(`<option value="${listaInteressados[i].nome}">${listaInteressados[i].nome}</option>`);
    }
    resp.write('</select>');
    resp.write('</div>');
    resp.write('<div class="col-md-4">');
    resp.write('<label for="interessado" class="form-label">Interessado:</label>');
    resp.write('<select name="interessado">');
    for (let i = 0; i < listaPets.length; i++) {
        resp.write(`<option value="${listaPets[i].nome}">${listaPets[i].nome}</option>`);
    }
    resp.write('</select>');
    resp.write('</div>');
    resp.write('<div class="col-12 mb-3">');
    resp.write('<button class="btn btn-primary" type="submit">Cadastrar</button>');
    resp.write('<a class="btn btn-secondary" href="/">Voltar</a>');
    resp.write('</div>');
    resp.write('</form>');
    resp.write('</div>');
    resp.write('</div>');
    resp.write('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>');
    resp.write('</html>');
    resp.end();
})

aplicacao.get('/listarAdocao', VerificarAutenticacao, (req, resp) => {
    resp.write('<html>');
    resp.write('<head>');
    resp.write('<title>Lista de Adoção</title>');
    resp.write('<meta charset="utf-8">');
    resp.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">')
    resp.write('</head>');
    resp.write('<body>');
    resp.write('<h1>Lista de adoção</h1>');
    resp.write('<table class="table table-striped">');
    resp.write('<tr>');
    resp.write('<th>Animal</th>');
    resp.write('<th>Interessado</th>');
    resp.write('<th>Data</th>');
    resp.write('</tr>');
    for (let i = 0; i < listaAdocao.length; i++) {
        resp.write('<tr>');
        resp.write(`<td>${listaAdocao[i].nome}`);
        resp.write(`<td>${listaAdocao[i].interessado}`);
        resp.write(`<td>${listaAdocao[i].data}`);
        resp.write('</tr>');
    }
    resp.write('</table>');
    resp.write('<a href="/pageAdocao">Adotar</a>');
    resp.write('<br />')
    resp.write('<a href="/">Voltar</a>');
    resp.write('<br />');

    if (req.cookies.dataUltimoAcesso) {
        resp.write('<p>');
        resp.write('Seu último acesso foi em ' + req.cookies.dataUltimoAcesso);
        resp.write('</p>');
    }

    resp.write('</body>');
    resp.write('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>')
    resp.write('</html>');
    resp.end();
})

aplicacao.get('/listarPets', VerificarAutenticacao, (req, resp) => {
    resp.write('<html>');
    resp.write('<head>');
    resp.write('<title>Relação de Pets</title>');
    resp.write('<meta charset="utf-8">');
    resp.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">')
    resp.write('</head>');
    resp.write('<body>');
    resp.write('<h1>Lista de pets</h1>');
    resp.write('<table class="table table-striped">');
    resp.write('<tr>');
    resp.write('<th>Nome</th>');
    resp.write('<th>Raça</th>');
    resp.write('<th>Idade(em anos)</th>');
    resp.write('</tr>');
    for (let i = 0; i < listaPets.length; i++) {
        resp.write('<tr>');
        resp.write(`<td>${listaPets[i].nome}`);
        resp.write(`<td>${listaPets[i].raca}`);
        resp.write(`<td>${listaPets[i].idade}`);
        resp.write('</tr>');
    }
    resp.write('</table>');
    resp.write('<a href="/">Voltar</a>');
    resp.write('<br />');

    if (req.cookies.dataUltimoAcesso) {
        resp.write('<p>');
        resp.write('Seu último acesso foi em ' + req.cookies.dataUltimoAcesso);
        resp.write('</p>');
    }

    resp.write('</body>');
    resp.write('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>')
    resp.write('</html>');
    resp.end();
});

aplicacao.get('/listarInteressados', VerificarAutenticacao, (req, resp) => {
    resp.write('<html>');
    resp.write('<head>');
    resp.write('<title>Relação de interessados</title>');
    resp.write('<meta charset="utf-8">');
    resp.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">')
    resp.write('</head>');
    resp.write('<body>');
    resp.write('<h1>Lista de pessoas interessadas</h1>');
    resp.write('<table class="table table-striped">');
    resp.write('<tr>');
    resp.write('<th>Nome</th>');
    resp.write('<th>Email</th>');
    resp.write('<th>Telefone</th>');
    resp.write('</tr>');
    for (let i = 0; i < listaInteressados.length; i++) {
        resp.write('<tr>');
        resp.write(`<td>${listaInteressados[i].nome}`);
        resp.write(`<td>${listaInteressados[i].email}`);
        resp.write(`<td>${listaInteressados[i].telefone}`);
        resp.write('</tr>');
    }
    resp.write('</table>');
    resp.write('<a href="/">Voltar</a>');
    resp.write('<br />');

    if (req.cookies.dataUltimoAcesso) {
        resp.write('<p>');
        resp.write('Seu último acesso foi em ' + req.cookies.dataUltimoAcesso);
        resp.write('</p>');
    }

    resp.write('</body>');
    resp.write('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>')
    resp.write('</html>');
    resp.end();
});



aplicacao.get('/index', (req, resp) => {
    resp.redirect('/index.html');
});



aplicacao.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
})