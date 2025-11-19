/* 
  Escalonamento por Prioridade Não-Preemptivo (Cooperativo)
  Desenvolvido por: Felipe Alexandre Vieira Mendes
*/

function executarPrioridade(listaPacientes, qtdMedicos) {
  const canvasGantt = document.getElementById("canvasGantt");
  const painelMetricas = document.getElementById("painelMetricas");
  const painelEventos = document.getElementById("painelEventos");

  // --- Prepara o canvas e as áreas de saída ---
  const context = canvasGantt.getContext("2d");
  context.clearRect(0, 0, canvasGantt.width, canvasGantt.height);
  painelMetricas.innerHTML = "";
  painelEventos.innerHTML = "";

  // --- Ordena cronologicamente os pacientes por chegada ---
  listaPacientes.sort((a, b) => a.chegada - b.chegada);

  // --- Inicializa as variáveis ---
  let tempoCorrente = 0;
  let filaDeEspera = [];
  let disponibilidadeMedicos = Array(qtdMedicos).fill(0); // quando cada médico ficará livre
  let historicoExecucao = [];
  let somaEspera = 0;
  let somaTurnaround = 0;
  let somaOcupacao = 0;

  prioridade_registrarEvento(
    painelEventos,
    `<i class="fa fa-play" style="color: #23501bff"></i> Início da simulação Prioridade Não-Preemptiva com ${qtdMedicos} médico(s).`
  );

  // ===============================================================
  // LOOP PRINCIPAL DA SIMULAÇÃO
  // ===============================================================
  while (
    listaPacientes.length > 0 ||
    filaDeEspera.length > 0 ||
    disponibilidadeMedicos.some((t) => t > tempoCorrente)
  ) {
    // --- Adiciona à fila os pacientes que já chegaram ---
    while (listaPacientes.length > 0 && listaPacientes[0].chegada <= tempoCorrente) {
      const novoPaciente = listaPacientes.shift();
      filaDeEspera.push(novoPaciente);
      prioridade_registrarEvento(
        painelEventos,
        `<i class="fa fa-user-plus" style="color: #23501bff"></i> ${novoPaciente.nome} chegou no tempo ${novoPaciente.chegada}.`
      );
    }

    // --- Se não houver paciente disponível agora e existem médicos ocupados, avança tempo para o próximo evento ---
    const proximasChegadas = listaPacientes.length > 0 ? listaPacientes[0].chegada : Infinity;
    const proximaLiberacao = Math.min(...disponibilidadeMedicos);

    if (filaDeEspera.length === 0) {
      // Caso não haja pacientes prontos: pular para a próxima chegada ou liberação (menor tempo)
      const avancarPara = Math.min(proximasChegadas, proximaLiberacao);
      if (avancarPara === Infinity) break;
      // evita loop infinito: se avancarPara for maior que tempoCorrente, atualiza tempoCorrente
      if (avancarPara > tempoCorrente) tempoCorrente = avancarPara;
      else tempoCorrente++;
      continue;
    }

    // --- Ordena a fila pela prioridade (1 = maior prioridade).
    filaDeEspera.sort((a, b) => {
      if (a.prioridade !== b.prioridade) return a.prioridade - b.prioridade; // menor valor = mais prioridade
      if (a.chegada !== b.chegada) return a.chegada - b.chegada;
      return a.duracao - b.duracao;
    });

    // --- Aloca médicos disponíveis aos pacientes de maior prioridade ---
    for (let i = 0; i < qtdMedicos; i++) {
      if (filaDeEspera.length === 0) break;

      if (disponibilidadeMedicos[i] <= tempoCorrente) {
        const pacienteAtual = filaDeEspera.shift();
        const inicioAtendimento = Math.max(tempoCorrente, pacienteAtual.chegada);
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

        prioridade_registrarEvento(
          painelEventos,
          `<i class="fa fa-user-doctor" style="color: #23501bff"></i> ${pacienteAtual.nome} iniciou com Médico ${i + 1} (${inicioAtendimento} → ${fimAtendimento}) - Prioridade ${pacienteAtual.prioridade}.`
        );
      }
    }

    // --- Incrementa tempo corrente: avança 1 unidade (simples e consistente com SJF) ---
    tempoCorrente++;
  }

  // --- Gera o gráfico de Gantt ---
  prioridade_desenharGantt(context, historicoExecucao);

  // --- Calcula métricas médias ---
  const totalPacientes = historicoExecucao.length || 1;
  const mediaEspera = (somaEspera / totalPacientes).toFixed(2);
  const mediaTurnaround = (somaTurnaround / totalPacientes).toFixed(2);
  // Trocas de contexto (aproximação): cada execução iniciada após a ocupação inicial de cada médico conta como troca
  const trocasContexto = Math.max(totalPacientes - qtdMedicos, 0);
  const taxaUtilizacao = ((somaOcupacao / (Math.max(1, tempoCorrente) * qtdMedicos)) * 100).toFixed(2);

  // --- Exibe as métricas na interface ---
painelMetricas.innerHTML = `
  <div class="metricas-card">
    <h3 class="metricas-titulo">Métricas Operacionais</h3>

    <!-- Tempo Médio de Espera -->
    <div class="metricas-bloco">
      <p><b>Tempo Médio de Espera (Tw)</b></p>
      <pre class="metricas-formula">
Tw = Σ(tempo de espera) / N
Tw = ${somaEspera} / ${totalPacientes}
<b>Tw = ${mediaEspera}</b></pre>
    </div>

    <!-- Turnaround -->
    <div class="metricas-bloco">
      <p><b>Tempo Médio de Turnaround (Tt)</b></p>
      <pre class="metricas-formula">
Tt = Σ(tempo total) / N
Tt = ${somaTurnaround} / ${totalPacientes}
<b>Tt = ${mediaTurnaround}</b></pre>
    </div>

    <!-- Trocas de Contexto -->
    <div class="metricas-bloco">
      <p><b>Trocas de Contexto (Tc)</b></p>
      <pre class="metricas-formula">
Tc = N - número de médicos
Tc = ${totalPacientes} - ${qtdMedicos}
<b>Tc = ${totalPacientes - qtdMedicos}</b></pre>
    </div>

    <!-- Utilização -->
    <div class="metricas-bloco">
      <p><b>Taxa Média de Utilização dos Médicos (U)</b></p>
      <pre class="metricas-formula">
U = (Σ tempo ocupado) / (tempo total × médicos) × 100
U = (${somaOcupacao}) / (${tempoCorrente} × ${qtdMedicos}) × 100
<b>U = ${taxaUtilizacao}%</b></pre>
    </div>
  </div>
`;
}

// ===================================================================
// FUNÇÃO DE DESENHO DO GRÁFICO DE GANTT (ESPECÍFICA PARA PRIORIDADE)
// ===================================================================
function prioridade_desenharGantt(context, execucoes) {
  const paletaCores = ["#2b4c7e", "#4c7e2b", "#7e2b4c", "#c47e1c"];
  const alturaBarra = 30;
  const espacoVertical = 10;
  const margemEsquerda = 60;

  if (!execucoes || execucoes.length === 0) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    return;
  }

  // --- Ajuste dinâmico do tamanho do canvas ---
  const tempoMaximo = Math.max(...execucoes.map((p) => p.fim));
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
  context.fillText("Pacientes (Escalonamento por Prioridade)", 5, 20);
}

// ===================================================================
// REGISTRO DE EVENTOS (ESPECÍFICO PARA PRIORIDADE)
// ===================================================================
function prioridade_registrarEvento(container, mensagem) {
  const paragrafo = document.createElement("p");
  paragrafo.innerHTML = mensagem;
  container.appendChild(paragrafo);
  container.scrollTop = container.scrollHeight;
}
