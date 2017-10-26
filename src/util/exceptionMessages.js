const ExceptionMessages = {
  TOO_MANY_QUADRANTS: 'Existem mais de 4 quadrantes listados. Verifique se há apenas 4 tipos de quadrante na coluna.',
  TOO_MANY_RINGS: 'Há mais de 4 rings.',
  MISSING_HEADERS: 'Document is missing one or more required headers or they are misspelled. ' +
  'Check that your document contains headers for "name", "ring", "quadrant", "isNew", "description".',
  MISSING_CONTENT: 'Document is missing content.',
  LESS_THAN_FOUR_QUADRANTS : 'There are less than 4 quadrant names listed in your data. Check the quadrant column for errors.',
  SHEET_NOT_FOUND: 'Oops! We can’t find the Google Sheet you’ve entered. Can you check the URL?'
};

module.exports = ExceptionMessages;