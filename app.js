const http = require('http');
const ServicosController = require('./controllers/ServicosControllers');
const EstaticoController = require('./controllers/EstaticoController');
const AutorController = require('./controllers/AutorController');
const AuthController = require('./controllers/AuthController');
const ServicosDao = require('./lib/projeto/ServicosDao');
const UsuariosController = require('./controllers/UsuariosControllers');
const UsuariosDao = require('./lib/projeto/UsuariosDao');
const ServicosMysqlDao = require('./lib/projeto/ServicosMysqlDao');
const UsuariosMysqlDao = require('./lib/projeto/UsuariosMysqlDao');
const mysql = require('mysql');

const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'bd',
    user            : process.env.MARIADB_USER,
    password        : process.env.MARIADB_PASSWORD,
    database        : process.env.MARIADB_DATABASE
});

let servicosDao = new ServicosMysqlDao(pool);
let usuariosDao = new UsuariosMysqlDao(pool);
let servicosController = new ServicosController(servicosDao);
let estaticoController = new EstaticoController();
let autorController = new AutorController();
let authController = new AuthController(usuariosDao);
let usuariosController = new UsuariosController(usuariosDao);

const PORT = 3000;
const server = http.createServer((req, res) => {
    let [url, querystring] = req.url.split('?');
    let urlList = url.split('/');
    url = urlList[1];
    let metodo = req.method;

    if (url=='index') {
        servicosController.index(req, res);
    }
    
    else if (url == 'servicos' && metodo == 'GET') {
        servicosController.listar(req, res);
    }

    else if (url == 'servico' && metodo == 'GET') {
        servicosController.servicos(req, res);
    }

    else if (url == 'pagina' && metodo == 'GET') {
        servicosController.pagina(req, res);
    }
    else if (url == 'servicos' && metodo == 'POST') {
        servicosController.inserir(req, res);
    }
    
    else if (url == 'servicos' && metodo == 'PUT') {
        servicosController.alterar(req, res);
    }
    
    else if (url == 'servicos' && metodo == 'DELETE') {
        servicosController.apagar(req, res);
        }

    else if (url == 'usuarios' && metodo == 'GET') {
        usuariosController.listar(req, res);
    }
    else if (url == 'usuarios' && metodo == 'POST') {
        usuariosController.inserir(req, res);
    }
    else if (url == 'usuarios' && metodo == 'PUT') {
        authController.autorizar(req, res, function() {
            usuariosController.alterar(req, res);
        }, ['admin', 'geral']);
    }
    else if (url == 'usuarios' && metodo == 'DELETE') {
        authController.autorizar(req, res, function() {
            usuariosController.apagar(req, res);
        }, ['admin']);
    }

    else if (url=='autor') {
        autorController.autor(req, res);    
    }

    else if (url=='carreira') {
        estaticoController.carreira(req, res);    
    }

    else if (url=='contate') {
        estaticoController.contate(req, res);    
    }
    
    else if (url=='admin') {
        authController.admin(req, res);    
    }

    else if (url == 'login') {
        authController.index(req, res);
    }
    else if (url == 'logar') {
        authController.logar(req, res);
    }    
    else {
        estaticoController.procurar(req, res);   
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});