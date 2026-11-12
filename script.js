// =========================================================================
// 1. SIMULAÇÃO DO BANCO DE DADOS RELACIONAL (Modelo 1:N e Vínculos)
// =========================================================================

// Tabela: Turmas
const dbTurmas = [
    { id: "1A-DS", nome: "1º Ano A - Desenvolvimento de Sistemas", qtdAlunos: 35 },
    { id: "2B-DS", nome: "2º Ano B - Desenvolvimento de Sistemas", qtdAlunos: 32 },
    { id: "3A-INFO", nome: "3º Ano A - Informática", qtdAlunos: 28 }
];

// Tabela: Professores e seus vínculos com Turmas (Relacionamento N:N)
const dbProfessores = [
    { 
        id: 1, 
        nome: "Prof. Carlos Mendes", 
        disciplina: "Programação Web", 
        turmasIds: ["1A-DS", "2B-DS"] 
    },
    { 
        id: 2, 
        nome: "Profa. Ana Beatriz", 
        disciplina: "Banco de Dados", 
        turmasIds: ["2B-DS", "3A-INFO"] 
    }
];

// Tabela: Agendamentos Coletivos (Lógica 1:N -> 1 Monitor para 1 Turma inteira)
let dbAgendamentosColetivos = [
    {
        id: 101,
        data: "2026-11-16",
        turmaId: "1A-DS",
        professorNome: "Prof. Carlos Mendes",
        monitor: "João Silva (Programação Web)",
        tema: "Revisão de HTML Semântico e CSS Grid"
    },
    {
        id: 102,
        data: "2026-11-18",
        turmaId: "2B-DS",
        professorNome: "Profa. Ana Beatriz",
        monitor: "Maria Souza (Banco de Dados)",
        tema: "Modelagem Entidade-Relacionamento (MER)"
    },
    {
        id: 103,
        data: "2026-11-20",
        turmaId: "2B-DS",
        professorNome: "Prof. Carlos Mendes",
        monitor: "João Silva (Programação Web)",
        tema: "Manipulação de DOM com JavaScript"
    }
];

// =========================================================================
// 2. CONTROLE DE ACESSO (RBAC - Roles)
// =========================================================================

function mudarPerfil() {
    const perfil = document.getElementById("perfil-usuario").value;

    const painelProfessor = document.getElementById("painel-professor");
    const painelGestor = document.getElementById("painel-gestor");
    const navProfessor = document.getElementById("nav-professor");
    const navGestor = document.getElementById("nav-gestor");
    const blocoDiretoria = document.getElementById("bloco-diretoria");
    const tituloGestor = document.getElementById("titulo-painel-gestor");

    // Oculta tudo por padrão
    painelProfessor.classList.add("hidden");
    painelGestor.classList.add("hidden");
    navProfessor.classList.add("hidden");
    navGestor.classList.add("hidden");

    if (perfil === "professor") {
        painelProfessor.classList.remove("hidden");
        navProfessor.classList.remove("hidden");
    } else if (perfil === "pedagogico") {
        painelGestor.classList.remove("hidden");
        navGestor.classList.remove("hidden");
        tituloGestor.textContent = "Painel Pedagógico - Acompanhamento de Turmas";
        blocoDiretoria.classList.add("hidden"); // Pedagógico foca nas turmas
        atualizarDashboardGestor();
    } else if (perfil === "direcao") {
        painelGestor.classList.remove("hidden");
        navGestor.classList.remove("hidden");
        tituloGestor.textContent = "Painel Diretivo - Indicadores Globais e Monitores";
        blocoDiretoria.classList.remove("hidden"); // Direção vê tudo
        atualizarDashboardGestor();
    }
}

// =========================================================================
// 3. LÓGICA DO PAINEL DO PROFESSOR
// =========================================================================

function inicializarFormularioProfessor() {
    const selectProf = document.getElementById("select-professor");
    selectProf.innerHTML = "";

    dbProfessores.forEach(prof => {
        const option = document.createElement("option");
        option.value = prof.id;
        option.textContent = `${prof.nome} (${prof.disciplina})`;
        selectProf.appendChild(option);
    });

    carregarTurmasDoProfessor();
}

function carregarTurmasDoProfessor() {
    const profId = parseInt(document.getElementById("select-professor").value);
    const professor = dbProfessores.find(p => p.id === profId);
    const selectTurma = document.getElementById("select-turma");
    
    selectTurma.innerHTML = "";

    professor.turmasIds.forEach(turmaId => {
        const turma = dbTurmas.find(t => t.id === turmaId);
        if (turma) {
            const option = document.createElement("option");
            option.value = turma.id;
            option.textContent = `${turma.nome} (${turma.qtdAlunos} alunos)`;
            selectTurma.appendChild(option);
        }
    });
}

document.getElementById("form-agendamento-coletivo").addEventListener("submit", function(event) {
    event.preventDefault();

    const profId = parseInt(document.getElementById("select-professor").value);
    const professor = dbProfessores.find(p => p.id === profId);
    const turmaId = document.getElementById("select-turma").value;
    const monitor = document.getElementById("select-monitor").value;
    const data = document.getElementById("data-monitoria").value;
    const tema = document.getElementById("tema-revisao").value;

    const novoAgendamento = {
        id: Date.now(),
        data: data,
        turmaId: turmaId,
        professorNome: professor.nome,
        monitor: monitor,
        tema: tema
    };

    dbAgendamentosColetivos.push(novoAgendamento);
    renderizarTabelaAgendamentos();
    atualizarDashboardGestor();

    alert(`Monitoria coletiva agendada com sucesso para a turma ${turmaId}!`);
    this.reset();
    carregarTurmasDoProfessor();
});

// =========================================================================
// 4. RENDERIZAÇÃO DA AGENDA E DASHBOARD GESTOR
// =========================================================================

function renderizarTabelaAgendamentos() {
    const tbody = document.getElementById("tabela-agendamentos");
    tbody.innerHTML = "";

    dbAgendamentosColetivos.forEach(ag => {
        const turma = dbTurmas.find(t => t.id === ag.turmaId);
        const dataFormatada = ag.data.split("-").reverse().join("/");

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${dataFormatada}</td>
            <td><strong>${turma.id}</strong> (${turma.qtdAlunos} alunos)</td>
            <td>${ag.professorNome}</td>
            <td>${ag.monitor}</td>
            <td>${ag.tema}</td>
        `;
        tbody.appendChild(tr);
    });
}

function atualizarDashboardGestor() {
    // 1. Cálculo de KPIs
    const totalSessoes = dbAgendamentosColetivos.length;
    let totalAlunosImpactados = 0;
    const contagemPorTurma = {};

    dbAgendamentosColetivos.forEach(ag => {
        const turma = dbTurmas.find(t => t.id === ag.turmaId);
        if (turma) {
            totalAlunosImpactados += turma.qtdAlunos;
            contagemPorTurma[turma.id] = (contagemPorTurma[turma.id] || 0) + 1;
        }
    });

    // Descobre turma mais ativa
    let turmaTop = "-";
    let maxSessoes = 0;
    for (const [turmaId, qtd] of Object.entries(contagemPorTurma)) {
        if (qtd > maxSessoes) {
            maxSessoes = qtd;
            turmaTop = turmaId;
        }
    }

    document.getElementById("kpi-sessoes").textContent = totalSessoes;
    document.getElementById("kpi-alunos").textContent = totalAlunosImpactados;
    document.getElementById("kpi-turma-top").textContent = turmaTop;

    // 2. Gráfico de barras de engajamento por turma
    const containerBarras = document.getElementById("grafico-turmas");
    containerBarras.innerHTML = "";

    dbTurmas.forEach(turma => {
        const sessoes = contagemPorTurma[turma.id] || 0;
        const percentual = totalSessoes > 0 ? Math.round((sessoes / totalSessoes) * 100) : 0;

        containerBarras.innerHTML += `
            <div class="barra-item">
                <div class="barra-info">
                    <span><strong>${turma.nome}</strong></span>
                    <span>${sessoes} monitoria(s) (${percentual}%)</span>
                </div>
                <div class="barra-fundo">
                    <div class="barra-preenchimento" style="width: ${percentual}%"></div>
                </div>
            </div>
        `;
    });

    // 3. Tabela de desempenho dos monitores (Diretoria)
    const tbodyMonitores = document.getElementById("tabela-desempenho-monitores");
    const sessoesJoao = dbAgendamentosColetivos.filter(a => a.monitor.includes("João Silva")).length;
    const sessoesMaria = dbAgendamentosColetivos.filter(a => a.monitor.includes("Maria Souza")).length;

    tbodyMonitores.innerHTML = `
        <tr>
            <td>João Silva</td>
            <td>Programação Web</td>
            <td>${sessoesJoao} turma(s)</td>
            <td>4.9 / 5.0</td>
        </tr>
        <tr>
            <td>Maria Souza</td>
            <td>Banco de Dados</td>
            <td>${sessoesMaria} turma(s)</td>
            <td>5.0 / 5.0</td>
        </tr>
    `;
}

// Inicialização da aplicação
inicializarFormularioProfessor();
renderizarTabelaAgendamentos();
atualizarDashboardGestor();