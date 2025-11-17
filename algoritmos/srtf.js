function executeSRTF(patientList, doctorsCount) {
  const canvasGantt = document.getElementById("canvasGantt");
  const metricsPanel = document.getElementById("painelMetricas");
  const eventsPanel = document.getElementById("painelEventos");

  const context = canvasGantt.getContext("2d");
  context.clearRect(0, 0, canvasGantt.width, canvasGantt.height);
  metricsPanel.innerHTML = "";
  eventsPanel.innerHTML = "";

  patientList = patientList.map(p => ({
    ...p,
    remainingDuration: p.duracao,
    firstStartTime: null,
    lastEndTime: null
  }));
  
  patientList.sort((a, b) => a.chegada - b.chegada);

  let currentTime = 0;
  let waitingQueue = [];
  let doctors = Array(doctorsCount).fill(null).map(() => ({
    currentPatient: null,
    executionStart: 0
  }));
  let executionHistory = [];
  let completedPatients = [];
  let contextSwitches = -doctorsCount;

  registerEvent(
    eventsPanel,
    `<i class="fa fa-play" style="color: #23501bff"></i> Início da simulação SRTF com ${doctorsCount} médico(s).`
  );

  while (
    patientList.length > 0 ||
    waitingQueue.length > 0 ||
    doctors.some((d) => d.currentPatient !== null)
  ) {
    while (
      patientList.length > 0 &&
      patientList[0].chegada <= currentTime
    ) {
      const newPatient = patientList.shift();
      waitingQueue.push(newPatient);
      registerEvent(
        eventsPanel,
        `<i class="fa fa-user-plus" style="color: #23501bff"></i> ${newPatient.nome} chegou no tempo ${newPatient.chegada}.`
      );
    }

    for (let i = 0; i < doctorsCount; i++) {
      if (doctors[i].currentPatient === null && waitingQueue.length > 0) {
        waitingQueue.sort((a, b) => a.remainingDuration - b.remainingDuration);
        const nextPatient = waitingQueue.shift();
        
        if (nextPatient.firstStartTime === null) {
          nextPatient.firstStartTime = currentTime;
        }

        doctors[i].currentPatient = nextPatient;
        doctors[i].executionStart = currentTime;
        contextSwitches++;

        registerEvent(
          eventsPanel,
          `<i class="fa fa-user-doctor" style="color: #23501bff"></i> ${nextPatient.nome} iniciou com Médico ${i + 1} no tempo ${currentTime}.`
        );
      }
    }

    for (let i = 0; i < doctorsCount; i++) {
      if (doctors[i].currentPatient !== null) {
        const current = doctors[i].currentPatient;
        
        waitingQueue.sort((a, b) => a.remainingDuration - b.remainingDuration);
        const shortestInQueue = waitingQueue.length > 0 ? waitingQueue[0] : null;

        if (shortestInQueue && shortestInQueue.remainingDuration < current.remainingDuration) {
          const waitStart = current.lastEndTime !== null ? current.lastEndTime : current.chegada;
          
          executionHistory.push({
            nome: current.nome,
            chegada: waitStart,
            inicio: doctors[i].executionStart,
            fim: currentTime,
            medico: i + 1
          });

          current.lastEndTime = currentTime;

          registerEvent(
            eventsPanel,
            `<i class="fa fa-pause" style="color: #c47e1c"></i> ${current.nome} foi interrompido por ${shortestInQueue.nome} no Médico ${i + 1}.`
          );

          waitingQueue.push(current);
          waitingQueue.shift();
          
          doctors[i].currentPatient = shortestInQueue;
          doctors[i].executionStart = currentTime;
          
          if (shortestInQueue.firstStartTime === null) {
            shortestInQueue.firstStartTime = currentTime;
          }

          contextSwitches++;

          registerEvent(
            eventsPanel,
            `<i class="fa fa-user-doctor" style="color: #23501bff"></i> ${shortestInQueue.nome} iniciou com Médico ${i + 1} no tempo ${currentTime}.`
          );
        }
      }
    }

    for (let i = 0; i < doctorsCount; i++) {
      if (doctors[i].currentPatient !== null) {
        doctors[i].currentPatient.remainingDuration--;

        if (doctors[i].currentPatient.remainingDuration === 0) {
          const finishedPatient = doctors[i].currentPatient;
          const waitStart = finishedPatient.lastEndTime !== null ? finishedPatient.lastEndTime : finishedPatient.chegada;

          executionHistory.push({
            nome: finishedPatient.nome,
            chegada: waitStart,
            inicio: doctors[i].executionStart,
            fim: currentTime + 1,
            medico: i + 1
          });

          completedPatients.push(finishedPatient);

          registerEvent(
            eventsPanel,
            `<i class="fa fa-check" style="color: #23501bff"></i> ${finishedPatient.nome} finalizou com Médico ${i + 1} no tempo ${currentTime + 1}.`
          );

          doctors[i].currentPatient = null;
        }
      }
    }

    currentTime++;
  }

  drawGantt(context, executionHistory);

  let totalWait = 0;
  let totalTurnaround = 0;
  let totalOccupation = 0;
  let waitDetails = [];
  let turnaroundDetails = [];

  completedPatients.forEach(patient => {
    const patientExecutions = executionHistory.filter(h => h.nome === patient.nome);
    const completionTime = patientExecutions.reduce((max, h) => Math.max(max, h.fim), 0);
    const totalExecutionTime = patientExecutions.reduce((sum, h) => sum + (h.fim - h.inicio), 0);
    
    const turnaroundTime = completionTime - patient.chegada;
    const waitTime = turnaroundTime - totalExecutionTime;
    
    totalWait += waitTime;
    totalTurnaround += turnaroundTime;
    totalOccupation += patient.duracao;
    
    waitDetails.push(`${patient.nome}: ${waitTime}`);
    turnaroundDetails.push(`${patient.nome}: ${turnaroundTime}`);
  });

  const totalPatients = completedPatients.length;
  const avgWait = (totalWait / totalPatients).toFixed(2);
  const avgTurnaround = (totalTurnaround / totalPatients).toFixed(2);
  const utilizationRate = (
    (totalOccupation / (currentTime * doctorsCount)) * 100
  ).toFixed(2);

  metricsPanel.innerHTML = `
    <p><b><i class="fa fa-hourglass-start" style="color: #23501bff"></i> Tempo Médio de Espera:</b> ${avgWait} <span style="color: #666; font-size: 0.9em;">(${waitDetails.join(', ')})</span></p>
    <p><b><i class="fa fa-clock" style="color: #23501bff"></i> Tempo Médio de Execução (Turnaround):</b> ${avgTurnaround} <span style="color: #666; font-size: 0.9em;">(${turnaroundDetails.join(', ')})</span></p>
    <p><b><i class="fa fa-exchange-alt" style="color: #23501bff"></i> Total de Trocas de Contexto:</b> ${contextSwitches}</p>
    <p><b><i class="fa fa-user-md" style="color: #23501bff"></i> Utilização Média dos Médicos:</b> ${utilizationRate}%</p>
  `;

  registerEvent(
    eventsPanel,
    `<i class="fa fa-check" style="color: #23501bff"></i> Simulação finalizada no tempo ${currentTime}.`
  );
}

function drawGantt(context, executions) {
  const colorPalette = ["#2b4c7e", "#4c7e2b", "#7e2b4c", "#c47e1c"];
  const barHeight = 30;
  const verticalSpace = 10;
  const leftMargin = 60;

  const maxTime = Math.max(...executions.map((patient) => patient.fim));
  const canvasWidth = Math.max(maxTime * 40 + 100, 900);
  const canvasHeight = (executions.length + 2) * (barHeight + verticalSpace);

  context.canvas.width = canvasWidth;
  context.canvas.height = canvasHeight;
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  const baseY = canvasHeight - 40;

  context.font = "12px Arial";
  context.fillStyle = "#333";
  for (let t = 0; t <= maxTime; t++) {
    const x = leftMargin + t * 40;
    context.fillText(t.toString(), x, baseY + 20);
    context.beginPath();
    context.moveTo(x, baseY);
    context.lineTo(x, 20);
    context.strokeStyle = "#eee";
    context.stroke();
  }

  executions.forEach((patient, i) => {
    const y = baseY - (i + 1) * (barHeight + verticalSpace);
    const color = colorPalette[(patient.medico - 1) % colorPalette.length];

    const xArrival = leftMargin + patient.chegada * 40;
    const xStart = leftMargin + patient.inicio * 40;
    const xEnd = leftMargin + patient.fim * 40;

    context.strokeStyle = color;
    context.lineWidth = 2;
    context.strokeRect(xArrival, y, xEnd - xArrival, barHeight);

    context.fillStyle = color;
    context.fillRect(xStart, y, xEnd - xStart, barHeight);

    context.fillStyle = "#fff";
    context.fillText(patient.nome, xStart + 5, y + 20);

    context.fillStyle = "#333";
    context.fillText(`(${patient.inicio}-${patient.fim})`, xEnd + 5, y + 20);
  });

  context.beginPath();
  context.moveTo(leftMargin, baseY);
  context.lineTo(canvasWidth - 20, baseY);
  context.lineWidth = 2;
  context.strokeStyle = "#333";
  context.stroke();

  context.fillStyle = "#000";
  context.font = "bold 13px Arial";
  context.fillText("Patients", 5, 20);
}

function registerEvent(container, message) {
  const paragraph = document.createElement("p");
  paragraph.innerHTML = message;
  container.appendChild(paragraph);
  container.scrollTop = container.scrollHeight;
}
