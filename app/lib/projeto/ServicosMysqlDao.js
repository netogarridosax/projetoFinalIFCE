const Servico = require("./servico")
const bcrypt = require('bcrypt')

class ServicosMysqlDao {
    constructor(pool) {
        this.pool = pool;
    }
    listar(pagina) {
        return new Promise((resolve, reject) => {
            let limite="";
            if (pagina) {
                let offset= 3;
                let registrosPorPagina=3;
                limite=` limit ${offset}, ${registrosPorPagina}`
            }
            this.pool.query(`SELECT * FROM servicos${limite}`, function (error, linhas, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                let servicos = linhas /*.map(linha => {
                    let { id, nome, lado } = linha;
                    return new Servico(nome, lado, id);
                })*/
                resolve(servicos);
            });
        });
    }

    inserir(servico) {
        this.validar(servico);

        return new Promise((resolve, reject) => {
            let sql = 'INSERT INTO servicos (nome, descricao, quantidade) VALUES (?, ?, ?);';
            console.log({sql}, servico);
            this.pool.query(sql, [servico.nome, servico.descricao, servico.quantidade], function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.insertId);
            });
        });
    }

    alterar(id, servico) {
        this.validar(servico);
        return new Promise((resolve, reject) => {
            let sql = 'UPDATE servicos SET nome=?, autor=?, texto=? WHERE id=?;';
            this.pool.query(sql, [servico.data, servico.autor, servico.texto, id], function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.alterId);
            });
        });
    }
    

    apagar(id) {
        return new Promise((resolve, reject) => {
            let sql = 'DELETE FROM servicos WHERE id=?;';
            this.pool.query(sql, id, function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.deleteId);
            });
        });
    }

    validar(servico) {
        if (servico.data == '') {
            throw new Error('mensagem_data_em_branco');
        }
        if (servico.autor == '') {
            throw new Error('mensagem_autor_em_branco');
        }
        if (servico.texto == '') {
            throw new Error('mensagem_texto_em_branco');
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

module.exports = ServicosMysqlDao;