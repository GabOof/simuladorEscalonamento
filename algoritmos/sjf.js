/* 
  Shortest Job First (SJF) - Não Preemptivo
  Desenvolvido por: Gabrielle de Oliveira Fonseca
*/

function simularSJF(pacientes, medicos) {
  const ganttCanvas = document.getElementById("ganttCanvas");
  const metricas = document.getElementById("metricas");
  const eventos = document.getElementById("eventos");

  // --- Prepara o canvas e as áreas de saída ---
  const ctx = ganttCanvas.getContext("2d");
  ctx.clearRect(0, 0, ganttCanvas.width, ganttCanvas.height);
  metricas.innerHTML = "";
  eventos.innerHTML = "";

  // --- Ordena cronologicamente os pacientes ---
  pacientes.sort((a, b) => a.chegada - b.chegada);

  // --- Inicializa as variáveis ---
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

  // ===============================================================
  // LOOP PRINCIPAL DE SIMULAÇÃO
  // ===============================================================
  while (
    pacientes.length > 0 ||
    filaProntos.length > 0 ||
    medicosLivres.some((t) => t > tempoAtual)
  ) {
    // --- Chegada de novos pacientes ---
    while (pacientes.length > 0 && pacientes[0].chegada <= tempoAtual) {
      const novo = pacientes.shift();
      filaProntos.push(novo);
      registrarEvento(
        eventos,
        `🩺 ${novo.nome} chegou no tempo ${novo.chegada}.`
      );
    }

    // --- Ordena a fila de prontos pelo menor tempo de serviço (SJF) ---
    filaProntos.sort((a, b) => a.duracao - b.duracao);

    // --- Aloca os médicos disponíveis ---
    for (let i = 0; i < medicos; i++) {
      if (medicosLivres[i] <= tempoAtual && filaProntos.length > 0) {
        const atual = filaProntos.shift();
        const inicio = tempoAtual;
        const fim = inicio + atual.duracao;
        const tempoEspera = inicio - atual.chegada;
        const turnaround = fim - atual.chegada;

        // --- Atualiza as métricas globais ---
        totalEspera += tempoEspera;
        totalTurnaround += turnaround;
        totalOcupacao += atual.duracao;
        medicosLivres[i] = fim;

        // --- Registra a execução para o gráfico ---
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

  // --- Gera o gráfico de Gantt ---
  desenharGanttInvertido(ctx, ordemExecucao);

  // --- Cálcula as métricas de desempenho ---
  const n = ordemExecucao.length;
  const tempoMedioEspera = (totalEspera / n).toFixed(2);
  const tempoMedioTurnaround = (totalTurnaround / n).toFixed(2);
  const utilizacao = ((totalOcupacao / (tempoAtual * medicos)) * 100).toFixed(
    2
  );

  // --- Exibe as métricas na interface ---
  metricas.innerHTML = `
    <p><b>Tempo Médio de Espera:</b> ${tempoMedioEspera}</p>
    <p><b>Tempo Médio de Execução (Turnaround):</b> ${tempoMedioTurnaround}</p>
    <p><b>Total de Trocas de Contexto:</b> ${n - medicos}</p>
    <p><b>Utilização Média dos Médicos:</b> ${utilizacao}%</p>
  `;

  registrarEvento(eventos, `✅ Simulação finalizada no tempo ${tempoAtual}.`);
}

// ===================================================================
// FUNÇÃO DE DESENHO DO GRÁFICO DE GANTT
// ===================================================================
function desenharGantt(ctx, execucoes) {
  const cores = ["#2b4c7e", "#4c7e2b", "#7e2b4c", "#c47e1c"];
  const alturaBarra = 30;
  const margemY = 10;
  const margemX = 60;

  // --- Ajusta automaticamente o tamanho do canvas ---
  const tempoTotal = Math.max(...execucoes.map((p) => p.fim));
  const larguraCanvas = Math.max(tempoTotal * 40 + 100, 900);
  const alturaCanvas = (execucoes.length + 2) * (alturaBarra + margemY);

  ctx.canvas.width = larguraCanvas;
  ctx.canvas.height = alturaCanvas;
  ctx.clearRect(0, 0, larguraCanvas, alturaCanvas);

  const eixoYBase = alturaCanvas - 40;

  // --- Eixo X ---
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

  // --- Desenho das barras ---
  execucoes.forEach((p, i) => {
    const y = eixoYBase - (i + 1) * (alturaBarra + margemY);
    const cor = cores[(p.medico - 1) % cores.length];

    const xChegada = margemX + p.chegada * 40;
    const xInicio = margemX + p.inicio * 40;
    const xFim = margemX + p.fim * 40;

    // Representa o tempo total da tarefa
    ctx.strokeStyle = cor;
    ctx.lineWidth = 2;
    ctx.strokeRect(xChegada, y, xFim - xChegada, alturaBarra);

    //  Representa apenas o período de execução da tarefa
    ctx.fillStyle = cor;
    ctx.fillRect(xInicio, y, xFim - xInicio, alturaBarra);

    // --- Nome e tempo do paciente ---
    ctx.fillStyle = "#fff";
    ctx.fillText(p.nome, xInicio + 5, y + 20);

    ctx.fillStyle = "#333";
    ctx.fillText(`(${p.inicio}-${p.fim})`, xFim + 5, y + 20);
  });

  // --- Linha base do tempo ---
  ctx.beginPath();
  ctx.moveTo(margemX, eixoYBase);
  ctx.lineTo(larguraCanvas - 20, eixoYBase);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#333";
  ctx.stroke();

  // --- Título e legenda ---
  ctx.fillStyle = "#000";
  ctx.font = "bold 13px Arial";
  ctx.fillText("Pacientes (base = primeiros atendidos)", 5, 20);
}

// ===================================================================
// REGISTRO DE EVENTOS
// ===================================================================
function registrarEvento(container, texto) {
  const p = document.createElement("p");
  p.textContent = texto;
  container.appendChild(p);
  container.scrollTop = container.scrollHeight;
}
