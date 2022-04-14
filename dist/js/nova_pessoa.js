import alert from "./alert.js";

var SERVER = 'springboot-challenge-01-api.herokuapp.com';
var PORT = '8080';

async function salvaPessoa(){
    var nome = document.querySelector("#nome").value;
    var cpf = document.querySelector("#cpf").value;
    var data_nasc  = document.querySelector("#data_nasc").value;
    var peso = document.querySelector("#peso").value;
    var altura = document.querySelector("#altura").value;
    var sexo = document.querySelector("#sexo").value;
    if(sexo = 'Masculino'){
        sexo = 'M';
    }else{
        sexo = 'F';
    }

    if(nome == '' || cpf == '' || data_nasc == '' || peso == '' || altura == '' || sexo == 'Selecione'){
        alert('Verifique os dados', 'danger');
    }else{
        var dados = JSON.stringify({nome: nome, cpf: cpf, data_nasc: data_nasc, peso: peso, altura: altura, sexo: sexo});
        const pessoaPOST = await fetch(`https://${SERVER}/pessoas`, {
            method: 'POST',
            body: dados,
            mode: 'cors',
            headers: {"Content-Type": "application/json"}
        });
       
         console.log(pessoaPOST);
        const response = await pessoaPOST.json();
        
        switch(response.erro){
            case undefined:
                alert(nome + ' inserido!', 'success');
                document.querySelector("#nome").value = '';
                document.querySelector("#cpf").value = '';
                document.querySelector("#data_nasc").value = '';
                document.querySelector("#peso").value = '';
                document.querySelector("#altura").value = '';
                document.querySelector("#sexo").value = 'Selecione';
                break;
            default: 
                alert("Ocorreu um erro! " + 'Cód: ' +response.erro, 'danger');
        }
    }
}

//assim que carregar...
window.onload = function() {
    document.getElementById('form-salva').addEventListener('submit', function(event){
        event.preventDefault()
        salvaPessoa();
      });
  };
