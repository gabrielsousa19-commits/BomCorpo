function salvarUsuario(usuario) {
  localStorage.setItem("usuario", JSON.stringify(usuario));
}

function pegarUsuario() {
  return JSON.parse(localStorage.getItem("usuario"));
}

function estaLogado() {
  return localStorage.getItem("logado") === "true";
}

function logar() {
  localStorage.setItem("logado", "true");
}

function logout() {
  localStorage.removeItem("logado");
  window.location.href = "index.html";
}

function protegerPagina() {
  if (!estaLogado()) {
    window.location.href = "login.html";
  }
}

function criarConta(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!nome || !email || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  const usuario = { nome, email, senha };
  salvarUsuario(usuario);
  logar();

  window.location.href = "onboarding.html";
}

function fazerLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const usuario = pegarUsuario();

  if (!usuario) {
    alert("Nenhuma conta encontrada. Crie uma conta primeiro.");
    return;
  }

  if (email === usuario.email && senha === usuario.senha) {
    logar();

    const dados = JSON.parse(localStorage.getItem("dadosSaude"));
    if (dados) {
      window.location.href = "inicio.html";
    } else {
      window.location.href = "onboarding.html";
    }
  } else {
    alert("E-mail ou senha incorretos.");
  }
}

function calcularIdade(dataNascimento) {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);

  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  return idade;
}

function salvarOnboarding(event) {
  event.preventDefault();

  const nascimento = document.getElementById("nascimento").value;
  const idadeCalculada = calcularIdade(nascimento);

  const dados = {
    objetivo: document.getElementById("objetivo").value,
    nascimento: nascimento,
    idade: idadeCalculada,
    sexo: document.getElementById("sexo").value,
    altura: Number(document.getElementById("altura").value),
    peso: Number(document.getElementById("peso").value),
    atividade: Number(document.getElementById("atividade").value),
    treinosSemana: Number(document.getElementById("treinosSemana").value)
  };

  localStorage.setItem("dadosSaude", JSON.stringify(dados));
  window.location.href = "inicio.html";
}

function pegarDadosSaude() {
  const dados = JSON.parse(localStorage.getItem("dadosSaude"));
  if (!dados) return null;

  if (dados.nascimento) {
    dados.idade = calcularIdade(dados.nascimento);
    localStorage.setItem("dadosSaude", JSON.stringify(dados));
  }

  return dados;
}

function calcularIMC(peso, alturaCm) {
  const alturaM = alturaCm / 100;
  return peso / (alturaM * alturaM);
}

function classificarIMC(imc) {
  if (imc < 18.5) return "Abaixo do peso";
  if (imc < 25) return "Peso normal";
  if (imc < 30) return "Sobrepeso";
  return "Obesidade";
}

function calcularTMB(sexo, peso, altura, idade) {
  if (sexo === "Masculino") {
    return 10 * peso + 6.25 * altura - 5 * idade + 5;
  }
  return 10 * peso + 6.25 * altura - 5 * idade - 161;
}

function calcularCalorias(dados) {
  const tmb = calcularTMB(dados.sexo, dados.peso, dados.altura, dados.idade);
  return Math.round(tmb * dados.atividade);
}

function pegarTreinosConcluidos() {
  return JSON.parse(localStorage.getItem("treinosConcluidos")) || [];
}

function salvarTreinosConcluidos(lista) {
  localStorage.setItem("treinosConcluidos", JSON.stringify(lista));
}

function nomeDiaHoje() {
  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  return dias[new Date().getDay()];
}

function marcarTreinoHoje() {
  const hojeDia = nomeDiaHoje();
  const hojeData = dataHojeISO();

  let treinos = pegarTreinosConcluidos();
  let historico = pegarHistoricoTreinos();

  if (!treinos.includes(hojeDia)) {
    treinos.push(hojeDia);
    salvarTreinosConcluidos(treinos);
  }

  if (!historico.includes(hojeData)) {
    historico.push(hojeData);
    salvarHistoricoTreinos(historico);
  }

  renderizarFoguinhos();
  atualizarPainelStreak();
  carregarInicioNovo();

  alert("Treino de hoje marcado como concluído.");
}

function renderizarFoguinhos() {
  const fogoGrid = document.getElementById("fogoGrid");
  if (!fogoGrid) return;

  const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const treinos = pegarTreinosConcluidos();

  fogoGrid.innerHTML = dias.map(dia => `
    <div class="fogo-card">
      <div class="fogo-dia">${dia}</div>
      <div class="fogo-icone ${treinos.includes(dia) ? "fogo-ativo" : "fogo-inativo"}">🔥</div>
    </div>
  `).join("");
}

function gerarTreinosPorSemana(qtd) {
  const planos = {
    2: [
      { nome: "Treino A", desc: "Corpo inteiro: pernas, peito, costas e abdômen." },
      { nome: "Treino B", desc: "Corpo inteiro com foco em resistência e técnica." }
    ],
    3: [
      { nome: "Treino A", desc: "Peito, ombro e tríceps." },
      { nome: "Treino B", desc: "Costas e bíceps." },
      { nome: "Treino C", desc: "Pernas e abdômen." }
    ],
    4: [
      { nome: "Treino A", desc: "Peito e tríceps." },
      { nome: "Treino B", desc: "Costas e bíceps." },
      { nome: "Treino C", desc: "Pernas." },
      { nome: "Treino D", desc: "Ombro e abdômen." }
    ],
    5: [
      { nome: "Treino A", desc: "Peito." },
      { nome: "Treino B", desc: "Costas." },
      { nome: "Treino C", desc: "Pernas." },
      { nome: "Treino D", desc: "Ombros." },
      { nome: "Treino E", desc: "Braços e abdômen." }
    ],
    6: [
      { nome: "Treino A", desc: "Peito e tríceps." },
      { nome: "Treino B", desc: "Costas e bíceps." },
      { nome: "Treino C", desc: "Pernas anteriores." },
      { nome: "Treino D", desc: "Ombro e abdômen." },
      { nome: "Treino E", desc: "Posterior de pernas e glúteos." },
      { nome: "Treino F", desc: "Braços e cardio leve." }
    ]
  };

  return planos[qtd] || [];
}

function gerarDietaTexto(objetivo) {
  if (objetivo === "Emagrecer") {
    return {
      estrategia: "Déficit calórico leve, foco em proteínas, vegetais, frutas e menos ultraprocessados.",
      cafe: "Ovos, fruta e aveia.",
      almoco: "Arroz, feijão, frango grelhado e salada.",
      lanche: "Iogurte natural ou fruta com castanhas.",
      jantar: "Proteína magra, legumes e carboidrato moderado."
    };
  }

  if (objetivo === "Ganhar massa") {
    return {
      estrategia: "Superávit calórico moderado, com proteínas e carboidratos de qualidade.",
      cafe: "Ovos, pão integral, banana e leite.",
      almoco: "Arroz, feijão, carne magra, legumes e salada.",
      lanche: "Vitamina com fruta, aveia e pasta de amendoim.",
      jantar: "Frango, macarrão ou arroz, legumes e fonte proteica."
    };
  }

  return {
    estrategia: "Dieta equilibrada com proteínas, carboidratos complexos, gorduras boas e hidratação.",
    cafe: "Fruta, ovos e pão integral.",
    almoco: "Prato balanceado com proteína, arroz, feijão e salada.",
    lanche: "Iogurte, fruta ou sanduíche leve.",
    jantar: "Refeição leve e nutritiva com boa distribuição de nutrientes."
  };
}

function carregarInicio() {
  const usuario = pegarUsuario();
  const dados = pegarDadosSaude();
  if (!usuario || !dados) return;

  const imc = calcularIMC(dados.peso, dados.altura).toFixed(1);
  const calorias = calcularCalorias(dados);
  const classificacao = classificarIMC(Number(imc));
  const planoTreinos = gerarTreinosPorSemana(dados.treinosSemana);

  const hojeIndice = new Date().getDay();
  const indicePlano = hojeIndice === 0 ? 0 : (hojeIndice - 1) % planoTreinos.length;
  const treinoHoje = planoTreinos[indicePlano] || {
    nome: "Descanso",
    desc: "Hoje é um bom dia para recuperação."
  };

  document.getElementById("nomeUsuarioInicio").textContent = usuario.nome;
  document.getElementById("objetivoInicio").textContent = dados.objetivo;
  document.getElementById("imcInicio").textContent = `${imc} • ${classificacao}`;
  document.getElementById("caloriasInicio").textContent = `${calorias} kcal/dia`;
  document.getElementById("frequenciaInicio").textContent = `${dados.treinosSemana}x por semana`;
  document.getElementById("treinoHojeTitulo").textContent = treinoHoje.nome;
  document.getElementById("treinoHojeTexto").textContent = treinoHoje.desc;
}

function carregarTreinos() {
  const dados = pegarDadosSaude();
  if (!dados) return;

  const lista = gerarTreinosPorSemana(dados.treinosSemana);
  const container = document.getElementById("treinosLista");
  const resumo = document.getElementById("treinosResumo");

  resumo.textContent = `Seu plano foi montado para ${dados.treinosSemana} treinos por semana, com foco em ${dados.objetivo.toLowerCase()}.`;

  container.innerHTML = lista.map(item => `
    <div class="card-coracao card-doenca">
      <h3>${item.nome}</h3>
      <p>${item.desc}</p>
    </div>
  `).join("");
}

function carregarDieta() {
  const dados = pegarDadosSaude();
  if (!dados) return;

  const calorias = calcularCalorias(dados);
  const dieta = gerarDietaTexto(dados.objetivo);

  document.getElementById("metaCalorica").textContent = `${calorias} kcal/dia estimadas`;
  document.getElementById("estrategiaDieta").textContent = dieta.estrategia;
  document.getElementById("cafeManha").textContent = dieta.cafe;
  document.getElementById("almoco").textContent = dieta.almoco;
  document.getElementById("lanche").textContent = dieta.lanche;
  document.getElementById("jantar").textContent = dieta.jantar;
}

function gerarResumoProgresso(dados, treinosFeitos) {
  if (!dados) {
    return "Acompanhe sua evolução e mantenha sua consistência semanal.";
  }

  if (treinosFeitos === 0) {
    return `Seu foco atual é ${dados.objetivo.toLowerCase()}. Comece marcando seu primeiro treino da semana.`;
  }

  if (treinosFeitos >= dados.treinosSemana) {
    return `Excelente! Você já completou sua meta semanal de ${dados.treinosSemana} treino(s).`;
  }

  return `Você já concluiu ${treinosFeitos} treino(s) nesta semana. Continue firme no objetivo de ${dados.objetivo.toLowerCase()}.`;
}
function carregarPerfil() {
  const usuario = pegarUsuario();
  const dados = pegarDadosSaude();
  if (!usuario || !dados) return;

  document.getElementById("perfilNome").textContent = usuario.nome;
  document.getElementById("perfilEmail").textContent = usuario.email;
  document.getElementById("perfilObjetivo").textContent = dados.objetivo;
  document.getElementById("perfilNascimento").textContent = dados.nascimento;
  document.getElementById("perfilIdade").textContent = `${dados.idade} anos`;
  document.getElementById("perfilCorpo").textContent = `${dados.altura} cm • ${dados.peso} kg`;
  document.getElementById("perfilTreinos").textContent = `${dados.treinosSemana}x por semana`;
}
function traduzirAtividade(valor) {
  const atividade = Number(valor);

  if (atividade === 1.2) return "Sedentário";
  if (atividade === 1.375) return "Leve";
  if (atividade === 1.55) return "Moderado";
  if (atividade === 1.725) return "Intenso";

  return "Não informado";
}

function gerarFrasePerfil(objetivo, treinosSemana) {
  if (!objetivo || !treinosSemana) {
    return "Seu perfil de saúde e treino personalizado.";
  }

  return `Foco atual: ${objetivo.toLowerCase()} com uma rotina de ${treinosSemana} treino(s) por semana.`;
}

function formatarDataBR(dataISO) {
  if (!dataISO) return "Não informado";

  const data = new Date(dataISO + "T00:00:00");
  return data.toLocaleDateString("pt-BR");
}

function carregarPerfilNovo() {
  const usuario = pegarUsuario();
  const dados = pegarDadosSaude();
  if (!usuario || !dados) return;

  const inicial = usuario.nome ? usuario.nome.trim().charAt(0).toUpperCase() : "U";

  document.getElementById("perfilAvatar").textContent = inicial;
  document.getElementById("perfilNomeTopo").textContent = usuario.nome;
  document.getElementById("perfilFrase").textContent = gerarFrasePerfil(dados.objetivo, dados.treinosSemana);

  document.getElementById("perfilNome").textContent = usuario.nome;
  document.getElementById("perfilEmail").textContent = usuario.email;
  document.getElementById("perfilNascimento").textContent = formatarDataBR(dados.nascimento);
  document.getElementById("perfilIdade").textContent = `${dados.idade} anos`;
  document.getElementById("perfilObjetivo").textContent = dados.objetivo;
  document.getElementById("perfilCorpo").textContent = `${dados.altura} cm • ${dados.peso} kg`;
  document.getElementById("perfilTreinos").textContent = `${dados.treinosSemana}x por semana`;
  document.getElementById("perfilAtividade").textContent = traduzirAtividade(dados.atividade);
}
function pegarHistoricoTreinos() {
  return JSON.parse(localStorage.getItem("historicoTreinos")) || [];
}

function salvarHistoricoTreinos(lista) {
  localStorage.setItem("historicoTreinos", JSON.stringify(lista));
}

function dataHojeISO() {
  const hoje = new Date();
  return hoje.toISOString().split("T")[0];
}

function calcularSequenciaAtual(historico) {
  if (!historico.length) return 0;

  const ordenado = [...historico].sort();
  let sequencia = 1;

  for (let i = ordenado.length - 1; i > 0; i--) {
    const atual = new Date(ordenado[i]);
    const anterior = new Date(ordenado[i - 1]);

    const diff = (atual - anterior) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      sequencia++;
    } else if (diff > 1) {
      break;
    }
  }

  return sequencia;
}

function calcularRecordeSequencia(historico) {
  if (!historico.length) return 0;

  const ordenado = [...historico].sort();
  let recorde = 1;
  let atual = 1;

  for (let i = 1; i < ordenado.length; i++) {
    const dataAtual = new Date(ordenado[i]);
    const dataAnterior = new Date(ordenado[i - 1]);

    const diff = (dataAtual - dataAnterior) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      atual++;
      if (atual > recorde) recorde = atual;
    } else if (diff > 1) {
      atual = 1;
    }
  }

  return recorde;
}

function calcularMetaSemanal(dados, treinosFeitos) {
  const meta = dados?.treinosSemana || 0;
  const feitos = treinosFeitos.length;
  const percentual = meta > 0 ? Math.min(100, Math.round((feitos / meta) * 100)) : 0;

  return {
    meta,
    feitos,
    percentual
  };
}

function gerarMensagemStreak(sequencia, feitos, meta) {
  if (feitos === 0) {
    return "Você ainda não marcou nenhum treino nesta semana. Comece hoje e acenda seu primeiro foguinho.";
  }

  if (feitos >= meta) {
    return `Parabéns! Você completou sua meta semanal com ${feitos} treino(s). Continue mantendo essa consistência.`;
  }

  if (sequencia >= 3) {
    return `Você está em uma ótima sequência de ${sequencia} dias. Faltam ${meta - feitos} treino(s) para fechar sua meta semanal.`;
  }

  return `Você já concluiu ${feitos} treino(s) nesta semana. Continue e chegue à meta de ${meta}.`;
}

function atualizarPainelStreak() {
  const dados = pegarDadosSaude();
  if (!dados) return;

  const historico = pegarHistoricoTreinos();
  const treinosSemana = pegarTreinosConcluidos();

  const sequenciaAtual = calcularSequenciaAtual(historico);
  const recorde = calcularRecordeSequencia(historico);
  const metaInfo = calcularMetaSemanal(dados, treinosSemana);
  const mensagem = gerarMensagemStreak(sequenciaAtual, metaInfo.feitos, metaInfo.meta);

  const elSequencia = document.getElementById("sequenciaAtual");
  const elRecorde = document.getElementById("recordeSequencia");
  const elMeta = document.getElementById("metaSemanalTexto");
  const elPercentual = document.getElementById("percentualSemanal");
  const elMensagem = document.getElementById("mensagemStreak");

  if (elSequencia) elSequencia.textContent = `${sequenciaAtual} dia(s)`;
  if (elRecorde) elRecorde.textContent = `${recorde} dia(s)`;
  if (elMeta) elMeta.textContent = `${metaInfo.feitos}/${metaInfo.meta} treino(s)`;
  if (elPercentual) elPercentual.textContent = `${metaInfo.percentual}% concluído`;
  if (elMensagem) elMensagem.textContent = mensagem;
}
function pegarHistoricoTreinos() {
  return JSON.parse(localStorage.getItem("historicoTreinos")) || [];
}

function salvarHistoricoTreinos(lista) {
  localStorage.setItem("historicoTreinos", JSON.stringify(lista));
}

function dataHojeISO() {
  const hoje = new Date();
  return hoje.toISOString().split("T")[0];
}

function calcularSequenciaAtual(historico) {
  if (!historico.length) return 0;

  const ordenado = [...historico].sort();
  let sequencia = 1;

  for (let i = ordenado.length - 1; i > 0; i--) {
    const atual = new Date(ordenado[i]);
    const anterior = new Date(ordenado[i - 1]);
    const diff = (atual - anterior) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      sequencia++;
    } else if (diff > 1) {
      break;
    }
  }

  return sequencia;
}

function calcularRecordeSequencia(historico) {
  if (!historico.length) return 0;

  const ordenado = [...historico].sort();
  let recorde = 1;
  let atual = 1;

  for (let i = 1; i < ordenado.length; i++) {
    const dataAtual = new Date(ordenado[i]);
    const dataAnterior = new Date(ordenado[i - 1]);
    const diff = (dataAtual - dataAnterior) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      atual++;
      if (atual > recorde) recorde = atual;
    } else if (diff > 1) {
      atual = 1;
    }
  }

  return recorde;
}

function calcularMetaSemanal(dados, treinosFeitos) {
  const meta = dados?.treinosSemana || 0;
  const feitos = treinosFeitos.length;
  const percentual = meta > 0 ? Math.min(100, Math.round((feitos / meta) * 100)) : 0;

  return {
    meta,
    feitos,
    percentual
  };
}

function gerarMensagemStreak(sequencia, feitos, meta) {
  if (feitos === 0) {
    return "Você ainda não marcou nenhum treino nesta semana. Comece hoje e acenda seu primeiro foguinho.";
  }

  if (feitos >= meta) {
    return `Parabéns! Você completou sua meta semanal com ${feitos} treino(s). Continue mantendo essa consistência.`;
  }

  if (sequencia >= 3) {
    return `Você está em uma ótima sequência de ${sequencia} dias. Faltam ${meta - feitos} treino(s) para fechar sua meta semanal.`;
  }

  return `Você já concluiu ${feitos} treino(s) nesta semana. Continue e chegue à meta de ${meta}.`;
}

function atualizarPainelStreak() {
  const dados = pegarDadosSaude();
  if (!dados) return;

  const historico = pegarHistoricoTreinos();
  const treinosSemana = pegarTreinosConcluidos();

  const sequenciaAtual = calcularSequenciaAtual(historico);
  const recorde = calcularRecordeSequencia(historico);
  const metaInfo = calcularMetaSemanal(dados, treinosSemana);
  const mensagem = gerarMensagemStreak(sequenciaAtual, metaInfo.feitos, metaInfo.meta);

  const elSequencia = document.getElementById("sequenciaAtual");
  const elRecorde = document.getElementById("recordeSequencia");
  const elMeta = document.getElementById("metaSemanalTexto");
  const elPercentual = document.getElementById("percentualSemanal");
  const elMensagem = document.getElementById("mensagemStreak");
  const elBarra = document.getElementById("barraProgresso");
  const elMetaHero = document.getElementById("metaSemanalHero");

  if (elSequencia) elSequencia.textContent = `${sequenciaAtual} dia(s)`;
  if (elRecorde) elRecorde.textContent = `${recorde} dia(s)`;
  if (elMeta) elMeta.textContent = `${metaInfo.feitos}/${metaInfo.meta} treino(s) concluídos`;
  if (elPercentual) elPercentual.textContent = `${metaInfo.percentual}% da meta semanal concluída`;
  if (elMensagem) elMensagem.textContent = mensagem;
  if (elBarra) elBarra.style.width = `${metaInfo.percentual}%`;
  if (elMetaHero) elMetaHero.textContent = `${metaInfo.feitos}/${metaInfo.meta}`;
}
function gerarFraseDashboard(dados) {
  if (!dados) return "Seu plano foi montado com base no seu perfil e no seu objetivo.";

  if (dados.objetivo === "Ganhar massa") {
    return "Seu foco atual é ganho de massa, com treinos estruturados para evolução e constância.";
  }

  if (dados.objetivo === "Emagrecer") {
    return "Seu plano está voltado para emagrecimento com equilíbrio entre treino, rotina e constância.";
  }

  return "Seu plano está configurado para manter seus resultados com constância e equilíbrio.";
}
function carregarInicioNovo() {
  const usuario = pegarUsuario();
  const dados = pegarDadosSaude();
  if (!usuario || !dados) return;

  const imc = calcularIMC(dados.peso, dados.altura).toFixed(1);
  const calorias = calcularCalorias(dados);
  const classificacao = classificarIMC(Number(imc));
  const planoTreinos = gerarTreinosPorSemana(dados.treinosSemana);

  const hojeIndice = new Date().getDay();
  const indicePlano = hojeIndice === 0 ? 0 : (hojeIndice - 1) % planoTreinos.length;
  const treinoHoje = planoTreinos[indicePlano] || {
    nome: "Descanso",
    desc: "Hoje é um bom dia para recuperação e mobilidade."
  };

  document.getElementById("nomeUsuarioInicio").textContent = usuario.nome;
  document.getElementById("fraseDashboard").textContent = gerarFraseDashboard(dados);

  document.getElementById("objetivoInicio").textContent = dados.objetivo;
  document.getElementById("frequenciaInicio").textContent = `${dados.treinosSemana}x por semana`;

  document.getElementById("treinoHojeTitulo").textContent = treinoHoje.nome;
  document.getElementById("treinoHojeTexto").textContent = treinoHoje.desc;

  document.getElementById("imcInicio").textContent = `${imc} • ${classificacao}`;
  document.getElementById("caloriasInicio").textContent = `${calorias} kcal/dia`;
  document.getElementById("frequenciaResumo").textContent = `${dados.treinosSemana}x por semana`;
  document.getElementById("objetivoResumo").textContent = dados.objetivo;
}
function gerarResumoDivisao(qtd) {
  if (qtd === 2) return "Full body";
  if (qtd === 3) return "ABC";
  if (qtd === 4) return "ABCD";
  if (qtd === 5) return "ABCDE";
  if (qtd === 6) return "ABCDEF";
  return "Plano personalizado";
}

function gerarFocoTreino(objetivo) {
  if (objetivo === "Ganhar massa") return "Hipertrofia e força";
  if (objetivo === "Emagrecer") return "Gasto calórico e constância";
  return "Equilíbrio e manutenção";
}

function diaAtualTexto() {
  const dias = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  return dias[new Date().getDay()];
}

function carregarTreinosNovo() {
  const dados = pegarDadosSaude();
  if (!dados) return;

  const lista = gerarTreinosPorSemana(dados.treinosSemana);
  const container = document.getElementById("treinosLista");
  const resumo = document.getElementById("treinosResumo");

  resumo.textContent = `Seu plano foi montado para ${dados.treinosSemana} treino(s) por semana, com foco em ${dados.objetivo.toLowerCase()}.`;

  document.getElementById("treinoObjetivo").textContent = dados.objetivo;
  document.getElementById("treinoFrequencia").textContent = `${dados.treinosSemana}x por semana`;
  document.getElementById("treinoDivisao").textContent = gerarResumoDivisao(dados.treinosSemana);
  document.getElementById("treinoFoco").textContent = gerarFocoTreino(dados.objetivo);

  const hojeIndice = new Date().getDay();
  const indicePlano = hojeIndice === 0 ? 0 : (hojeIndice - 1) % lista.length;
  const treinoHoje = lista[indicePlano] || lista[0];

  if (treinoHoje) {
    document.getElementById("treinoHojeNome").textContent = treinoHoje.nome;
    document.getElementById("treinoHojeDesc").textContent = treinoHoje.desc;
    document.getElementById("treinoHojeDia").textContent = diaAtualTexto();
  }

  container.innerHTML = lista.map((item, index) => `
    <div class="treino-semana-card ${index === indicePlano ? "destaque" : ""}">
      <div class="treino-semana-topo">
        <h4>${item.nome}</h4>
        <div class="treino-badge">${index === indicePlano ? "Hoje" : "Semana"}</div>
      </div>

      <p>${item.desc}</p>

      <div class="treino-extra">
        <span>Foco do treino</span>
        <strong>${item.desc}</strong>
      </div>
    </div>
  `).join("");
}
function gerarTituloEstrategia(objetivo) {
  if (objetivo === "Ganhar massa") return "Plano para ganho de massa";
  if (objetivo === "Emagrecer") return "Plano para emagrecimento";
  return "Plano para manutenção";
}

function gerarResumoDieta(objetivo) {
  if (objetivo === "Ganhar massa") {
    return "Seu plano alimentar foi montado para apoiar o ganho de massa com foco em superávit calórico moderado e boa ingestão de proteína.";
  }

  if (objetivo === "Emagrecer") {
    return "Seu plano alimentar foi montado para emagrecimento com foco em déficit calórico leve, saciedade e consistência.";
  }

  return "Seu plano alimentar foi montado para manutenção com foco em equilíbrio, rotina saudável e estabilidade nutricional.";
}

function gerarDicasNutricionais(objetivo) {
  if (objetivo === "Ganhar massa") {
    return {
      agua: "2,5L a 3,5L por dia",
      proteina: "Priorize proteína em todas as refeições",
      frequencia: "4 a 5 refeições por dia",
      estilo: "Maior ingestão calórica com qualidade"
    };
  }

  if (objetivo === "Emagrecer") {
    return {
      agua: "2L a 3L por dia",
      proteina: "Proteína para manter saciedade",
      frequencia: "3 a 5 refeições equilibradas",
      estilo: "Déficit leve com boa saciedade"
    };
  }

  return {
    agua: "2L a 3L por dia",
    proteina: "Proteína distribuída ao longo do dia",
    frequencia: "3 a 4 refeições equilibradas",
    estilo: "Equilíbrio nutricional"
  };
}

function carregarDietaNova() {
  const dados = pegarDadosSaude();
  if (!dados) return;

  const calorias = calcularCalorias(dados);
  const dieta = gerarDietaTexto(dados.objetivo);
  const dicas = gerarDicasNutricionais(dados.objetivo);

  document.getElementById("dietaResumo").textContent = gerarResumoDieta(dados.objetivo);
  document.getElementById("estrategiaTitulo").textContent = gerarTituloEstrategia(dados.objetivo);
  document.getElementById("estrategiaDieta").textContent = dieta.estrategia;

  document.getElementById("metaCalorica").textContent = `${calorias} kcal/dia`;
  document.getElementById("objetivoDieta").textContent = dados.objetivo;

  document.getElementById("aguaDieta").textContent = dicas.agua;
  document.getElementById("proteinaDieta").textContent = dicas.proteina;
  document.getElementById("frequenciaRefeicoes").textContent = dicas.frequencia;
  document.getElementById("estiloDieta").textContent = dicas.estilo;

  document.getElementById("cafeManha").textContent = dieta.cafe;
  document.getElementById("almoco").textContent = dieta.almoco;
  document.getElementById("lanche").textContent = dieta.lanche;
  document.getElementById("jantar").textContent = dieta.jantar;
}
function gerarResumoProgresso(dados, treinosFeitos) {
  if (!dados) {
    return "Acompanhe sua evolução e mantenha sua consistência semanal.";
  }

  if (treinosFeitos === 0) {
    return `Seu foco atual é ${dados.objetivo.toLowerCase()}. Comece marcando seu primeiro treino da semana.`;
  }

  if (treinosFeitos >= dados.treinosSemana) {
    return `Excelente! Você já completou sua meta semanal de ${dados.treinosSemana} treino(s).`;
  }

  return `Você já concluiu ${treinosFeitos} treino(s) nesta semana. Continue firme no objetivo de ${dados.objetivo.toLowerCase()}.`;
}