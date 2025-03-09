Exemplos postman
GET:
http://localhost:3000/users
---------------------------------
POST:
http://localhost:3000/users
Adicionar no body:
{
    "nome": "Alex Teste",
    "email": "alex@teste.com"
}
----------------------------------
PUT
http://localhost:3000/users/1 (1 é o ID do usuário cadastrado)
Adicionar no body:
{
    "nome": "Alex Teste modificado",
    "email": "alex@testemodificado.com"
}
----------------------------------
DELETE:
http://localhost:3000/users/1 (1 é o ID do usuário cadastrado)
----------------------------------
