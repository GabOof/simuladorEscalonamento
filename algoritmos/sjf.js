function simularSJF(pacientes, medicos) {
  const gantt = document.getElementById("gantt");
  const metricas = document.getElementById("metricas");
  gantt.innerHTML = "";
  metricas.innerHTML = "";

  pacientes.sort((a, b) => a.chegada - b.chegada);

  console.log("SJF iniciado com", pacientes.length, "pacientes");
}
