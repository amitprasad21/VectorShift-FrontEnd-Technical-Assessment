import { checkIsDAG } from '../graphValidation';

const node = (id) => ({ id });
const edge = (source, target) => ({ source, target });

describe('checkIsDAG', () => {
  test('empty graph is a DAG', () => {
    expect(checkIsDAG([], [])).toBe(true);
  });

  test('single node is a DAG', () => {
    expect(checkIsDAG([node('a')], [])).toBe(true);
  });

  test('linear chain is a DAG', () => {
    const nodes = [node('a'), node('b'), node('c')];
    const edges = [edge('a', 'b'), edge('b', 'c')];
    expect(checkIsDAG(nodes, edges)).toBe(true);
  });

  test('diamond shape is a DAG', () => {
    const nodes = [node('a'), node('b'), node('c'), node('d')];
    const edges = [edge('a', 'b'), edge('a', 'c'), edge('b', 'd'), edge('c', 'd')];
    expect(checkIsDAG(nodes, edges)).toBe(true);
  });

  test('simple cycle is not a DAG', () => {
    const nodes = [node('a'), node('b')];
    const edges = [edge('a', 'b'), edge('b', 'a')];
    expect(checkIsDAG(nodes, edges)).toBe(false);
  });

  test('three-node cycle is not a DAG', () => {
    const nodes = [node('a'), node('b'), node('c')];
    const edges = [edge('a', 'b'), edge('b', 'c'), edge('c', 'a')];
    expect(checkIsDAG(nodes, edges)).toBe(false);
  });

  test('disconnected nodes are a DAG', () => {
    const nodes = [node('a'), node('b'), node('c')];
    expect(checkIsDAG(nodes, [])).toBe(true);
  });

  test('ignores edges referencing non-existent nodes', () => {
    const nodes = [node('a'), node('b')];
    const edges = [edge('a', 'b'), edge('b', 'ghost')];
    expect(checkIsDAG(nodes, edges)).toBe(true);
  });

  test('self-loop is not a DAG', () => {
    const nodes = [node('a')];
    const edges = [edge('a', 'a')];
    expect(checkIsDAG(nodes, edges)).toBe(false);
  });
});
