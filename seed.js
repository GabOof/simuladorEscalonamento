// ===================================================================
// CENÁRIOS DE TESTE PARA SIMULADOR DE ESCALONAMENTO SJF
// Desenvolvido por: Gabrielle de Oliveira Fonseca
// ===================================================================

// Troque os valores "false" e "true" para ativar o cenário desejado

// ---------------------------------------------------------------
// Cenário 1 – Emergência Crítica (1 Médico)
// Situação de alta espera: pacientes chegam em tempos diferentes
// e há apenas um recurso disponível.
// ---------------------------------------------------------------
if (false) {
  pacientes.push(
    { nome: "Ana", chegada: 0, duracao: 3, prioridade: 1 },
    { nome: "João", chegada: 1, duracao: 6, prioridade: 3 },
    { nome: "Clara", chegada: 2, duracao: 2, prioridade: 2 }
  );
  document.getElementById("medicos").value = "1";
}

// ---------------------------------------------------------------
// Cenário 2 – Plantão Lotado (2 Médicos)
// Teste intermediário: dois médicos com chegadas escalonadas.
// Demonstra paralelismo parcial e priorização por menor duração.
// ---------------------------------------------------------------
if (false) {
  pacientes.push(
    { nome: "Carlos", chegada: 0, duracao: 4, prioridade: 2 },
    { nome: "Bruna", chegada: 1, duracao: 8, prioridade: 3 },
    { nome: "Daniel", chegada: 2, duracao: 5, prioridade: 1 },
    { nome: "Elen", chegada: 3, duracao: 2, prioridade: 2 },
    { nome: "Felipe", chegada: 5, duracao: 3, prioridade: 3 }
  );
  document.getElementById("medicos").value = "2";
}

// ---------------------------------------------------------------
// Cenário 3 – Hospital Moderno (4 Médicos)
// Ambiente altamente paralelo, ideal para observar a eficiência
// do algoritmo SJF na distribuição de tarefas simultâneas.
// ---------------------------------------------------------------
if (true) {
  pacientes.push(
    { nome: "Rafaela", chegada: 0, duracao: 6, prioridade: 2 },
    { nome: "Thiago", chegada: 0, duracao: 2, prioridade: 1 },
    { nome: "Larissa", chegada: 0, duracao: 4, prioridade: 3 },
    { nome: "Marcos", chegada: 0, duracao: 3, prioridade: 2 },
    { nome: "Juliana", chegada: 0, duracao: 7, prioridade: 1 },
    { nome: "Eduardo", chegada: 0, duracao: 5, prioridade: 2 }
  );
  document.getElementById("medicos").value = "4";
}

// ---------------------------------------------------------------
// Atualiza automaticamente a tabela na interface
// ---------------------------------------------------------------
atualizarTabela();
