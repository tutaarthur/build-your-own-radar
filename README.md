[![Build Status](https://travis-ci.org/thoughtworks/build-your-own-radar.svg?branch=master)](https://travis-ci.org/thoughtworks/build-your-own-radar)

Uma biblioteca que gera um radar interativo, inspirado por [thoughtworks.com/radar](http://thoughtworks.com/radar).

## Como usar

O modo mais fácil de utilizar esta aplicação é fornecer uma Planilha Google *publicada*, obedecendo as restrições abaixo.

### Montando seus dados

Você precisa publicar seus dados para que o radar consiga ler e plotar.


Em relação às restrições, sua tabela deve ter as seguintes colunas:

| name          | ring   | quadrant               | maturity | visible | description                                             |
|---------------|--------|------------------------|----------|---------|---------------------------------------------------------|
| Composer      | Adotar  | Ferramentas                  |    1     |   TRUE  |Although the idea of dependency management ...          |
| Canary builds | Avaliar  | Técnicas             |    2     |   TRUE  |Many projects have external code dependencies ...       |
| Apache Kylin  | Experimentar | Plataformas              |    3     |   FALSE |Apache Kylin is an open source analytics solution ...   |
| JSF           | Adotar   | Linguagens & Frameworks |    4     |   TRUE  |We continue to see teams run into trouble using JSF ... |

* Nome: Pode conter qualquer frase, correspondente ao nome da tecnologia.
* Ring: Deve conter 4 valores diferentes, normalmente utilizados os valores de Evitar, Avaliar, Experimentar e Adotar.
* Quadrant: Deve conter 4 valores difrentes, normalmente categorizando a tecnologia, como ferramenta, técnica, plataforma e linguagens & frameworks.
* Maturity: Deve conter um número de 1 a 4, especificando a maturidade da implementação daquela tecnologia.
* Visible: Recebe valores booleanos, estabelecendo as tecnologias que serão plotadas no radar.
* Description: Descrição geral de cada uma.


Atenção: as linhas das colunas Quadrant e Ring são transformadas em maiúsculas, portanto não se preocupe em formatá-las.


### Publicando a Planilha

* Na sua planilha, vá em 'Arquivo', escolha 'Publicar na Web...' e clique click 'Publicar'.
* Copie a URL da tabela do seu navegador (Não se preocupe, a publicação da planilha não a torna editável para todos).

A URL será parecida com [https://docs.google.com/spreadsheets/d/1waDG0_W3-yNiAaUfxcZhTKvl7AUCgXwQw8mdPjCz86U/edit](https://docs.google.com/spreadsheets/d/1waDG0_W3-yNiAaUfxcZhTKvl7AUCgXwQw8mdPjCz86U/edit). A única parte que importa para a aplicação executar devidamente é a parte entre '/d/' e '/edit', mas isso é tratado automaticamente.

### Montando seu radar

Depois de copiar a URL da sua planilha, só colá-la na caixa de texto da página inicial e clicar no botão para gerar.

Nota: a ordem dos Quadrants e dos Rings será especificada pela mesma ordem que se encontram na planilha.


## Executando

Pull requests are welcome; please write tests whenever possible. 
Make sure you have nodejs installed.

- `git clone git@github.com:tuaarthur/build-your-own-radar.git`
- `npm install`- instalando as dependências do pacote
- `npm run dev` - para executar a aplicação no endereço localhost:8080.

### Caso não tenha Node.JS instalado e prefira utilizar o docker

     $ docker run -p 8080:8080 -v $PWD:/app -w /app -it node:7.3.0 /bin/sh -c 'npm install && npm run dev'

Depois de criado o container, o site estará disponível também em localhost:8080
