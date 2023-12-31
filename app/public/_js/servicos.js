let traducoes = {
    'pt-BR': {
        'mensagem_senha_em_branco': 'A senha não pode ser em branco!',
        'mensagem_servico_cadastrado': 'Servico cadastrada com sucesso!',
        'mensagem_servico_apagado': 'Servico apagada com sucesso!'
    },
    'en': {
        'mensagem_senha_em_branco': 'Password cannot be empty!'
    }
}

async function inserir_() {
    /* alert('inserir'); */
    let nome = document.querySelector('[name=nome]').value;
    let descricao = document.querySelector('[name=descricao]').value;
    let quantidade = document.querySelector('[name=quantidade]').value;
    console.log('inserindo');
    let divResposta = document.querySelector('#resposta');
    let dados = new URLSearchParams({nome, descricao, quantidade});
    console.log(dados);
    let resposta = await fetch('servicos', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },   
        body: dados
    });
    if (resposta.status == 200) {
        divResposta.classList.add('padrao');
        divResposta.classList.remove('npadrao');
    }
    else {
        divResposta.classList.add('npadrao');
        divResposta.classList.remove('padrao');
    }
    let respostaJson = await resposta.json();
    let mensagem = respostaJson.mensagem;
    divResposta.innerText = traducoes['pt-BR'][mensagem];
}

async function listar_() {
    console.log('listando');
    let divServicos = document.querySelector('#servicos');
    divServicos.innerText = 'Carregando...'
    let resposta = await fetch('servico');
    let servicos = await resposta.json();
    divServicos.innerHTML = '';
    for (let servico of servicos) {
        let linha = document.createElement('tr');
        let colunaId = document.createElement('td');
        let colunaNome = document.createElement('td');
        let colunaServico = document.createElement('td');

        let colunaAcoes = document.createElement('td');
        let botaoEditar = document.createElement('button');
        let botaoApagar = document.createElement('button');
        colunaId.innerText = servico.id;
        colunaNome.innerText = servico.nome;
        colunaServico.innerText = servico.descricao;

           
        botaoEditar.innerText = 'Editar';
        botaoEditar.onclick = function () {
            editar(servico.id);
        }
        botaoApagar.onclick = function () {
            apagar(servico.id);
        }
        botaoApagar.innerText = 'Apagar';
        linha.appendChild(colunaId);
        linha.appendChild(colunaNome);
        linha.appendChild(colunaServico);
        linha.appendChild(colunaAcoes);
        colunaAcoes.appendChild(botaoEditar);
        colunaAcoes.appendChild(botaoApagar);

        divServicos.appendChild(linha);
    }
}

async function editar(id) {
    alert('editar' + id);
}

async function apagar(id) {
    let divResposta = document.querySelector('#resposta');
    if (confirm('Quer apagar o #' + id + '?')) {
        let resposta = await fetch('servicos/' + id, {
            method: 'delete',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        let respostaJson = await resposta.json();
        let mensagem = respostaJson.mensagem;
        divResposta.innerText = traducoes['pt-BR'][mensagem];
        listar();
    }
}

