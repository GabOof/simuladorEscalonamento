/* 
  Shortest Job First (SJF) - Não Preemptivo
  Desenvolvido por: Gabrielle de Oliveira Fonseca
*/

function executarSJF(listaPacientes, qtdMedicos) {
  const canvasGantt = document.getElementById("canvasGantt");
  const painelMetricas = document.getElementById("painelMetricas");
  const painelEventos = document.getElementById("painelEventos");

  // --- Prepara o canvas e as áreas de saída ---
  const context = canvasGantt.getContext("2d");
  context.clearRect(0, 0, canvasGantt.width, canvasGantt.height);
  painelMetricas.innerHTML = "";
  painelEventos.innerHTML = "";

  // --- Ordena cronologicamente os pacientes ---
  listaPacientes.sort((a, b) => a.chegada - b.chegada);

  // --- Inicializa as variáveis ---
  let tempoCorrente = 0;
  let filaDeEspera = [];
  let disponibilidadeMedicos = Array(qtdMedicos).fill(0);
  let historicoExecucao = [];
  let somaEspera = 0;
  let somaTurnaround = 0;
  let somaOcupacao = 0;

  registrarEvento(
    painelEventos,
    `🟢 Início da simulação SJF com ${qtdMedicos} médico(s).`
  );

  // ===============================================================
  // LOOP PRINCIPAL DA SIMULAÇÃO
  // ===============================================================
  while (
    listaPacientes.length > 0 ||
    filaDeEspera.length > 0 ||
    disponibilidadeMedicos.some((t) => t > tempoCorrente)
  ) {
    // --- Chegada de novos pacientes ---
    while (
      listaPacientes.length > 0 &&
      listaPacientes[0].chegada <= tempoCorrente
    ) {
      const novoPaciente = listaPacientes.shift();
      filaDeEspera.push(novoPaciente);
      registrarEvento(
        painelEventos,
        `🩺 ${novoPaciente.nome} chegou no tempo ${novoPaciente.chegada}.`
      );
    }

    // --- Ordena a fila pelo menor tempo de atendimento (SJF) ---
    filaDeEspera.sort((a, b) => a.duracao - b.duracao);

    // --- Aloca médicos disponíveis ---
    for (let i = 0; i < qtdMedicos; i++) {
      if (
        disponibilidadeMedicos[i] <= tempoCorrente &&
        filaDeEspera.length > 0
      ) {
        const pacienteAtual = filaDeEspera.shift();
        const inicioAtendimento = tempoCorrente;
        const fimAtendimento = inicioAtendimento + pacienteAtual.duracao;
        const tempoDeEspera = inicioAtendimento - pacienteAtual.chegada;
        const tempoTotal = fimAtendimento - pacienteAtual.chegada;

        // --- Atualiza métricas acumuladas ---
        somaEspera += tempoDeEspera;
        somaTurnaround += tempoTotal;
        somaOcupacao += pacienteAtual.duracao;
        disponibilidadeMedicos[i] = fimAtendimento;

        // --- Registra dados para o gráfico ---
        historicoExecucao.push({
          nome: pacienteAtual.nome,
          chegada: pacienteAtual.chegada,
          inicio: inicioAtendimento,
          fim: fimAtendimento,
          medico: i + 1,
        });

        registrarEvento(
          painelEventos,
          `👨‍⚕️ ${pacienteAtual.nome} iniciou com Médico ${
            i + 1
          } (${inicioAtendimento} → ${fimAtendimento}).`
        );
      }
    }

    tempoCorrente++;
  }

  // --- Gera o gráfico de Gantt ---
  desenharGantt(context, historicoExecucao);

  // --- Calcula métricas médias ---
  const totalPacientes = historicoExecucao.length;
  const mediaEspera = (somaEspera / totalPacientes).toFixed(2);
  const mediaTurnaround = (somaTurnaround / totalPacientes).toFixed(2);
  const taxaUtilizacao = (
    (somaOcupacao / (tempoCorrente * qtdMedicos)) *
    100
  ).toFixed(2);

  // --- Exibe as métricas na interface ---
  painelMetricas.innerHTML = `
    <p><b>Tempo Médio de Espera:</b> ${mediaEspera}</p>
    <p><b>Tempo Médio de Execução (Turnaround):</b> ${mediaTurnaround}</p>
    <p><b>Total de Trocas de Contexto:</b> ${totalPacientes - qtdMedicos}</p>
    <p><b>Utilização Média dos Médicos:</b> ${taxaUtilizacao}%</p>
  `;

  registrarEvento(
    painelEventos,
    `✅ Simulação finalizada no tempo ${tempoCorrente}.`
  );
}

// ===================================================================
// FUNÇÃO DE DESENHO DO GRÁFICO DE GANTT
// ===================================================================
function desenharGantt(context, execucoes) {
  const paletaCores = ["#2b4c7e", "#4c7e2b", "#7e2b4c", "#c47e1c"];
  const alturaBarra = 30;
  const espacoVertical = 10;
  const margemEsquerda = 60;

  // --- Ajuste dinâmico do tamanho do canvas ---
  const tempoMaximo = Math.max(...execucoes.map((paciente) => paciente.fim));
  const larguraCanvas = Math.max(tempoMaximo * 40 + 100, 900);
  const alturaCanvas = (execucoes.length + 2) * (alturaBarra + espacoVertical);

  context.canvas.width = larguraCanvas;
  context.canvas.height = alturaCanvas;
  context.clearRect(0, 0, larguraCanvas, alturaCanvas);

  const baseY = alturaCanvas - 40;

  // --- Eixo do tempo ---
  context.font = "12px Arial";
  context.fillStyle = "#333";
  for (let t = 0; t <= tempoMaximo; t++) {
    const x = margemEsquerda + t * 40;
    context.fillText(t.toString(), x, baseY + 20);
    context.beginPath();
    context.moveTo(x, baseY);
    context.lineTo(x, 20);
    context.strokeStyle = "#eee";
    context.stroke();
  }

  // --- Desenho das barras ---
  execucoes.forEach((paciente, i) => {
    const y = baseY - (i + 1) * (alturaBarra + espacoVertical);
    const cor = paletaCores[(paciente.medico - 1) % paletaCores.length];

    const xChegada = margemEsquerda + paciente.chegada * 40;
    const xInicio = margemEsquerda + paciente.inicio * 40;
    const xFim = margemEsquerda + paciente.fim * 40;

    // Tempo total (contorno)
    context.strokeStyle = cor;
    context.lineWidth = 2;
    context.strokeRect(xChegada, y, xFim - xChegada, alturaBarra);

    // Tempo efetivo de execução (preenchido)
    context.fillStyle = cor;
    context.fillRect(xInicio, y, xFim - xInicio, alturaBarra);

    // Informações de texto
    context.fillStyle = "#fff";
    context.fillText(paciente.nome, xInicio + 5, y + 20);

    context.fillStyle = "#333";
    context.fillText(`(${paciente.inicio}-${paciente.fim})`, xFim + 5, y + 20);
  });

  // --- Linha base ---
  context.beginPath();
  context.moveTo(margemEsquerda, baseY);
  context.lineTo(larguraCanvas - 20, baseY);
  context.lineWidth = 2;
  context.strokeStyle = "#333";
  context.stroke();

  // --- Título ---
  context.fillStyle = "#000";
  context.font = "bold 13px Arial";
  context.fillText("Pacientes (base = primeiros atendidos)", 5, 20);
}

// ===================================================================
// REGISTRO DE EVENTOS
// ===================================================================
function registrarEvento(container, mensagem) {
  const paragrafo = document.createElement("p");
  paragrafo.textContent = mensagem;
  container.appendChild(paragrafo);
  container.scrollTop = container.scrollHeight;
}
