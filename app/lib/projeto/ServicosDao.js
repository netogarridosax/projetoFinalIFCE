const Servico = require("./servico")
const bcrypt = require('bcrypt')

class ServicosDao {
    constructor() {
        this.servicos = [];
    }
    listar() {
        return this.servicos;
    }

    inserir(servico) {
        this.validar(servico);
        this.servicos.push(servico);
    }

    alterar(id, servico) {
        this.validar(servico);
        this.servicos[id] = servico;
    }

    apagar(id) {
        this.servicos.splice(id, 1);
    }

    validar(servico) {
        if (servico.nome == '') {
            throw new Error('mensagem_nome_em_branco');
        }
        if (servico.lado < 0) {
            throw new Error('mensagem_tamanho_invalido');
        }
    }
    autenticar(nome, senha) {
        for (let servico of this.listar()) {
            if (servico.nome == nome && bcrypt.compareSync(senha, servico.senha)) {
                return servico;
            }
        }
        return null;
    }

}

module.exports = ServicosDao;