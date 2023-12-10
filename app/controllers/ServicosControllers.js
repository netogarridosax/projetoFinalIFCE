const Servico = require('./../lib/projeto/servico');
const utils = require('../lib/utils');

class ServicosController {
    constructor(servicosDao) {
        this.servicosDao = servicosDao;
    }
    async index(req, res) {
        let servicos = await this.servicosDao.listar();
        utils.renderizarEjs(res, './views/index.ejs', {servicos});  

    }

    async pagina(req, res) {
        let [ url, queryString ] = req.url.split('?');
        console.log(url);
        let urlList = url.split('/');
        url = urlList[1];
        let pagina = urlList[2];

        let servicos = await this.servicosDao.listar(pagina);
        utils.renderizarEjs(res, './views/pagina.ejs', {servicos, pagina});  

    }

    async listar(req, res) {
        let servicos = await this.servicosDao.listar();
        console.log(servicos);       
        utils.renderizarEjs(res, './views/servicos.ejs', {servicos});  
    }

    async servicos(req, res) {
        let servicos = await this.servicosDao.listar();
        console.log(servicos); 
        utils.renderizarJSON(res, servicos);   
    }

    async inserir(req, res) {
        let servico = await this.getServicoDaRequisicao(req);
        console.log(servico);
        console.log('teste1');
        try {
            this.servicosDao.inserir(servico);
            utils.renderizarJSON(res, {
                servico,
                mensagem: 'mensagem_servico_cadastrado'
            });
        } catch (e) {
            utils.renderizarJSON(res, {
                mensagem: e.message
            }, 400);
        }
    }

    async alterar(req, res) {
        console.log('teste');
        let servico = await this.getServicoDaRequisicao(req);
        console.log(servico);
        let [ url, queryString ] = req.url.split('?');
        let urlList = url.split('/');
        url = urlList[1];
        let id = urlList[2];
        console.log(id);
        try {
            this.servicosDao.alterar(id, servico);
            utils.renderizarJSON(res, {
                mensagem: 'mensagem_servico_alterado'
            });
        } catch (e) {
            utils.renderizarJSON(res, {
                mensagem: e.message
            }, 400);
        }
    }
    
    apagar(req, res) {
        console.log('teste');
        let [ url, queryString ] = req.url.split('?');
        console.log(url);
        let urlList = url.split('/');
        url = urlList[1];
        let id = urlList[2];
        console.log(id);
        this.servicosDao.apagar(id);
        utils.renderizarJSON(res, {
            mensagem: 'mensagem_servico_apagado',
            id: id
        });
    }

    async getServicoDaRequisicao(req) {
        let corpo = await utils.getCorpo(req);
        console.log(corpo);
        let servico = new Servico(
            corpo.nome,
            corpo.descricao,
            corpo.quantidade
        );
        return servico;
    }
}

module.exports = ServicosController;