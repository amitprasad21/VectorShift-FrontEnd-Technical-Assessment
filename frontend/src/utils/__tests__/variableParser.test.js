import { parseVariables } from '../variableParser';

describe('parseVariables', () => {
  test('extracts single variable', () => {
    expect(parseVariables('{{input}}')).toEqual(['input']);
  });

  test('extracts multiple variables', () => {
    expect(parseVariables('Hello {{name}}, welcome to {{company}}')).toEqual(['name', 'company']);
  });

  test('deduplicates repeated variables', () => {
    expect(parseVariables('{{x}} and {{x}}')).toEqual(['x']);
  });

  test('handles whitespace inside braces', () => {
    expect(parseVariables('{{ input }}')).toEqual(['input']);
  });

  test('rejects names starting with digits', () => {
    expect(parseVariables('{{123}}')).toEqual([]);
    expect(parseVariables('{{4foo}}')).toEqual([]);
  });

  test('accepts underscore and dollar prefixes', () => {
    expect(parseVariables('{{_private}}')).toEqual(['_private']);
    expect(parseVariables('{{$var}}')).toEqual(['$var']);
  });

  test('returns empty for non-string input', () => {
    expect(parseVariables(null)).toEqual([]);
    expect(parseVariables(undefined)).toEqual([]);
    expect(parseVariables(42)).toEqual([]);
  });

  test('returns empty for no variables', () => {
    expect(parseVariables('plain text')).toEqual([]);
    expect(parseVariables('')).toEqual([]);
  });

  test('ignores incomplete braces', () => {
    expect(parseVariables('{input}')).toEqual([]);
    expect(parseVariables('{{input}')).toEqual([]);
  });
});
