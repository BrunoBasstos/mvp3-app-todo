# ToDo App
![todo-app-diagrama](https://github.com/BrunoBasstos/mvp3-app-todo/assets/5402439/5dbce2ab-44c1-40ba-9b06-e311e0c5cdc2)

Este é um MVP para conclusão da terceira sprint do curso de pós graduação em engenharia de software da PUC-Rio.

O ToDo App é uma aplicação em React que consome a [ToDo API](https://github.com/BrunoBasstos/mvp3-api-todo), uma
aplicação Flask para gerenciamento de tarefas, e a
[Bridge API](https://github.com/BrunoBasstos/mvp3-api-bridge), uma aplicação Flask que intermedia a comunicação com
a [OpenWeather API](http://openweathermap.org) para
obtenção de nomes de cidades e de previsão do tempo.

Além de interagir com as APIs mencionadas, o ToDo App também consome diretamente as
APIs [AdviceSlip](https://api.adviceslip.com/) e [MyMemory](https://mymemory.translated.net/doc/spec.php) para obtenção
de frases motivacionais aleatórias e tradução destas frases, respectivamente.

As rotas implementadas para a **AdviceSlip API** e para a **MyMemory API** são as seguintes:

- `GET https://api.adviceslip.com/advice`: retorna uma frase motivacional aleatória em inglês.
- `GET https://api.mymemory.translated.net/get?langpair=en|pt-br&{query}`: retorna a tradução da query
  recebida como parâmetro.

O objetivo do ToDo App é fornecer uma interface amigável e responsiva para o usuário interagir com as APIs, permitindo a
visualização, criação, edição e exclusão de tarefas, além de permitir a visualização da previsão do tempo para uma
cidade escolhida pelo usuário ao
cadastrar uma tarefa e a visualização de frases motivacionais aleatórias.

Este projeto é a evolução do MVP desenvolvido durante a primeira sprint do curso de pós-graduação em Engenharia de
Software pela PUC-Rio.

Para mais informações sobre as APIs utilizadas, consulte os respectivos repositórios ou sites:

- [ToDo API](https://github.com/BrunoBasstos/mvp3-api-todo)
- [Bridge API](https://github.com/BrunoBasstos/mvp3-api-bridge)
- [OpenWeather API](http://openweathermap.org/api)
- [AdviceSlip API](https://api.adviceslip.com/)
- [MyMemory API](https://mymemory.translated.net/doc/spec.php)

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

Para utilizar o frontend, você deve ter a [ToDo API](https://github.com/BrunoBasstos/mvp3-api-todo) e
a [Bridge API](https://github.com/BrunoBasstos/mvp3-api-bridge) em execução e configuradas corretamente.

## Contribuições

Contribuições são sempre bem-vindas! Se você deseja contribuir com este projeto, por favor, abra uma issue para discutir
sua ideia antes de submeter um pull request.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
