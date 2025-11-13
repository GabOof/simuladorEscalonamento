// ===================================================================
// CENÁRIOS DE TESTE PARA SIMULADOR DE ESCALONAMENTO SJF
// Desenvolvido por: Gabrielle de Oliveira Fonseca
// ===================================================================
//
// Troque os valores "false" e "true" para ativar o cenário desejado
// ===================================================================

// ---------------------------------------------------------------
// Cenário 1 – Emergência Crítica (1 Médico)
// Situação de alta espera: pacientes chegam em tempos diferentes
// e há apenas um recurso disponível.
// ---------------------------------------------------------------
if (true) {
  pacientes.push(
    { nome: "Ana", chegada: 0, duracao: 8, prioridade: 1 },
    { nome: "João", chegada: 1, duracao: 2, prioridade: 3 },
    { nome: "Clara", chegada: 2, duracao: 5, prioridade: 2 },
    { nome: "Pedro", chegada: 4, duracao: 1, prioridade: 3 }
  );
  document.getElementById("medicos").value = "1";
}

// ---------------------------------------------------------------
// Cenário 2 – Plantão Lotado (Alta Carga de Processos) (2 Médicos)
// Teste intermediário: dois médicos com chegadas escalonadas.
// Demonstra paralelismo parcial e priorização por menor duração.
// ---------------------------------------------------------------
if (false) {
  pacientes.push(
    { nome: "Carlos", chegada: 0, duracao: 4, prioridade: 2 },
    { nome: "Bruna", chegada: 1, duracao: 9, prioridade: 1 },
    { nome: "Daniel", chegada: 2, duracao: 3, prioridade: 3 },
    { nome: "Elen", chegada: 3, duracao: 6, prioridade: 2 },
    { nome: "Felipe", chegada: 4, duracao: 8, prioridade: 1 },
    { nome: "Helena", chegada: 5, duracao: 5, prioridade: 3 },
    { nome: "Igor", chegada: 7, duracao: 2, prioridade: 2 }
  );
  document.getElementById("medicos").value = "2";
}

// ---------------------------------------------------------------
// Cenário 3 – Hospital Moderno (Alta Capacidade e Diversidade) (4 Médicos)
// Ambiente altamente paralelo, ideal para observar a eficiência
// do algoritmo SJF na distribuição de tarefas simultâneas.
// ---------------------------------------------------------------
if (false) {
  pacientes.push(
    { nome: "Rafaela", chegada: 0, duracao: 6, prioridade: 2 },
    { nome: "Thiago", chegada: 0, duracao: 2, prioridade: 3 },
    { nome: "Larissa", chegada: 0, duracao: 4, prioridade: 1 },
    { nome: "Marcos", chegada: 0, duracao: 3, prioridade: 2 },
    { nome: "Juliana", chegada: 0, duracao: 7, prioridade: 1 },
    { nome: "Eduardo", chegada: 0, duracao: 5, prioridade: 3 },
    { nome: "Natália", chegada: 0, duracao: 1, prioridade: 2 }
  );
  document.getElementById("medicos").value = "4";
}

// ---------------------------------------------------------------
// Cenário 4 – Chegadas Aleatórias (Fluxo Realista) (2 Médicos)
// Representa um cenário hospitalar realista, com chegadas variáveis
// e tempos de atendimento diversos.
// ---------------------------------------------------------------
if (false) {
  pacientes.push(
    { nome: "Bruno", chegada: 0, duracao: 3, prioridade: 2 },
    { nome: "Camila", chegada: 2, duracao: 8, prioridade: 1 },
    { nome: "Sofia", chegada: 3, duracao: 2, prioridade: 3 },
    { nome: "Lucas", chegada: 5, duracao: 6, prioridade: 2 },
    { nome: "Gabriel", chegada: 6, duracao: 5, prioridade: 1 },
    { nome: "Fernanda", chegada: 8, duracao: 4, prioridade: 3 },
    { nome: "Ricardo", chegada: 9, duracao: 7, prioridade: 2 }
  );
  document.getElementById("medicos").value = "2";
}

// ---------------------------------------------------------------
// Cenário 5 – Pico de Emergências (Sobrecarga Instantânea) (4 Médicos)
// Simula um desastre com múltiplas vítimas chegando simultaneamente.
// Ideal para avaliar balanceamento e eficiência sob pressão.
// ---------------------------------------------------------------
if (false) {
  pacientes.push(
    { nome: "Paulo", chegada: 0, duracao: 9, prioridade: 1 },
    { nome: "Isabela", chegada: 0, duracao: 4, prioridade: 3 },
    { nome: "Renata", chegada: 0, duracao: 6, prioridade: 2 },
    { nome: "Caio", chegada: 0, duracao: 5, prioridade: 2 },
    { nome: "Tatiane", chegada: 0, duracao: 2, prioridade: 3 },
    { nome: "André", chegada: 0, duracao: 3, prioridade: 1 }
  );
  document.getElementById("medicos").value = "4";
}

// ---------------------------------------------------------------
// Atualiza automaticamente a tabela na interface
// ---------------------------------------------------------------
atualizarTabela();
