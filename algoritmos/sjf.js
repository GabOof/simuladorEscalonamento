function simularSJF(pacientes, medicos) {
  const gantt = document.getElementById("gantt");
  const metricas = document.getElementById("metricas");
  gantt.innerHTML = "";
  metricas.innerHTML = "";

  pacientes.sort((a, b) => a.chegada - b.chegada);

  let tempoAtual = 0;
  let filaProntos = [];
  let ordemExecucao = [];
  let totalEspera = 0;
  let totalTurnaround = 0;

  while (pacientes.length > 0 || filaProntos.length > 0) {
    while (pacientes.length > 0 && pacientes[0].chegada <= tempoAtual) {
      filaProntos.push(pacientes.shift());
    }

    if (filaProntos.length === 0) {
      tempoAtual++;
      continue;
    }

    filaProntos.sort((a, b) => a.duracao - b.duracao);
    const atual = filaProntos.shift();

    const inicio = tempoAtual;
    const fim = inicio + atual.duracao;
    const espera = inicio - atual.chegada;
    const turnaround = fim - atual.chegada;

    totalEspera += espera;
    totalTurnaround += turnaround;
    tempoAtual = fim;

    ordemExecucao.push({ nome: atual.nome, inicio, fim });
  }

  console.log("Execução SJF concluída:", ordemExecucao);
}
