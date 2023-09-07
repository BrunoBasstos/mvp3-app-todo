# ToDo App

Este é um MVP para conclusão da primeira sprint do curso de pós graduação em engenharia de software da PUC-Rio.

O ToDo App é uma aplicação em React que consome a ToDo API, uma aplicação Flask para gerenciamento de tarefas. A aplicação frontend fornece uma interface amigável e responsiva para o usuário interagir com a API, permitindo a visualização, criação, edição e exclusão de tarefas e suas respectivas prioridades. A autenticação de usuário é realizada através da API utilizando a biblioteca JWT para geração de tokens de acesso.

Este projeto é parte integrante do MVP desenvolvido durante a primeira sprint do curso de pós-graduação em Engenharia de Software pela PUC-Rio. Para mais informações sobre a API utilizada, consulte o repositório da [ToDo API](https://github.com/seu_usuario/seu_repositorio_api).

## Tecnologias utilizadas

- React
- Material-UI
- React Router
- Axios

## Como executar

1. Clone o repositório.
2. Instale as dependências do projeto com o comando `npm install` ou `yarn`.
3. Inicie a aplicação com o comando `npm start` ou `yarn start`.
4. Acesse a aplicação em `http://localhost:3000`.

## Como executar com Docker

1. Clone o repositório.
2. Execute o comando `docker build -t todo-app .` para criar a imagem do container.
4. Execute o comando `docker run --name todo-app -p 5000:5000 todo-app`.
    1. Note que isto criará um container com o nome todo-app. Para reiniciar a aplicação nas próximas vezes, basta executar o comando `docker start todo-app`. Caso você queira remover o container, execute `docker rm -f todo-app`.
4. Acesse a aplicação em `http://localhost:3000`.
5. Você poderá fazer um aesso inicial com o usuário `admin@mail.com` e senha `admin1234` ou registrar-se para iniciar como um usuário comum.

## Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- Node.js 12.x ou superior: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
- npm (geralmente já incluído com Node.js) ou Yarn: [https://yarnpkg.com/getting-started/install](https://yarnpkg.com/getting-started/install)

## Observações

Para utilizar o frontend, você deve ter a [ToDo API](https://github.com/seu_usuario/seu_repositorio_api) em execução e configurada corretamente.

## Contribuições

Contribuições são sempre bem-vindas! Se você deseja contribuir com este projeto, por favor, abra uma issue para discutir sua ideia antes de submeter um pull request.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
