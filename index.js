const {ApolloServer} = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'}) 

const conectarDB = require('./config/db')

conectarDB();

const server = new ApolloServer({
     typeDefs, 
     resolvers,
     context: ({req}) => {
         // console.log(req.headers['authorization']);;
         const token= req.headers['authorization'] || '';
         

         if(token){
              try {
                   const usuario = jwt.verify(token.replace('Bearer ', ''), process.env.SECRETA)

                   console.log(usuario);
                    
                    if(!usuario)
                         return "usuario no atenticado"
                   return {
                        usuario
                   }


              } catch (error) {
                   
                   return "usuario no autenticado";
              }
         }

     }
});


server.listen({port: process.env.PORT || 4000}).then(({url})=>{
     console.log(`Servidor Listo en la URL ${url}`);
})