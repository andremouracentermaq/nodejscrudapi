// importando pacotes 
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Produto = require('./app/models/products');

mongoose.connect('mongodb://localhost/bdcrud');

//configuração para a aplicação usar o body-parser
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


//difinição da porta de resposta do servidor
var port = process.env.port || 3000;

//definindo as rotas
var router = express.Router();// este metodo intercepta todas as requisições

//midleWare
router.use(function(req, res, next){
  
    next(); // continuação da API
});

router.get('/', function(req, res){
    
    res.json({
        "message" : "OK, Rota de teste funcionando"
    });
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
    
    .get(function(req, res){
        // Produto.find({}, 'descricao', function(err, prods){
        Produto.find(function(err, prods){
            if(err)
                res.send(err);
            
                res.status(200).json({
                    message : "Produtos buscados com sucesso",
                    listaProdutos : prods
                });
        })
    })
    

    router.route('/produtos/:productId')
        .get(function(req, res){
            const id = req.params.productId;
            Produto.findById(id, function(err, produto){
               if(err){
                   res.status(500).json({
                       message : "Erro ao tentar encontrar Produto, id mal formado"
                   });
               }else if(produto == null){
                  
                    res.status(400).json({
                        message : "Produto não encontrado"
                    });
               }else{
                   res.status(200).json({
                    message : "Produto localizado",
                    produto : produto
                   });
               }
            });
        })

        .put(function(req, res){

            const id = req.params.productId; 

            Produto.findById(id, function(err, produto){

                if(err){

                    res.status(500).json({
                        message : "Erro ao tentar encontrar Produto, id mal formado"
                    });

                }else if(produto == null){
                   
                     res.status(400).json({
                         message : "Produto não encontrado"
                     });

                }else{

                    produto.nome = req.body.nome;
                    produto.descricao = req.body.descricao;
                    produto.preco = req.body.preco;
                    
                    produto.save(function(error){

                        if(error){

                            res.send("Erro ao atualizar produto " + error);

                        }else{

                            res.status(200).json({
                                message : "Produto atualizao com sucesso !"                   
                               });

                        }
                    });

                    
                }
             });
        })
  
        //Arrow function
        .delete((req,res)=>{
            Produto.findByIdAndRemove(req.params.productId, (err, prod)=>{
                if(err){

                    return res.status(500).json({

                        message : "Erro ao tentar encontrar Produto, id mal formado"

                    });

                }else if(prod == null){
                   
                    return  res.status(400).json({

                         message : "Produto não encontrado"

                     });

                }else{

                    return res.status(200).json({

                        message : "Produto removido com sucesso com sucesso !", 

                        produto : prod.id                   
                    });

                    
                }
            });
        })
/*
        //formato tradicional
        .delete(function(req, res){

            const id = req.params.productId; 

            Produto.findByIdAndRemove(id, function(err, produto){

                if(err){

                    res.status(500).json({

                        message : "Erro ao tentar encontrar Produto, id mal formado"

                    });

                }else if(produto == null){
                   
                     res.status(400).json({

                         message : "Produto não encontrado"

                     });

                }else{

                    res.status(200).json({

                        message : "Produto removido com sucesso com sucesso !", 

                        produto : produto                   
                    });

                    
                }
             });

        })
*/


    

//faz o vinculo da aplicação (app) com o motor de rotas
app.use('/api', router);



app.listen(port);
console.log("API Server is running on port " + port);


