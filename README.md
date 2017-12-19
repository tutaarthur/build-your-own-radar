Biblioteca geradora de um radar interativo, inspirado por [thoughtworks.com/radar](http://thoughtworks.com/radar).

## Como usar

O modo mais fácil de utilizar esta aplicação é fornecer uma Planilha Google *publicada*, obedecendo as restrições abaixo.

### Montando seus dados

Você precisa publicar seus dados para que o radar consiga ler e plotar.


Em relação às restrições, sua tabela deve ter as seguintes colunas:

| name          | ring   | quadrant               | maturity | visible | description                                             |
|---------------|--------|------------------------|----------|---------|---------------------------------------------------------|
| Composer      | Adotar  | Ferramentas                  |    1     |   TRUE  |O Composer é um gerenciador de  ...          |
| Canary builds | Avaliar  | Técnicas             |    2     |   TRUE  |Um gerenciador de dependências externas ao código ...       |
| Apache Kylin  | Experimentar | Plataformas              |    3     |   FALSE |Apache Kylin é uma solução de análise ...   |
| C#           | Adotar   | Linguagens & Frameworks |    4     |   TRUE  |C# é uma linguagem de programação projetada para criar ... |

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

##### Utilizando Google Sheets

Depois de copiar a URL da sua planilha, só colá-la na caixa de texto da página inicial e clicar no botão para gerar.

Nota: a ordem dos Quadrants e dos Rings será especificada pela mesma ordem que se encontram na planilha.

Caso queira mudar o texto das tooltips mostradas na descrição dos Rings, o arquivo se encontra em `utils/parameters.js`.

##### Utilizando dados locais

No arquivo `utils/parameters.js` há uma flag chamada `google_sheet`, que especifica para o programa a página inicial a ser mostrada. Caso `true`, será mostrada a página padrão, requisitando a URL para a montagem do radar. Caso `false`, os dados utilizados são os armazenados na variável `array_tabela` dentro do mesmo arquivo.

O formato dos dados dessa variável deve seguir o seguinte exemplo:

```sh
array_tabela = [
["name","ring","quadrant","maturity","visible","description"  ],
["App Dynamycs APM ","Adotar","Ferramenta","4","TRUE","Descrição"  ],
["PowerBI","Experimentar","Ferramenta","3","TRUE","Descrição"  ],
["AWS ","Experimentar","Plataforma","2","TRUE","Descrição"  ],
["Alteryx","Avaliar","Ferramenta","1","TRUE","Descrição"  ]
]  
```

Mas lembre-se de incluir 4 quadrantes, no exemplo acima, só há 2, Ferramenta e Plataforma.

Salvando a planilha em .csv e convertendo-a no site http://www.convertcsv.com/csv-to-json.htm selecionando a opção CSV To JSON Array, a saída é exatamente o que é preciso para montar o radar, basta colocá-la na variável `array_table` no arquivo `utils/parameters.js`.

## Executando

Verifique se você possui a versão mais recente do Node.JS para executar os comandos abaixo.

- `git clone git@github.com:tuaarthur/build-your-own-radar.git`
- `npm install`- instalando as dependências do pacote
- `npm run dev` - para executar a aplicação no endereço localhost:8080.

### Caso não tenha Node.JS instalado e prefira utilizar o docker

     $ docker run -p 8080:8080 -v $PWD:/app -w /app -it node:7.3.0 /bin/sh -c 'npm install && npm run dev'

Depois de criado o container, o site estará disponível também em localhost:8080

## Termos

### Maturidade

* *Baixa (1)*: reflete tecnologias que ainda não estão em uso geral, nem em projetos nem em testes.
* *Média (2-3)*: tecnologias que são utiizadas em algum projeto, mas ainda não totalmente dominadas ou amplamente exploradas pelo time.
* *Alta (4)*: tecnologias que são utilizadas em larga escala, com alto entendimento de seu funcionamento pelo time e amplamente explorada.

### Rings

* *Adotar*: tecnologias que devem ser adotadas pelo time a fim de aumentar a produtividade ou simplificar o desenvolvimento de algum projeto.
* *Experimentar*: tecnologia que foi analisada e deve ser testada pelo time, verificando se a mesma se encaixa ou não no padrão de desenvolvimento.
* *Avaliar*: tecnologia que deve ser amplamente avaliada para a adoção, definição normalmente utilizada para grandes mudanças que requerem uma análise mais profunda de seu impacto. Ex: Plataforma, Framework.
* *Evitar*: tecnologias já avaliadas/experimentadas/adotadas que não satisfizeram todas as necessidades ou trouxeram uma grande variedade de problemas em sua implementação. Também se encaixam aqui as que não se adequam ao objetivo do time.
