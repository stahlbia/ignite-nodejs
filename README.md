# ignite-nodejs - DAILY DIET API
### Regras da aplicação

- [X] Deve ser possível criar um usuário
    - UUID
    - Usuário
    - Password
    - Email
    - Nome
    - URL da Foto
- [X] Deve ser possível identificar o usuário entre as requisições
- [X] Deve ser possível registrar uma refeição feita, com as seguintes informações:
    
    *As refeições devem ser relacionadas a um usuário.*
    
    - Nome
    - Descrição
    - Data e Hora
    - Está dentro ou não da dieta
- [X] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- [X] Deve ser possível apagar uma refeição
- [X] Deve ser possível listar todas as refeições de um usuário
- [X] Deve ser possível visualizar uma única refeição
- [ ] Deve ser possível recuperar as métricas de um usuário
    - Quantidade total de refeições registradas
    - Quantidade total de refeições dentro da dieta
    - Quantidade total de refeições fora da dieta
    - Melhor sequência de refeições dentro da dieta
- [ ] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou

### Contexto da aplicação

É comum ao estar desenvolvendo uma API, imaginar como esses dados vão estar sendo utilizados pelo cliente web e/ou mobile.

Por isso, deixamos abaixo o link para o layout da aplicação que utilizaria essa API.

[Daily Diet](https://www.figma.com/community/file/1218573349379609244)

##