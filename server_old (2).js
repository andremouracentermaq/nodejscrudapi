
//importar pacotes 
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Produto = require('./app/models/product');

//PERSISTÊNCIA
mongoose.connect('mongodb://localhost/bdCrud');

//Configurar a app para usar o body-parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Definindo a porta onde o servidor vai responder
var port = process.env.port || 8000;

//Definindo as rotas
var router = express.Router();//intercepta todas as rotas

//MIDDLEWARE
router.use(function(req,res,next){
    console.log("Interceptação pelo Middleware OK");
    next();
});

router.get('/', function(req, res){
    res.json({'message':'Ok, rota principal funcionando'});
});


router.route('/produtos')
    //POST para produtos (CREATE)
    .post(function(req,res){
        var produto = new Produto();
        produto.nome = req.body.nome;
        produto.preco = req.body.preco;
        produto.descricao = req.body.descricao;

        produto.save(function(error){
            if(error)
                res.send("Erro ao tentar salvar um novo produto"+ error);

            res.status(201).json({message:'produto inserido com sucesso'});    
        });
    })


//Vinculo da app com o motor de rotas
//Definindo uma rota padrão para as minhas apis
app.use('/api', router);

app.listen(port);
console.log("API up and running! on port " + port);
