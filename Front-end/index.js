const express = require("express");
const app = express();
const path = require("path");
const request = require("request")
//const sha1 = require("sha1")
const https = require("https")
var __dirname = path.resolve();
const bodyParser = require('body-parser')
const multer = require('multer')

const storage = multer.diskStorage({
  destination:(req,file,err)=>{
    err(null,'./View/src/imagens/')
  },
  filename:(req,file,err)=>{
    err(null,file.originalname)
  }
})

const upload = multer({storage})
app.engine("html",require("ejs").renderFile)
app.use(bodyParser.urlencoded({extended:false}))
//const bootstrap = require('bootstrap')
app.use(express.static(__dirname + "/View"));

app.get("/", function(req,res){
  res.render(__dirname+"/View/index.html")
});

app.get("/cardapio", function(req,res){
  let data = '';
  https.get("https://8z2l4y.sse.codesandbox.io/cardapio",(resp) =>{
    resp.on('data',(chunk) =>{
      data += chunk
    }) 
    resp.on('end',()=>{
      res.render(__dirname+"/View/cardapio.html",{cardapio:JSON.parse(data)})
    })
  }).on("error",(err) =>{
    console.log("Error: "+err.messagem)
  })  
});

app.get("/cardapio/:id", function(req,res){
  var id = req.params.id;
  let data = '';
  https.get("https://8z2l4y.sse.codesandbox.io/cardapio/"+id,(resp) =>{
    resp.on('data',(chunk) =>{
      data += chunk
    }) 
    resp.on('end',()=>{
      res.render(__dirname+"/View/cardapio.html",{cardapio:JSON.parse(data)})
    })
  }).on("error",(err) =>{
    console.log("Error: "+err.messagem)
  })
});

app.get("/cardapioAjax/:id", function(req,res){
  var id = req.params.id;
  let data = '';
  https.get("https://8z2l4y.sse.codesandbox.io/cardapioAjax/"+id,(resp) =>{
    resp.on('data',(chunk) =>{
      data += chunk
    }) 
    resp.on('end',()=>{
      res.send(JSON.parse(JSON.stringify(data)))
    })
  }).on("error",(err) =>{
    console.log("Error: "+err.messagem)
  })
});

app.get("/agendamento", function(req,res){
  res.render(__dirname+"/View/agendamento.html")
});

app.get("/cadastrar", function(req,res){
  res.render(__dirname+"/View/cadastrar.html")
});

/*app.get("/esqueciminhasenha", function(req,res){
  res.render(__dirname+"/View/esqueciminhasenha.html")
});*/

app.get("/cardapioAdm", function(req,res){
  let data = '';
  https.get("https://8z2l4y.sse.codesandbox.io/cardapio",(resp) =>{
    resp.on('data',(chunk) =>{
      data += chunk
    }) 
    resp.on('end',()=>{
      res.render(__dirname+"/View/cardapioAdm.html",{cardapio:JSON.parse(data)})
    })
  }).on("error",(err) =>{
    console.log("Error: "+err.messagem)
  })
});

app.post("/cadastrarCardapio",upload.single('imagem'),function(req,res){
  var tipo = req.body.tipo;
  var descricao = req.body.descricao;
  var valor = req.body.valor;
  var imagem = "src/imagens/"+req.file.filename;
  var nome = req.body.nomePrato;
  let data = '';
  const cardapio = {'tipo':tipo,
                    'descricao':descricao,
                    'valor':valor,
                    'imagem':imagem,
                    'nome':nome};
  var headersOpt = {  
    "content-type": "application/json",
  };
  request({
    method:'post',
    url:'https://8z2l4y.sse.codesandbox.io/cadastrarCardapio', 
    form: cardapio, 
    headers: headersOpt,
    json: true,
  }, 
  function (error, response, body) {  
    console.log(body);  
  }); 
  res.redirect("/cardapioAdm")
});

app.post("/alterarCardapio",upload.single('alterarImagem'),function(req,res){
  var tipo = req.body.alterarTipo;
  var descricao = req.body.alterarDescricao;
  var valor = req.body.alterarValor;
  var imagem = (req.file === undefined? null:"src/imagens/"+req.file.filename)
  console.log(imagem)
  var id = req.body.idCardapio
  var nome = req.body.AlterarPrato;
  let data = '';
  const cardapio = {'id':id,
                    'tipo':tipo,
                    'descricao':descricao,
                    'valor':valor,
                    'imagem':imagem,
                    'nome':nome};
  var headersOpt = {  
    "content-type": "application/json",
  };
  request({
    method:'put',
    url:'https://8z2l4y.sse.codesandbox.io/alterarCardapio', 
    form: cardapio, 
    headers: headersOpt,
    json: true,
  }, 
  function (error, response, body) {  
    console.log(body);  
  });
  res.redirect("/cardapioAdm")
})

app.get("/deletar/:id",function(req,res){
  var id = req.params.id;
  let data = '';
  var headersOpt = {  
    "content-type": "application/json",
  };
  request({
    method:'delete',
    url:'https://8z2l4y.sse.codesandbox.io/deletarCardapio', 
    form: {'id':id}, 
    headers: headersOpt,
    json: true,
  }, 
  function (error, response, body) {  
    console.log(body);  
  }); 
  res.redirect("/cardapioAdm")
})

app.post("/cadastrarUsuario", function(req,res){
  var email = req.body.Email;
  var senha = req.body.Senha;
  var nome = req.body.Nome;
  var perfil = 1;
  var cpf = req.body.CPF;
  var telefone = req.body.Telefone;
  var cep = req.body.CEP;
  var cidade = req.body.Cidade;
  var bairro = req.body.Bairro;
  var uf = req.body.UF;
  var logradouro = req.body.Logradouro;
  var complemento = req.body.Complemento;
  var numero = req.body.Numero;
  const novoUsuario = {'nome':nome,
                       'cpf':cpf,
                       'email':email,
                       'senha':senha,
                       'perfil':perfil,
                       'telefone':telefone,
                       'cep':cep,
                       'logradouro':logradouro,
                       'bairro':bairro,
                       'cidade':cidade,
                       'uf':uf,
                       'complemento':complemento,
                       'numero':numero};
  var headersOpt = {  
    "content-type": "application/json",
  };
  request({
    method:'post',
    url:'https://8z2l4y.sse.codesandbox.io/cadastrarUsuario', 
    form:novoUsuario,
    headers: headersOpt,
    json: true,
  },  
  function (error, response, body) {  
    console.log(body);  
  });
  console.log("(Replit) - Dados enviados para o back-end com sucesso. (CodeSandBox)");
  res.redirect("/")
})

app.get("/agendamentoAdm", function(req,res){
  let data = '';
  https.get("https://8z2l4y.sse.codesandbox.io/agendamentoAdm",(resp) =>{
    resp.on('data',(chunk) =>{
      data += chunk
    }) 
    resp.on('end',()=>{
      res.render(__dirname+"/View/agendamentoAdm.html",{agendamento:JSON.parse(data)})
    })
  }).on("error",(err) =>{
    console.log("Error: "+err.messagem)
  })
});

app.get("/agendamentoAjax/:id", function(req,res){
  var id = req.params.id;
  let data = '';
  https.get("https://8z2l4y.sse.codesandbox.io/agendamentoAjax/"+id,(resp) =>{
    resp.on('data',(chunk) =>{
      data += chunk
    }) 
    resp.on('end',()=>{
      res.send(JSON.parse(JSON.stringify(data)))
    })
  }).on("error",(err) =>{
    console.log("Error: "+err.messagem)
  })
});

app.post("/agendar",function(req,res){
  var cpf = req.body.cpf
  var dias = req.body.dias
  var turno = req.body.turno
  var observacao = req.body.observacao
  var entrega = req.body.entrega
  var valor = req.body.valorEnviar
  var dataPedido = req.body.dataPedido
  let arrayMarmitas = []
  var marmitas1 = ""
  var marmitas2 = ""
  var marmitas3 = ""
  if(req.body.marmitas1 != ""){
    marmitas1 = req.body.marmitas1
  }
   if(req.body.marmitas2 != ""){
   marmitas2 = req.body.marmitas2
  }
   if(req.body.marmitas3 != ""){
    marmitas3 = req.body.marmitas3
  }
  const agendamento = {'cpf':cpf,
                       'dias':dias,
                       'turno':turno,
                       'obervacao':observacao,
                       'entrega':entrega,
                       'valor':valor,
                       'marmitas1':marmitas1,
                       'marmitas2':marmitas2,
                       'marmitas3':marmitas3,
                       'dataPedido':dataPedido
                      };

var headersOpt = { "content-type": "application/json", };
   request({
    method:'post',
    url:'https://8z2l4y.sse.codesandbox.io/agendar', 
    form:agendamento,
    headers: headersOpt,
    json: true,
  },  
  function (error, response, body) {  
    console.log(body);  
  });
  
  res.redirect("/dadospedido?cpf="+cpf)
});

app.get("/usuarioAjax/:cpf", function(req,res){
  var cpf = req.params.cpf;
  let data = '';
  https.get("https://8z2l4y.sse.codesandbox.io/usuarioAjax/"+cpf,(resp) =>{
    resp.on('data',(chunk) =>{
      data += chunk
    }) 
    resp.on('end',()=>{
      res.send(JSON.parse(JSON.stringify(data)))
    })
  }).on("error",(err) =>{
    console.log("Error: "+err.messagem)
  })
});

app.get("/emailUser/:email", function(req,res){
  var email = req.params.email;
  let data = '';
  https.get("https://8z2l4y.sse.codesandbox.io/emailUser/"+email,(resp) =>{
    resp.on('data',(chunk) =>{
      data += chunk
    }) 
    resp.on('end',()=>{
      res.send(JSON.parse(JSON.stringify(data)))
    })
  }).on("error",(err) =>{
    console.log("Error: "+err.messagem)
  })
});

app.get("/marmitasAjax/:tipo", function(req,res){
  var tipo = req.params.tipo;
  let data = '';
  https.get("https://8z2l4y.sse.codesandbox.io/marmitasAjax/"+tipo,(resp) =>{
    resp.on('data',(chunk) =>{
      data += chunk
    }) 
    resp.on('end',()=>{
      res.send(JSON.parse(JSON.stringify(data)))
    })
  }).on("error",(err) =>{
    console.log("Error: "+err.messagem)
  })
});

app.get("/valorAjax/:marmitas/turno/:turno/dias/:dias", function(req,res){
  var marmitas = req.params.marmitas
  var turno = req.params.turno
  var dias = req.params.dias
  let data = '';
  https.get("https://8z2l4y.sse.codesandbox.io/valorAjax/"+marmitas,(resp) =>{
    resp.on('data',(chunk) =>{
      data += chunk
     }) 
    resp.on('end',()=>{
      res.send(JSON.parse(JSON.stringify(data)))
    })
  }).on("error",(err) =>{
    console.log("Error: "+err.messagem)
  })

});

app.post("/alterarStatus", function(req,res){
  console.log(req.body)
  var status = req.body.status;
  var idAgendamento = req.body.idAgendamento;
  const altStatus = {'idAgendamento':idAgendamento,
                     'status':status};
  var headersOpt = {  
    "content-type": "application/json",
  };
  request({
    method:'put',
    url:'https://8z2l4y.sse.codesandbox.io/alterarStatus', 
    form: altStatus, 
    headers: headersOpt,
    json: true,
  }, 
  function (error, response, body) {  
    console.log(body);  
  }); 
  res.redirect("/agendamentoAdm");
});

app.post("/alterarStatusUsu", function(req,res){
  console.log(req.body)
  var status = req.body.status;
  var idAgendamento = req.body.idAgendamento;
  const altStatus = {'idAgendamento':idAgendamento,
                     'status':status};
  var headersOpt = {  
    "content-type": "application/json",
  };
  request({
    method:'put',
    url:'https://8z2l4y.sse.codesandbox.io/alterarStatus', 
    form: altStatus, 
    headers: headersOpt,
    json: true,
  }, 
  function (error, response, body) {  
    console.log(body);  
  }); 
  res.redirect("/agendamento")
});

app.get("/dadospedido", function(req,res){
  var cpf = req.query.cpf;
  console.log(cpf)
  let data = '';
    https.get("https://8z2l4y.sse.codesandbox.io/dadospedido/"+cpf,(resp) =>{
      resp.on('data',(chunk) =>{
        data += chunk
    }) 
    resp.on('end',()=>{
      res.render(__dirname+"/View/agendamento.html",{agendamento:JSON.parse(data)})
    })
  }).on("error",(err) =>{
    console.log("Error: "+err.messagem)
  })
});

// http://knexjs.org/guide/#log
app.listen(process.env.port || 3000);