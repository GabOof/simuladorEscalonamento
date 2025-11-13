/* 
  Shortest Job First (SJF) - Não Preemptivo
  Desenvolvido por: Gabrielle de Oliveira Fonseca
*/

function simularSJF(pacientes, medicos) {
  const ganttCanvas = document.getElementById("ganttCanvas");
  const metricas = document.getElementById("metricas");
  const eventos = document.getElementById("eventos");

  const ctx = ganttCanvas.getContext("2d");
  ctx.clearRect(0, 0, ganttCanvas.width, ganttCanvas.height);
  metricas.innerHTML = "";
  eventos.innerHTML = "";

  // Ordena por tempo de chegada
  pacientes.sort((a, b) => a.chegada - b.chegada);

  let tempoAtual = 0;
  let filaProntos = [];
  let medicosLivres = Array(medicos).fill(0);
  let ordemExecucao = [];
  let totalEspera = 0;
  let totalTurnaround = 0;
  let totalOcupacao = 0;

  registrarEvento(
    eventos,
    `🟢 Início da simulação SJF com ${medicos} médico(s).`
  );

  // Loop principal
  while (
    pacientes.length > 0 ||
    filaProntos.length > 0 ||
    medicosLivres.some((t) => t > tempoAtual)
  ) {
    while (pacientes.length > 0 && pacientes[0].chegada <= tempoAtual) {
      const novo = pacientes.shift();
      filaProntos.push(novo);
      registrarEvento(
        eventos,
        `🩺 ${novo.nome} chegou no tempo ${novo.chegada}.`
      );
    }

    filaProntos.sort((a, b) => a.duracao - b.duracao);

    for (let i = 0; i < medicos; i++) {
      if (medicosLivres[i] <= tempoAtual && filaProntos.length > 0) {
        const atual = filaProntos.shift();
        const inicio = tempoAtual;
        const fim = inicio + atual.duracao;
        const tempoEspera = inicio - atual.chegada;
        const turnaround = fim - atual.chegada;

        totalEspera += tempoEspera;
        totalTurnaround += turnaround;
        totalOcupacao += atual.duracao;
        medicosLivres[i] = fim;

        ordemExecucao.push({
          nome: atual.nome,
          chegada: atual.chegada,
          inicio,
          fim,
          medico: i + 1,
        });
        registrarEvento(
          eventos,
          `👨‍⚕️ ${atual.nome} iniciou com Médico ${i + 1} (${inicio} → ${fim}).`
        );
      }
    }

    tempoAtual++;
  }

  // Desenha o gráfico invertido com tempo de espera
  desenharGanttInvertido(ctx, ordemExecucao);

  // Métricas
  const n = ordemExecucao.length;
  const tempoMedioEspera = (totalEspera / n).toFixed(2);
  const tempoMedioTurnaround = (totalTurnaround / n).toFixed(2);
  const utilizacao = ((totalOcupacao / (tempoAtual * medicos)) * 100).toFixed(
    2
  );

  metricas.innerHTML = `
    <p><b>Tempo Médio de Espera:</b> ${tempoMedioEspera}</p>
    <p><b>Tempo Médio de Execução (Turnaround):</b> ${tempoMedioTurnaround}</p>
    <p><b>Total de Trocas de Contexto:</b> ${n - medicos}</p>
    <p><b>Utilização Média dos Médicos:</b> ${utilizacao}%</p>
  `;

  registrarEvento(eventos, `✅ Simulação finalizada no tempo ${tempoAtual}.`);
}

// -------------------------------------------------------
// Gantt invertido com barra de espera (contorno) + execução (cheia)
// -------------------------------------------------------
function desenharGanttInvertido(ctx, execucoes) {
  const cores = ["#2b4c7e", "#4c7e2b", "#7e2b4c", "#c47e1c"];
  const alturaBarra = 30;
  const margemY = 10;
  const margemX = 60;

  // Dimensões
  const tempoTotal = Math.max(...execucoes.map((p) => p.fim));
  const larguraCanvas = Math.max(tempoTotal * 40 + 100, 900);
  const alturaCanvas = (execucoes.length + 2) * (alturaBarra + margemY);

  ctx.canvas.width = larguraCanvas;
  ctx.canvas.height = alturaCanvas;
  ctx.clearRect(0, 0, larguraCanvas, alturaCanvas);

  const eixoYBase = alturaCanvas - 40;

  // Eixo X (tempo)
  ctx.font = "12px Arial";
  ctx.fillStyle = "#333";
  for (let t = 0; t <= tempoTotal; t++) {
    const x = margemX + t * 40;
    ctx.fillText(t.toString(), x, eixoYBase + 20);
    ctx.beginPath();
    ctx.moveTo(x, eixoYBase);
    ctx.lineTo(x, 20);
    ctx.strokeStyle = "#eee";
    ctx.stroke();
  }

  // Barras (de baixo pra cima)
  execucoes.forEach((p, i) => {
    const y = eixoYBase - (i + 1) * (alturaBarra + margemY);
    const cor = cores[(p.medico - 1) % cores.length];

    const xChegada = margemX + p.chegada * 40;
    const xInicio = margemX + p.inicio * 40;
    const xFim = margemX + p.fim * 40;

    // --- Contorno (tempo de espera + execução)
    ctx.strokeStyle = cor;
    ctx.lineWidth = 2;
    ctx.strokeRect(xChegada, y, xFim - xChegada, alturaBarra);

    // --- Barra colorida (apenas execução)
    ctx.fillStyle = cor;
    ctx.fillRect(xInicio, y, xFim - xInicio, alturaBarra);

    // --- Nome do paciente
    ctx.fillStyle = "#fff";
    ctx.fillText(p.nome, xInicio + 5, y + 20);

    // --- Tempo (início-fim)
    ctx.fillStyle = "#333";
    ctx.fillText(`(${p.inicio}-${p.fim})`, xFim + 5, y + 20);
  });

  // Linha do tempo
  ctx.beginPath();
  ctx.moveTo(margemX, eixoYBase);
  ctx.lineTo(larguraCanvas - 20, eixoYBase);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#333";
  ctx.stroke();

  // Legenda
  ctx.fillStyle = "#000";
  ctx.font = "bold 13px Arial";
  ctx.fillText("Pacientes (base = primeiros atendidos)", 5, 20);

  // Pequena legenda de cores
  ctx.font = "12px Arial";
  ctx.fillText("▭ Tempo total (chegada → fim)", larguraCanvas - 300, 25);
  ctx.fillText("█ Execução (início → fim)", larguraCanvas - 300, 40);
}

// -------------------------------------------------------
// Registro de eventos
// -------------------------------------------------------
function registrarEvento(container, texto) {
  const p = document.createElement("p");
  p.textContent = texto;
  container.appendChild(p);
  container.scrollTop = container.scrollHeight;
}
