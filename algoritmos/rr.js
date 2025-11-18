function executeRR(patientList, doctorsCount, quantum) {
  const canvasGantt = document.getElementById("canvasGantt");
  const metricsPanel = document.getElementById("painelMetricas");
  const eventsPanel = document.getElementById("painelEventos");

  const context = canvasGantt.getContext("2d");
  context.clearRect(0, 0, canvasGantt.width, canvasGantt.height);
  metricsPanel.innerHTML = "";
  eventsPanel.innerHTML = "";

  patientList = patientList.map((p) => ({
    ...p,
    remainingDuration: p.duracao,
    firstStartTime: null,
    lastEndTime: null,
  }));

  patientList.sort((a, b) => a.chegada - b.chegada);

  let currentTime = 0;
  let waitingQueue = [];
  let doctors = Array(doctorsCount)
    .fill(null)
    .map(() => ({
      currentPatient: null,
      executionStart: 0,
      timeSlice: 0,
    }));
  let executionHistory = [];
  let completedPatients = [];
  let contextSwitches = -doctorsCount;

  registerEvent(
    eventsPanel,
    `<i class="fa fa-play" style="color: #23501bff"></i> Início da simulação Round-Robin com ${doctorsCount} médico(s).`
  );

  while (
    patientList.length > 0 ||
    waitingQueue.length > 0 ||
    doctors.some((d) => d.currentPatient !== null)
  ) {
    while (patientList.length > 0 && patientList[0].chegada <= currentTime) {
      const newPatient = patientList.shift();
      waitingQueue.push(newPatient);
      registerEvent(
        eventsPanel,
        `<i class="fa fa-user-plus" style="color: #23501bff"></i> ${newPatient.nome} chegou no tempo ${newPatient.chegada}.`
      );
    }

    for (let i = 0; i < doctorsCount; i++) {
      const doctor = doctors[i];

      if (doctor.currentPatient === null && waitingQueue.length > 0) {
        const nextPatient = waitingQueue.shift();

        if (nextPatient.firstStartTime === null) {
          nextPatient.firstStartTime = currentTime;
        }

        doctor.currentPatient = nextPatient;
        doctor.executionStart = currentTime;
        doctor.timeSlice = 0;
        contextSwitches++;

        registerEvent(
          eventsPanel,
          `<i class="fa fa-user-doctor" style="color: #23501bff"></i> ${
            nextPatient.nome
          } iniciou com Médico ${i + 1} no tempo ${currentTime}.`
        );
      }
    }

    for (let i = 0; i < doctorsCount; i++) {
      const doctor = doctors[i];
      const current = doctor.currentPatient;

      if (current !== null) {
        current.remainingDuration--;
        doctor.timeSlice++;

        if (current.remainingDuration === 0 || doctor.timeSlice === quantum) {
          const endTime = currentTime + 1;

          executionHistory.push({
            nome: current.nome,
            chegada: current.chegada,
            inicio: doctor.executionStart,
            fim: endTime,
            medico: i + 1,
          });

          if (current.remainingDuration === 0) {
            completedPatients.push(current);
            registerEvent(
              eventsPanel,
              `<i class="fa fa-check" style="color: #23501bff"></i> ${
                current.nome
              } finalizou com Médico ${i + 1} no tempo ${endTime}.`
            );
          } else {
            current.lastEndTime = endTime;
            waitingQueue.push(current);
            registerEvent(
              eventsPanel,
              `<i class="fa fa-ban" style="color: #23501bff"></i> ${
                current.nome
              } foi interrompido após ${quantum} unidades no Médico ${i + 1}.`
            );
          }

          doctor.currentPatient = null;
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

  completedPatients.forEach((patient) => {
    const patientExecutions = executionHistory.filter(
      (h) => h.nome === patient.nome
    );
    const completionTime = Math.max(...patientExecutions.map((h) => h.fim));
    const totalExecutionTime = patientExecutions.reduce(
      (sum, h) => sum + (h.fim - h.inicio),
      0
    );

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
    (totalOccupation / (currentTime * doctorsCount)) *
    100
  ).toFixed(2);

  metricsPanel.innerHTML = `
    <p><b><i class="fa fa-hourglass-start" style="color: #23501bff"></i> Tempo Médio de Espera:</b> ${avgWait} <span style="color: #666; font-size: 0.9em;">(${waitDetails.join(
    ", "
  )})</span></p>
    <p><b><i class="fa fa-clock" style="color: #23501bff"></i> Tempo Médio de Execução (Turnaround):</b> ${avgTurnaround} <span style="color: #666; font-size: 0.9em;">(${turnaroundDetails.join(
    ", "
  )})</span></p>
    <p><b><i class="fa fa-exchange-alt" style="color: #23501bff"></i> Total de Trocas de Contexto:</b> ${contextSwitches}</p>
    <p><b><i class="fa fa-user-md" style="color: #23501bff"></i> Utilização Média dos Médicos:</b> ${utilizationRate}%</p>
  `;

  registerEvent(
    eventsPanel,
    `<i class="fa fa-check" style="color: #23501bff"></i> Simulação finalizada no tempo ${currentTime}.`
  );
}
