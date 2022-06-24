function quantidadeMarmitas(valor){
    var html = ""
    document.getElementById("divTipo1").innerHTML = ""
    document.getElementById("divTipo2").innerHTML = ""
    document.getElementById("divTipo3").innerHTML = ""
    document.getElementById("divMarmita1").innerHTML = ""
    document.getElementById("divMarmita2").innerHTML = ""
    document.getElementById("divMarmita3").innerHTML = ""
    
    html += '<label for="usuario" class="col-form-label">Tipo</label>'
    html += '<select class="form-select" name="tipo1" id="tipo1" required onchange="escolherMarmita(this.value,1)">'
    html += '<option selected  value="">Selecione</option>'
    html += '<option value="1">Fitness</option>'
    html += '<option value="2">Peixes</option>'
    html += '<option value="3">Veganos</option>'
    html += '<option value="4">Tradicional</option>'
    html += '<option value="5">Massas</option>'
    html += '</select></br>'
    document.getElementById("divTipo1").innerHTML = html
        html = '<label for="usuario" class="col-form-label">Marmitas</label>'
        html += '<select class="form-select" name="marmitas1" id="marmitas1" required onchange="recalcularValor()">'
        html += '<option value="">Selecione</option>'
        html += '</select></br>'
        document.getElementById("divMarmita1").innerHTML = html
        
    if(valor >= 5){
        html =  '<label for="usuario" class="col-form-label">Tipo</label>'
        html += '<select class="form-select" name="tipo2" id="tipo2" required onchange="escolherMarmita(this.value,2)">'
        html += '<option selected  value="">Selecione</option>'
        html += '<option value="1">Fitness</option>'
        html += '<option value="2">Peixes</option>'
        html += '<option value="3">Veganos</option>'
        html += '<option value="4">Tradicional</option>'
        html += '<option value="5">Massas</option>'
        html += '</select></br>'
        document.getElementById("divTipo2").innerHTML = html
        html =  '<label for="usuario" class="col-form-label">Marmitas</label>'
        html += '<select class="form-select" name="marmitas2" id="marmitas2"required  onchange="recalcularValor()">'
        html += '<option value="">Selecione</option>'
        html += '</select></br>'
        document.getElementById("divMarmita2").innerHTML = html
    }
  
    if(valor >= 7){
        html =  '<label for="usuario" class="col-form-label">Tipo</label>'
        html += '<select class="form-select" name="tipo3" id="tipo3" required onchange="escolherMarmita(this.value,3)">'
        html += '<option selected value="">Selecione</option>'
        html += '<option value="1">Fitness</option>'
        html += '<option value="2">Peixes</option>'
        html += '<option value="3">Veganos</option>'
        html += '<option value="4">Tradicional</option>'
        html += '<option value="5">Massas</option>'
        html += '</select></br>'
        document.getElementById("divTipo3").innerHTML = html
        html =  '<label for="usuario" class="col-form-label">Marmitas</label>'
        html += '<select class="form-select" name="marmitas3" id="marmitas3" required onchange="recalcularValor()">'
        html += '<option value="">Selecione</option>'
        html += ' </select></br>'
        document.getElementById("divMarmita3").innerHTML = html
  }
}

function escolherMarmita(tipo,div){
  var select = (div == 1 ? document.getElementById('marmitas1'):(div == 2 ? document.getElementById('marmitas2'):document.getElementById('marmitas3')));          
  let xhttp = new XMLHttpRequest();
  url = '/marmitasAjax/'+tipo;
  xhttp.open('GET',url,true);
  xhttp.onreadystatechange = () => {
    if(xhttp.readyState == 4 && xhttp.status == 200){
      var resposta = xhttp.responseText;
      var objeto = JSON.parse(resposta);
      select.options.length = 0;
      selectione = new Option('Selecione','');
      select.options[select.options.length] = selectione;
      objeto.forEach((opcoes)=>{
        option = new Option(opcoes.nome,opcoes.idCardapio);
        select.options[select.options.length] = option;
      })    
    }
  }
  xhttp.send()
}

function verificarUsuario(valor){
  var campoCPF = document.getElementById('cpf')
  var alerta  = document.getElementById('validacao')
  var agendar  = document.getElementById('agendar')
  let xhttp = new XMLHttpRequest();
  var url = '/usuarioAjax/'+valor;
  xhttp.open('GET',url,true);
  xhttp.onreadystatechange = () => {
    if(xhttp.readyState == 4 && xhttp.status == 200){
      var resposta =  xhttp.responseText;
      var objeto = JSON.parse(resposta);
      if(objeto.length == 0){
        campoCPF.focus()
        alerta.style.display = '';
        agendar.disabled = true
      }else{
        alerta.style.display = 'none';
        agendar.disabled = false
      }
    }
  }
  xhttp.send()
}

function calcularValor(){
  var dias = document.querySelector('input[name="dias"]:checked');
  var turno = document.getElementById('turno')
  let xhttp = new XMLHttpRequest();
  let arrayMarmitas = []
  var calculoValor = 0
  if(dias == null){
    document.querySelector('input[name="dias"]').focus()
    return false
  }
  if(turno.value == ""){
    turno.focus()
    return false
  }
  if(dias.value >= 3){
    if(document.getElementById("marmitas1").value == ""){
      document.getElementById("marmitas1").focus()
      return false
    }
  arrayMarmitas.push(document.getElementById("marmitas1").value)
  }
  if(dias.value >= 5){
    if(document.getElementById("marmitas2").value == ""){
      document.getElementById("marmitas2").focus()
      return false
    }
  arrayMarmitas.push(document.getElementById("marmitas2").value)
  }
  if(dias.value == 7){
    if(document.getElementById("marmitas3").value == ""){
      document.getElementById("marmitas3").focus()
      return false
    }
  arrayMarmitas.push(document.getElementById("marmitas3").value)
  }
  var valor = 0
  var url = '/valorAjax/'+arrayMarmitas+'/turno/'+turno.value+'/dias/'+dias.value;
  xhttp.open('GET',url,false);
  xhttp.onreadystatechange = () => {
    if(xhttp.readyState == 4 && xhttp.status == 200){
      var resposta =  xhttp.responseText;
      var objeto = JSON.parse(resposta);
      for(var i = 0; i < objeto.length;i++){
        valor += parseFloat(objeto[i].valor)
      }
    }
  }
  xhttp.send()
  turno = (turno.value == 1 || turno.value == 2?1:2)
  calcularValor = (valor*dias.value*turno)
  document.getElementById('valor').value = calcularValor
  document.getElementById('valorEnviar').value = calcularValor
}

function verificarFormulario(){
  var valor = document.getElementById("valor").value
  if(valor == ""){
    document.getElementById("butaoValor").focus()
    document.getElementById("validacaoNome").style.display = ""
    return false
  }
  document.getElementById("validacaoNome").style.display = "none"
  return true
}

function recalcularValor(){
  var valor =  document.getElementById("valor").value
    console.log(valorEnviar)
  if(valor == "" || valor == 0){
    console.log("entrou aqui")
    return false
  }
  document.getElementById("valor").value = ""
  document.getElementById("valorEnviar").value = ""
}

function veriCPF(valor){
  var campoCPF = document.getElementById('cpf')
  var alerta  = document.getElementById('validacao')
  var pesquisar  = document.getElementById('pesquisar')
  let xhttp = new XMLHttpRequest();
  var url = '/usuarioAjax/'+valor;
  xhttp.open('GET',url,true);
  xhttp.onreadystatechange = () => {
    if(xhttp.readyState == 4 && xhttp.status == 200){
      var resposta =  xhttp.responseText;
      var objeto = JSON.parse(resposta);
      if(objeto.length == 0){
        campoCPF.focus()
        alerta.style.display = '';
        pesquisar.disabled = true
      }else{
        alerta.style.display = 'none';
        pesquisar.disabled = false
      }
    }
  }
  xhttp.send()
}


function  detalharAgendamento(valor) {
  document.getElementById("idAgendamento").value = valor
  var url = '/agendamentoAjax/'+valor
  var tipoPrato = ''
  var quantidadeMarmitas = 0
  var  html = ""
  let xhttp = new XMLHttpRequest();
  xhttp.open('GET',url,false);
  xhttp.onreadystatechange = () => {
    if(xhttp.readyState == 4 && xhttp.status == 200){
      var resposta =  xhttp.responseText;
      var objeto = JSON.parse(resposta);
      console.log(objeto)
      for(var i = 0; i<objeto.length;i++){
        switch(objeto[i].tipoCardapio){
          case 1:
            tipoPrato = 'Fitness'
          break;
          case 2:
            tipoPrato = 'Peixes'
          break;
          case 3:
            tipoPrato = 'Veganos'
          break;
          case 4:
            tipoPrato = 'Tradicional'
          break;
          case 5:
            tipoPrato = 'Massas'
          break;
        }
        quantidadeMarmitas = (objeto[i].qntPratos == 1 ? 3:2)*(objeto[i].turno == 1 || objeto[i].turno == 2?1:2);
        html += '<strong>'+(i+1)+'ª Prato </strong></br>'
        html += '<label for="tipoPrato" class="col-form-label">Tipo do Prato: '+tipoPrato+'</label></br>'
        html += '<label for="nomeDoPrato" class="col-form-label">Nome do Prato: '+objeto[i].nomePrato+' </label></br>'
        html += '<label for="marmitas" class="col-form-label">Quantidade de Marmitas: '+quantidadeMarmitas+'</label></br>'
      }
      document.getElementById("divPrato").innerHTML = html
      document.getElementById("cpfUsuario").innerHTML = objeto[0].cpfUsuario
      //document.getElementById("dias").innerHTML = objeto[0].dias
      document.getElementById("nome").innerHTML = objeto[0].nome
      document.getElementById("telefone").innerHTML = objeto[0].telefone
      document.getElementById("email").innerHTML = objeto[0].email
      document.getElementById("cep").innerHTML = objeto[0].cep
      document.getElementById("logradouro").innerHTML = objeto[0].logradouro
      document.getElementById("bairro").innerHTML = objeto[0].bairro
      document.getElementById("cidade").innerHTML = objeto[0].cidade
      document.getElementById("uf").innerHTML = objeto[0].uf
      document.getElementById("complemento").innerHTML = objeto[0].complemento
      document.getElementById("numero").innerHTML = objeto[0].numero
      // document.getElementById("status").innerHTML = objeto[0].status
      document.getElementById("valor").innerHTML = objeto[0].valorTotal
    } 
  }
  xhttp.send();
 }

function buscaEnd(valor) {
  var url = 'https://viacep.com.br/ws/'+valor+'/json/'
  let xhttp = new XMLHttpRequest();
  xhttp.open('GET',url,false);
  xhttp.onreadystatechange = () => {
    if(xhttp.readyState == 4 && xhttp.status == 200){
      var resposta =  xhttp.responseText;
      var objeto = JSON.parse(resposta);
      document.getElementById('cidade').value = objeto.localidade
      document.getElementById('bairro').value = objeto.bairro.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
      document.getElementById('uf').value = objeto.uf.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
      document.getElementById('logradouro').value = objeto.logradouro.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
      document.getElementById('complemento').value = objeto.complemento
    } 
  }
  xhttp.send();   
}

function veriCpfCadastro(valor){
  var campoCPF = document.getElementById('cpf')
  var alerta  = document.getElementById('validacao')
  var botao = document.getElementById('continuar')
  let xhttp = new XMLHttpRequest();
  var url = '/usuarioAjax/'+valor;
  xhttp.open('GET',url,true);
  xhttp.onreadystatechange = () => {
    if(xhttp.readyState == 4 && xhttp.status == 200){
      var resposta = xhttp.responseText;
      var objeto = JSON.parse(resposta);
      if(objeto.length != 0){
        campoCPF.focus()
        alerta.style.display = '';
        botao.disabled = true
      }else{
        alerta.style.display = 'none';
        botao.disabled = false
      }
    }
  }
  xhttp.send()
}

function veriEmailCadastro(valor){
  var campoEmail = document.getElementById('email')
  var alerta = document.getElementById('validacao1')
  var botao = document.getElementById('continuar')
  let xhttp = new XMLHttpRequest();
  var url = '/emailUser/'+valor;
  xhttp.open('GET',url,true);
  xhttp.onreadystatechange = () => {
    if(xhttp.readyState == 4 && xhttp.status == 200){
      var resposta = xhttp.responseText;
      var objeto = JSON.parse(resposta);
      if(objeto.length != 0){
        campoEmail.focus()
        alerta.style.display = '';
        botao.disabled = true
      }else{
        alerta.style.display = 'none';
        botao.disabled = false
      }
    }
  }
  xhttp.send()
}

function validarSenha() {
  const senha = document.querySelector('input[name=Senha]');
  const senha2 = document.querySelector('input[name=confirmar_senha]');
  if (senha2.value === senha.value) {
    senha2.setCustomValidity('');
  } else {
    senha2.setCustomValidity('Senha são diferentes');
  }
}