// Script para popular a tabela com muitos dados de teste
document.addEventListener("DOMContentLoaded", () => {
  const exemplos = [
    { nome: "A", chegada: 0, duracao: 6, prioridade: 3 },
    { nome: "B", chegada: 0, duracao: 3, prioridade: 2 },
    { nome: "C", chegada: 0, duracao: 8, prioridade: 1 },
    { nome: "D", chegada: 0, duracao: 4, prioridade: 4 },
    { nome: "E", chegada: 0, duracao: 2, prioridade: 5 },
    // { nome: "F", chegada: 6, duracao: 5, prioridade: 2 },
    // { nome: "G", chegada: 7, duracao: 7, prioridade: 3 },
    // { nome: "H", chegada: 8, duracao: 1, prioridade: 4 },
    // { nome: "I", chegada: 9, duracao: 9, prioridade: 1 },
    // { nome: "J", chegada: 10, duracao: 3, prioridade: 5 },
    // { nome: "K", chegada: 11, duracao: 2, prioridade: 2 },
    // { nome: "L", chegada: 12, duracao: 4, prioridade: 3 },
    // { nome: "M", chegada: 13, duracao: 6, prioridade: 4 },
    // { nome: "N", chegada: 14, duracao: 2, prioridade: 5 },
    // { nome: "O", chegada: 15, duracao: 7, prioridade: 3 },
    // { nome: "P", chegada: 16, duracao: 3, prioridade: 1 },
    // { nome: "Q", chegada: 17, duracao: 5, prioridade: 2 },
    // { nome: "R", chegada: 18, duracao: 1, prioridade: 4 },
    // { nome: "S", chegada: 19, duracao: 8, prioridade: 5 },
    // { nome: "T", chegada: 20, duracao: 2, prioridade: 1 },
  ];

  exemplos.forEach((p) => pacientes.push(p));
  atualizarTabela();

  console.log(
    "✅ Tabela preenchida automaticamente com 20 pacientes (seed de teste para SJF)."
  );
});
