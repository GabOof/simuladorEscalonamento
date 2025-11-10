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

ordemExecucao.forEach((p) => {
  const barra = document.createElement("div");
  barra.classList.add("barra");
  barra.textContent = `${p.nome} (${p.inicio}-${p.fim})`;
  gantt.appendChild(barra);
});

const n = ordemExecucao.length;
const tempoMedioEspera = (totalEspera / n).toFixed(2);
const tempoMedioTurnaround = (totalTurnaround / n).toFixed(2);

metricas.innerHTML = `
    <p><b>Tempo Médio de Espera:</b> ${tempoMedioEspera}</p>
    <p><b>Tempo Médio de Execução (Turnaround):</b> ${tempoMedioTurnaround}</p>
    <p><b>Total de Trocas de Contexto:</b> ${n - 1}</p>
    <p><b>Utilização Média dos Médicos:</b> ${(100).toFixed(2)}%</p>
  `;
