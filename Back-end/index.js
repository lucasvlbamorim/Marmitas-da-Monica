const express = require("express");
const app = express();
const path = require("path");
var __dirname = path.resolve();
const dayjs = require("dayjs");
app.engine("html", require("ejs").renderFile);
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

const mysql = require("mysql");
const sha1 = require("sha1");
//create a server object:
const connection = mysql.createConnection({
  host: "31.170.160.52",
  user: "u825179380_QroXw",
  password: "Aulabanco123@",
  database: "u825179380_ab2co",
  port: "3306"
});

app.get("/", (req, res) => {
  connection.query("select * from usuario", function (erro, linhas, colunas) {
    if (erro) {
      console.log(erro.message);
    }
    //res.render(__dirname+"/views/listar.html")
    var resposta = JSON.parse(JSON.stringify(linhas));
    res.send(resposta);
  });
});

app.post("/cadastrarCardapio", (req, res) => {
  let today = dayjs();
  var tipo = req.body.tipo;
  var descricao = req.body.descricao;
  var valor = req.body.valor;
  var imagem = req.body.imagem;
  var nome = req.body.nome;
  var data = today.format("YYYY-MM-DD h:mm:ss").toString();

  var novoCadastro = {
    descricao: descricao,
    valor: valor,
    dataCriacao: data,
    tipo: tipo,
    imagem: imagem,
    nome: nome
  };

  connection.query("insert into Cardapio set ?", novoCadastro, function (
    erro,
    respo
  ) {
    if (erro) {
      console.log(erro.stack);
    }
    var resposta = JSON.parse(
      JSON.stringify({ msg: "Cadastro efetuado com sucesso" })
    );
    res.send(resposta);
  });
}); //the server object listens on port 8080

app.get("/cardapio", (req, res) => {
  connection.query("select * from Cardapio", function (erro, linhas, colunas) {
    if (erro) {
      console.log(erro.message);
    } else {
      //res.render(__dirname+"/views/listar.html")
      var resposta = JSON.parse(JSON.stringify(linhas));
      res.send(resposta);
    }
  });
});

app.get("/cardapio/:id", (req, res) => {
  var id = req.params.id;
  connection.query("select * from Cardapio where tipo = ?", [id], function (
    erro,
    linhas,
    colunas
  ) {
    if (erro) {
      console.log(erro.message);
    }
    //res.render(__dirname+"/views/listar.html")
    var resposta = JSON.parse(JSON.stringify(linhas));
    res.send(resposta);
  });
});

app.get("/cardapioAjax/:id", (req, res) => {
  var id = req.params.id;
  connection.query(
    "select * from Cardapio where idCardapio = ?",
    [id],
    function (erro, linhas, colunas) {
      if (erro) {
        console.log(erro.message);
      }
      //res.render(__dirname+"/views/listar.html")
      var resposta = JSON.parse(JSON.stringify(linhas));
      res.send(resposta);
    }
  );
});

app.delete("/deletarCardapio", (req, res) => {
  var id = req.body.id;
  connection.query("DELETE FROM Cardapio Where idCardapio = ?", [id], function (
    err,
    result
  ) {
    console.log(result);
  });

  var resposta = JSON.parse(
    JSON.stringify({ msg: "Cadastro deletado com sucesso" })
  );
  res.send(resposta);
});

app.put("/alterarCardapio", (req, res) => {
  var id = req.body.id;
  var tipo = req.body.tipo;
  var descricao = req.body.descricao;
  var valor = req.body.valor;
  var nome = req.body.nome;
  var imagem = req.body.imagem;
  var query =
    imagem === ""
      ? "UPDATE Cardapio SET descricao = ?, valor = ?,tipo = ?,nome = ? WHERE idCardapio = ?"
      : "UPDATE Cardapio SET descricao = ?, valor = ?,tipo = ? , imagem = ?,nome = ? WHERE idCardapio = ?";
  var valores =
    imagem === ""
      ? [descricao, valor, tipo, nome, id]
      : [descricao, valor, tipo, imagem, nome, id];
  connection.query(query, valores, function (erro, result) {
    if (erro) {
      console.log(erro);
    }
    var resposta = JSON.parse(
      JSON.stringify({ msg: "Cadastro alterado com sucesso" })
    );
    res.send(resposta);
  });
});

//codesandbox.io node
app.post("/cadastrarUsuario", (req, res) => {
  var nome = req.body.nome;
  var cpf = req.body.cpf;
  var senha = req.body.senha;
  var email = req.body.email;
  var perfil = req.body.perfil;
  var telefone = req.body.telefone;
  var cep = req.body.cep;
  var cidade = req.body.cidade;
  var bairro = req.body.bairro;
  var uf = req.body.uf;
  var logradouro = req.body.logradouro;
  var complemento = req.body.complemento;
  var numero = req.body.numero;

  var novoUsuario = {
    nome: nome,
    cpf: cpf,
    senha: senha,
    email: email,
    perfil: perfil,
    telefone: telefone,
    cep: cep,
    logradouro: logradouro,
    bairro: bairro,
    cidade: cidade,
    uf: uf,
    complemento: complemento,
    numero: numero
  };

  connection.query("insert into usuarioCardapio set ?", novoUsuario, function (
    erro,
    respo
  ) {
    if (erro) {
      console.log(erro.stack);
    }
    var resposta = JSON.parse(JSON.stringify({ msg: "Usuario Cadastrado." }));
    res.send(resposta);
  });
});

app.get("/agendamentoAdm", (req, res) => {
  connection.query("select * from Agendamento", function (
    erro,
    linhas,
    colunas
  ) {
    if (erro) {
      console.log(erro.message);
    } else {
      //res.render(__dirname+"/views/listar.html")
      var resposta = JSON.parse(JSON.stringify(linhas));
      res.send(resposta);
    }
  });
});

app.post("/agendar", (req, res) => {
  var cpf = req.body.cpf;
  var dias = req.body.dias;
  var turno = req.body.turno;
  var observacao = req.body.observacao;
  var entrega = req.body.entrega;
  var valor = req.body.valor;
  var dataEntrega = req.body.dataPedido;
  let today = dayjs();
  var data = today.format("YYYY-MM-DD h:mm:ss").toString();
  var marmitas = [];
  console.log(req.body);
  console.log(
    req.body.marmitas1 + " - " + req.body.marmitas2 + " - " + req.body.marmitas3
  );
  if (typeof req.body.marmitas1 !== "undefined") {
    marmitas.push(req.body.marmitas1);
  }

  if (typeof req.body.marmitas2 !== "undefined") {
    marmitas.push(req.body.marmitas2);
  }

  if (typeof req.body.marmitas3 !== "undefined") {
    marmitas.push(req.body.marmitas3);
  }

  dataEntrega = dataEntrega.replace(" ", "/");
  var dia = dataEntrega.split("/")[0];
  var mes = dataEntrega.split("/")[1];
  var ano = dataEntrega.split("/")[2];
  var horas = dataEntrega.split("/")[3];
  dataEntrega = ano + "-" + mes + "-" + dia + " " + horas;
  var qtdMarmitas = dias * (turno === "1" || turno === "2" ? 1 : 2);

  var agendamento = {
    dias: dias,
    turno: turno,
    valor: valor,
    observacao: observacao,
    marmitas: qtdMarmitas,
    dataEntrega: dataEntrega,
    dataPedido: data,
    status: 0,
    entrega: entrega
  };
  console.log(marmitas);
  connection.query("insert into Agendamento set ?", agendamento, function (
    erro,
    respo
  ) {
    if (erro) {
      console.log(erro.stack);
    }
    console.log(marmitas.length);
    for (var i = 0; i < marmitas.length; i++) {
      var tipo = i == 0 ? 1 : 2;
      connection.query(
        "insert into sacola value (" + respo.insertId + ",?,?,?)",
        [marmitas[i], cpf, tipo],
        function (erro, respo) {
          if (erro) {
            console.log(erro.stack);
          }

          var resposta = JSON.parse(
            JSON.stringify({ msg: "Usuario Cadastrado." })
          );
          console.log(resposta);
        }
      );
    }
  });
  var resposta = JSON.parse(JSON.stringify({ msg: "Usuario Cadastrado." }));
  res.send(resposta);
});

app.get("/agendamentoAjax/:id", (req, res) => {
  var id = req.params.id;
  connection.query(
    "Select s.idAgendamento, s.idCardapio, s.cpfUsuario, s.tipo as 'qntPratos', a.turno, a.status, a.dias, a.entrega, a.valor as 'valorTotal', a.marmitas, a.dataPedido, a.dataEntrega, u.nome, u.email, u.telefone, u.cep, u.logradouro, u.bairro, u.cidade, u.uf, u.complemento, u.numero, c.descricao, c.valor, c.tipo as 'tipoCardapio', c.nome as 'nomePrato' from sacola as s inner join Agendamento as a on (a.idAgendamento = s.idAgendamento) inner join usuarioCardapio as u on (u.cpf = s.cpfUsuario) inner join Cardapio as c on (c.idCardapio = s.idCardapio) where s.idAgendamento = ?",
    [id],
    function (erro, linhas, colunas) {
      if (erro) {
        console.log(erro.message);
      }
      //res.render(__dirname+"/views/listar.html")
      var resposta = JSON.parse(JSON.stringify(linhas));
      res.send(resposta);
    }
  );
});

app.get("/usuarioAjax/:cpf", (req, res) => {
  var cpf = req.params.cpf;
  connection.query(
    "select cpf from usuarioCardapio where cpf = ?",
    [cpf],
    function (erro, linhas, colunas) {
      if (erro) {
        console.log(erro.message);
      }
      //res.render(__dirname+"/views/listar.html")
      var resposta = JSON.parse(JSON.stringify(linhas));
      res.send(resposta);
    }
  );
});

app.get("/emailUser/:email", (req, res) => {
  var email = req.params.email;
  connection.query(
    "select email from usuarioCardapio where email = ?",
    [email],
    function (erro, linhas, colunas) {
      if (erro) {
        console.log(erro.message);
      }
      //res.render(__dirname+"/views/listar.html")
      var resposta = JSON.parse(JSON.stringify(linhas));
      console.log(resposta);
      res.send(resposta);
    }
  );
});

app.get("/marmitasAjax/:tipo", (req, res) => {
  var tipo = req.params.tipo;
  connection.query(
    "select idCardapio, nome from Cardapio where tipo = ?",
    [tipo],
    function (erro, linhas, colunas) {
      if (erro) {
        console.log(erro.message);
      }
      //res.render(__dirname+"/views/listar.html")
      var resposta = JSON.parse(JSON.stringify(linhas));
      res.send(resposta);
    }
  );
});

app.get("/valorAjax/:marmitas", (req, res) => {
  var stringMarmitas = req.params.marmitas;
  var arrayMarmitas = stringMarmitas.split(",");
  var marmita1 = arrayMarmitas[0];
  var marmita2 = arrayMarmitas[1];
  var marmita3 = arrayMarmitas[2];

  connection.query(
    "select valor from Cardapio where idCardapio = ? or idCardapio = ? or idCardapio = ?",
    [marmita1, marmita2, marmita3],
    function (erro, linhas, colunas) {
      if (erro) {
        console.log(erro.message);
      }
      //res.render(__dirname+"/views/listar.html")
      var resposta = JSON.parse(JSON.stringify(linhas));
      res.send(resposta);
    }
  );
});

app.put("/alterarStatus", (req, res) => {
  var status = req.body.status;
  var id = req.body.idAgendamento;

  var sql = "UPDATE Agendamento SET status = ? WHERE idAgendamento = ?";
  var valores = [status, id];

  connection.query(sql, valores, function (erro, result) {
    if (erro) {
      console.log(erro);
    }
    var resposta = JSON.parse(
      JSON.stringify({ msg: "Status alterado com sucesso" })
    );
    res.send(resposta);
  });
});

app.get("/dadospedido/:cpf", (req, res) => {
  var cpf = req.params.cpf;
  connection.query(
    "Select a.idAgendamento,s.tipo as 'qntPratos', a.turno, a.status, a.dias, a.entrega, a.valor as 'valorTotal', a.marmitas, a.dataPedido, a.dataEntrega, u.nome, u.email, u.telefone, u.cep, u.logradouro, u.bairro, u.cidade, u.uf, u.complemento, u.numero, c.descricao, c.valor, c.tipo as 'tipoCardapio', c.nome as 'nomePrato' from sacola as s inner join Agendamento as a on (a.idAgendamento = s.idAgendamento) inner join usuarioCardapio as u on (u.cpf = s.cpfUsuario) inner join Cardapio as c on (c.idCardapio = s.idCardapio) where s.cpfUsuario = ? GROUP BY s.idAgendamento",
    [cpf],
    function (erro, linhas, colunas) {
      if (erro) {
        console.log(erro.message);
      }
      //res.render(__dirname+"/views/listar.html")
      var resposta = JSON.parse(JSON.stringify(linhas));

      res.send(resposta);
    }
  );
});

app.listen(process.env.port || 3000);
