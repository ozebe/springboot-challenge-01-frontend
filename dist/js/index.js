import alert from "./alert.js";

var SERVER = 'localhost';
var PORT = '8080';

function addRowToTablePessoas(id, nome, cpf, datanascimento) {
    var pessoaPlaceHolder = document.querySelector('.table-pessoas-body');
    var wrapper = document.createElement('tr');

    wrapper.innerHTML = `
                  <th scope="row">${id}</th>
                  <td>${nome}</td>
                  <td>${cpf}</td>
                  <td>${new Date(datanascimento).toLocaleDateString()}</td>
                  <td><form class="form-calcula-peso-ideal" action="javascript:calculaPesoIdealPessoa(${id})"><input class="btn btn-info" type="submit" value="Calcular peso ideal"></form></td>
                  <td><form class="form-edita" action="javascript:editaPessoa(${id})"><input class="btn btn-warning" type="submit" value="Editar registro"></form></td>
                  <td><form class="form-exclui" action="javascript:excluiPessoa(${id})"><input class="btn btn-danger" type="submit" value="Excluir registro"></form></td>
                  `;

    pessoaPlaceHolder.append(wrapper);
}

async function carrregaDadosTabelaPessoas(nome = null) {
    alert('Carregando, aguarde... &#128564; &#128564;', 'warning');
    document.querySelector('.table-pessoas-body').innerHTML = "";
    try {
        let response = null;
        if(nome != null){
            response = await fetch(`http://${SERVER}:${PORT}/pessoas?nome=${nome}`, {
                method: 'GET', mode: 'cors',
                headers: { "Content-Type": "application/json" }
            });
        }else{
            response = await fetch(`http://${SERVER}:${PORT}/pessoas`, {
                method: 'GET', mode: 'cors',
                headers: { "Content-Type": "application/json" }
            });
        }

        const data = await response.json().then(data => {
            for (let pessoa of data.content) {
                document.getElementById('liveAlertPlaceholder').innerHTML = "";
                addRowToTablePessoas(pessoa.id, pessoa.nome, pessoa.cpf, pessoa.data_nasc);
            }
        });

    } catch (error) {
        console.error(error);
        alert(error, 'danger');
    }
}

window.excluiPessoa = async function (id) {
    if (window.confirm("Deseja realmente excluir o registro selecionado ?")) {
        alert('Carregando, aguarde... &#128564; &#128564;', 'warning');

        await fetch(`http://${SERVER}:${PORT}/pessoas/${id}`, {
            method: 'DELETE', mode: 'cors',
            headers: { "Content-Type": "application/json" }
        }).then(() => {
            document.location.reload(true);
        });
    }
}

window.calculaPesoIdealPessoa = async function (id) {
    alert('Carregando, aguarde... &#128564; &#128564;', 'warning');
    const pesoIdeal = await fetch(`http://${SERVER}:${PORT}/pessoas/pesoIdeal/${id}`, {
        method: 'GET',
        mode: 'cors',
        headers: { "Content-Type": "application/json" }
    });

    await pesoIdeal.json().then(data => {
        document.getElementById('liveAlertPlaceholder').innerHTML = "";
        alert('O peso ideal é ' + data.pesoIdeal + 'KG', 'success');
    });
}

window.editaPessoa = async function (id) {
    alert('Carregando, aguarde... &#128564; &#128564;', 'warning');

    var alertPlaceholder = document.getElementById('liveEdit')

    var wrapper = document.createElement('div')
    wrapper.innerHTML =
        `<form id="form-edita" action="javascript:salvaPessoaEditada(${id})">` +
        '<h4>Editar/Visualizar pessoa</h4>' +
        '<div class="form-group">' +
        '<label for="nomeEdit">Nome</label>' +
        '<input type="text" class="form-control" id="nomeEdit" aria-describedby="emailHelp" placeholder="Nome" required="true">' +
        '</div>' +
        '<br>' +
        '<div class="form-group">' +
        '<label for="cpfEdit">CPF</label>' +
        '<input type="number" class="form-control" id="cpfEdit" placeholder="CPF" required="true">' +
        '</div>' +
        '<br>' +
        '<div class="form-group">' +
        '<label for="dataNascimentoEdit">Data de nascimento</label>' +
        '<input type="date" class="form-control" id="dataNascimentoEdit" placeholder="Data de nascimento" required="true">' +
        '</div>' +
        '<br>' +
        '<div class="form-group">' +
        '<label for="pesoEdit">Peso em KG</label>' +
        '<input type="number" min="0" max="1000" step="0.1" class="form-control" id="pesoEdit"' +
        'placeholder="Peso em KG" required="true">' +
        '</div>' +
        '<br>' +
        '<div class="form-group">' +
        '<label for="alturaEdit">Altura em metros</label>' +
        '<input type="number" min="0" max="3" step="0.01" class="form-control" id="alturaEdit"' +
        'placeholder="Altura em metros" required="true">' +
        '</div>' +
        '<br>' +
        '<label for="sexoEdit">Sexo</label>' +
        '<select class="form-control" id="sexoEdit">' +
        '<option>Selecione</option>' +
        '<option>Masculino</option>' +
        '<option>Feminino</option>' +
        '</select>' +
        '<br>' +
        '<button type="submit" class="btn btn-primary">Salvar</button>' +
        '</form>'
    alertPlaceholder.innerHTML = ""; //apaga o anterior antes de colocar outro
    alertPlaceholder.append(wrapper);

    const response = await fetch(`http://${SERVER}:${PORT}/pessoas/${id}`, {
        method: 'GET', mode: 'cors',
        headers: { "Content-Type": "application/json" }
    });

    await response.json().then(data => {
        document.getElementById('liveAlertPlaceholder').innerHTML = "";    

        document.querySelector("#nomeEdit").setAttribute('value', data.nome);
        document.querySelector("#cpfEdit").setAttribute('value', data.cpf);
        document.querySelector("#dataNascimentoEdit").setAttribute('value', new Date(data.data_nasc).toISOString().split('T')[0]);
        document.querySelector("#pesoEdit").setAttribute('value', data.peso);
        document.querySelector("#alturaEdit").setAttribute('value', data.altura);
        data.sexo == "M" ? document.querySelector("#sexoEdit").selectedIndex = 1 : document.querySelector("#sexoEdit").selectedIndex = 2
    });

    


}

window.salvaPessoaEditada = async function (id) {
    alert('Carregando, aguarde... &#128564; &#128564;', 'warning');

    var nome = document.querySelector("#nomeEdit").value;
    var cpf = document.querySelector('#cpfEdit').value;
    var data_nasc = document.querySelector('#dataNascimentoEdit').value;
    var peso = document.querySelector('#pesoEdit').value;
    var altura = document.querySelector('#alturaEdit').value;
    var sexo = document.querySelector('#sexoEdit').selectedIndex;
    sexo == 1 ? sexo = "M" : sexo = "F";

    if (nome == '' || cpf == '' || data_nasc == '' || peso == '' || altura == '' || sexo == 'Selecione') {
        document.getElementById('liveAlertPlaceholder').innerHTML = "";
        alert('Verifique os dados', 'danger');
    } else {

        var novosDados = JSON.stringify({ nome: nome, cpf: cpf, data_nasc: data_nasc, peso: peso, altura: altura, sexo: sexo });

        const pessoaPUT = await fetch(`http://${SERVER}:${PORT}/pessoas/${id}`, { method: 'PUT', body: novosDados, mode: 'cors', headers: { "Content-Type": "application/json" } });

        const response = await pessoaPUT.status;
        switch (response) {
            case 200:
                document.getElementById('liveAlertPlaceholder').innerHTML = "";
                alert('Dados de ' + nome + ' atualizados!', 'success');
                var formEdita = document.getElementById('form-edita');
                formEdita.innerHTML = "";
                break;
            default:
                document.getElementById('liveAlertPlaceholder').innerHTML = "";
                alert("Ocorreu um erro! " + 'Cód: ' + response.erro, 'danger');
        }
    }


}

async function buscaPessoas() {
    var nomeBusca =document.querySelector("#busca").value;
    carrregaDadosTabelaPessoas(nomeBusca);

}
//assim que carregar...
window.onload = function () {
    carrregaDadosTabelaPessoas();

    document.getElementById('form-busca').addEventListener('submit', function(event){
        event.preventDefault();
        buscaPessoas();
      });
};
