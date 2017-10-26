const ExceptionMessages = {
  TOO_MANY_QUADRANTS: 'Existem mais de 4 quadrantes listados. Verifique se há apenas 4 tipos de quadrante na coluna.',
  TOO_MANY_RINGS: 'Há mais de 4 rings.',
  MISSING_HEADERS: 'O documento não foi encontrado ou as colunas tem nomes diferentes. ' +
  'Verifique se o documento possui as colunas nomeadas na seguinte ordem:"name", "ring", "quadrant", "maturity", "visible", "description".',
  MISSING_CONTENT: 'O documento está vazio.',
  LESS_THAN_FOUR_QUADRANTS : 'Há menos de 4 quadrantes no seu documento. Verifique a coluna "quadrant" por possíveis erros.',
  SHEET_NOT_FOUND: 'Oops! Não foi possível encontrar a planilha. Você pode verificar se ela está publicada devidamente e a URL está correta?'
};

module.exports = ExceptionMessages;