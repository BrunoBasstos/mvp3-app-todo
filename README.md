# ToDo App
![todo-app-diagrama](https://github.com/BrunoBasstos/mvp3-app-todo/assets/5402439/b7c54257-0f9c-45bf-9ff8-808677f1af28)

Este é um MVP para conclusão da terceira sprint do curso de pós graduação em engenharia de software da PUC-Rio.

O ToDo App é uma aplicação em React que consome a [ToDo API](https://github.com/BrunoBasstos/mvp3-api-todo), uma aplicação Flask para gerenciamento de tarefas, e a
[Bridge API](https://github.com/BrunoBasstos/mvp3-api-bridge), uma aplicação Flask que intermedia a comunicação com a [OpenWeather API](http://openweathermap.org) para
obtenção de nomes de cidades e de previsão do tempo. 

A aplicação frontend fornece uma interface amigável e responsiva
para o usuário interagir com a API, permitindo a visualização, criação, edição e exclusão de tarefas e suas respectivas
prioridades.

A autenticação de usuário é realizada através da API utilizando a biblioteca JWT para geração de tokens de
acesso.

Este projeto é a evolução do MVP desenvolvido durante a primeira sprint do curso de pós-graduação em Engenharia de
Software pela PUC-Rio. 

Para mais informações sobre as APIs utilizadas, consulte os repositórios
da [ToDo API](https://github.com/seu_usuario/seu_repositorio_api) e da [Bridge API](https://github.com/BrunoBasstos/mvp3-api-bridge).

## Tecnologias utilizadas

- React
- Material-UI
- React Router
- Axios

## Como executar

1. Clone o repositório.
2. Crie o arquivo .env usando o arquivo .env.example como base. 
3. Instale as dependências do projeto com o comando `npm install` ou `yarn`.
4. Inicie a aplicação com o comando `npm start` ou `yarn start`.
5. Acesse a aplicação em `http://localhost:3000`.

## Como executar com Docker

1. Clone o repositório.
2. Crie o arquivo .env usando o arquivo .env.example como base.
3. Execute o comando `docker build -t todo-app .` para criar a imagem do container.
4. Execute o comando `docker run --name todo-app -p 5000:5000 todo-app`.
    1. Note que isto criará um container com o nome todo-app. Para reiniciar a aplicação nas próximas vezes, basta
       executar o comando `docker start todo-app`. Caso você queira remover o container,
       execute `docker rm -f todo-app`.
5. Acesse a aplicação em `http://localhost:3000`.
6. Você poderá fazer um aesso inicial com o usuário `admin@mail.com` e senha `admin1234` ou registrar-se para iniciar
   como um usuário comum.

## Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- Node.js 12.x ou superior: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
- npm (geralmente já incluído com Node.js) ou
  Yarn: [https://yarnpkg.com/getting-started/install](https://yarnpkg.com/getting-started/install)

## Observações

Para utilizar o frontend, você deve ter a [ToDo API](https://github.com/BrunoBasstos/mvp3-api-todo) e a [Bridge API](https://github.com/BrunoBasstos/mvp3-api-bridge) em execução e
configuradas corretamente.

## Contribuições

Contribuições são sempre bem-vindas! Se você deseja contribuir com este projeto, por favor, abra uma issue para discutir
sua ideia antes de submeter um pull request.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
