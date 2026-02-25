// URL da API do Sheet.best que retorna os dados da planilha
const urlAPI = 'https://api.sheetbest.com/sheets/b1f9110a-a118-402c-b5fd-17ca597a70ed';

// Variável global para armazenar os dados carregados da planilha
let dadosPlanilha = []; 

// Espera o DOM estar pronto (jQuery)
$(document).ready(function () {

  // --- SISTEMA DE SINCRONIZAÇÃO BIDIRECIONAL DOS CAMPOS DE CÓDIGO ---

  function sincronizarCodigosManualmente(origemId) {
      // Pega o valor do campo que foi editado manualmente
      const valorEditado = $(`#${origemId}`).val();
      
      // Lista de todos os campos de código que devem ser sincronizados
      const camposCodigo = [
          "codigo",           // Haste
          "codigo-tubo",      // Tubo
          "codigo-guias",     // Guias
          "codigo-tirantes",  // Tirantes
          "codigo-ccmb",      // CCMB/CCB
          "codigo-passante"   // Passante
      ];
      
      // Atualiza todos os outros campos (exceto o que foi editado)
      camposCodigo.forEach(id => {
          if (id !== origemId) {
              $(`#${id}`).val(valorEditado);
          }
      });
      
      console.log(`Código sincronizado manualmente de ${origemId}: ${valorEditado}`);
  }

  // Configura os event listeners para todos os campos de código
  $(document).ready(function() {
      // Lista de IDs dos campos de código
      const camposCodigo = [
          "codigo",           // Haste
          "codigo-tubo",      // Tubo
          "codigo-guias",     // Guias
          "codigo-tirantes",  // Tirantes
          "codigo-ccmb",      // CCMB/CCB
          "codigo-passante"   // Passante
      ];
      
      // Adiciona event listener para cada campo
      camposCodigo.forEach(id => {
          $(`#${id}`).on('input', function() {
              // Sincroniza quando o usuário digita algo
              sincronizarCodigosManualmente(id);
          });
          
          $(`#${id}`).on('change', function() {
              // Sincroniza também quando o campo perde o foco (após edição)
              sincronizarCodigosManualmente(id);
          });
      });
  });

  // Inicializa o Select2 no select-cilindro
  $('#select-cilindro').select2({
    placeholder: 'Selecione um cilindro',
    allowClear: true,
    width: '100%'
  });

  /**
 * Reseta os campos de opções e customizações para o estado padrão.
 */
function resetarCampos() {
  console.log("Resetando campos de customização...");

  // Desmarca todas as checkboxes de versões/opções
  $('#versaoViton').prop('checked', false);
  $('#versaoInox').prop('checked', false);
  $('#versaoPassante').prop('checked', false);
  $('#versaoVitonAirTac').prop('checked', false);

  // Limpa o valor do campo de Prolongamento de Haste (PH)
  $('#inputAdicionaPh').val('');
  // Limpa o valor do campo de Prolongamento de Rosca (PR)
  $('#inputAdicionaPr').val(''); 



  $('#haste-passante').addClass('hidden');
}


  // --- INÍCIO DO NOVO CÓDIGO ---
  // Evento para sincronizar o nome selecionado com os campos de nome nas outras seções
  $('#select-nome').on('change', function() {
    const nomeSelecionado = $(this).val();
    const nomeSelecionadoUpper = nomeSelecionado.toUpperCase(); // Pega o valor selecionado
    $('#nometubo').val(nomeSelecionadoUpper);    // Atualiza o campo de nome no Tubo
    $('#nomeguias').val(nomeSelecionadoUpper);   // Atualiza o campo de nome nas Guias
    $('#nometirantes').val(nomeSelecionadoUpper); // Atualiza o campo de nome nos Tirantes
    $('#nomeccmb').val(nomeSelecionadoUpper); 
    $('#nomepassante').val(nomeSelecionadoUpper);
  });
  // --- FIM DO NOVO CÓDIGO ---
  
    // --- INÍCIO DA SINCRONIZAÇÃO DE DATA/HORA ---
  // Evento para sincronizar a data da Haste com Tubo, Guias e Tirantes
  $('#datahaste').on('input change', function() {
    const dataSelecionada = $(this).val();
    $('#datatubo').val(dataSelecionada);
    $('#dataguias').val(dataSelecionada); // Adicionado para Guias
    $('#datatirantes').val(dataSelecionada); // Adicionado para Tirantes
    $('#dataccmb').val(dataSelecionada);
    $('#dataPassante').val(dataSelecionada);
  });

  // Evento para sincronizar a hora da Haste com Tubo, Guias e Tirantes
  $('#horahaste').on('input change', function() {
    const horaSelecionada = $(this).val();
    $('#horatubo').val(horaSelecionada);
    $('#horaguias').val(horaSelecionada); // Adicionado para Guias
    $('#horatirantes').val(horaSelecionada); // Adicionado para Tirantes
    $('#horaccmb').val(horaSelecionada);
    $('#horaPassante').val(horaSelecionada);
  });
  // --- FIM DA SINCRONIZAÇÃO DE DATA/HORA ---

  // --- INÍCIO DA SINCRONIZAÇÃO DE PRIORIDADE ---
  // Evento para sincronizar os botões de rádio de prioridade em todas as folhas
  // Seleciona todos os inputs de rádio cujos nomes começam com "prioridade"
  $('input[type="radio"][name^="prioridade"]').on('change', function() {
    // Verifica se o botão que disparou o evento está marcado
    if (this.checked) {
      // Pega o valor do botão selecionado ("padrao" ou "urgente")
      const valorSelecionado = $(this).val();
      
      // Seleciona TODOS os botões de rádio com o mesmo valor e os marca como checados
      $('input[type="radio"][name^="prioridade"][value="' + valorSelecionado + '"]').prop('checked', true);
    }
  });
  // --- FIM DA SINCRONIZAÇÃO DE PRIORIDADE ---


  // Carrega os dados da API
  fetch(urlAPI)
    .then(response => response.json()) // Converte a resposta para JSON
    .then(data => {
      // Armazena os dados retornados na variável global
      dadosPlanilha = data;

      // Extrai uma lista única de nomes de cilindros (sem duplicatas)
      const cilindros = [...new Set(data.map(item => item.cilindro))];

      // Limpa o select e adiciona placeholder
      const selectCilindro = $('#select-cilindro');
      selectCilindro.empty();
      selectCilindro.append('<option></option>'); // placeholder vazio para Select2

      // Adiciona cada cilindro como option
      cilindros.forEach(cilindro => {
        selectCilindro.append(new Option(cilindro, cilindro));
      });

      // Atualiza o Select2 para mostrar as opções
      selectCilindro.trigger('change.select2');
    })
    .catch(err => console.error('Erro ao carregar dados:', err));

       

  // Evento quando o usuário muda a seleção do cilindro
  $('#select-cilindro').on('change', function () {
    resetarCampos(); 
    document.getElementById("observacao").value = "";
    const cilindroSelecionado = $(this).val();

    // Seleciona os campos de entrada (Haste)
    const inputMedidaCorte = $('#input-medida-corte');
    const inputMedidaRd = $('#input-medida-rosca-dianteira');
    const inputMedidaRt = $('#input-medida-rosca-traseira');
    const inputImagem = $('#imagem-haste');
    const inputMedidaRebaixo = $('#input-medida-rebaixo');
    const inputMedidaComprimento = $('#input-medida-comprimento');
    const inputDiametroR = $('#input-diametroR');
    const inputComprimentoR = $('#input-comprimentoR');
    const inputRebaixoTraseira = $('#input-rebaixo-traseira');
    const inputRebaixoOring = $('#input-rebaixo-oring');
    const inputDistanciaOring = $('#input-distancia-oring');
    const inputDiametroHaste = $('#input-diametro-haste');
    const inputMateriaPrima = $('#input-materia-prima');
    const inputEmbolo = $('#input-embolo');
    const inputQtdHaste = $('#input-qtd-haste');
    const inputInfoCompRebaixo = $('#compRebaixo');
    const inputInfoDiamRebaixo = $('#diamRebaixo');

    const inputImgHastePassante = $('#imagem-haste-passante');
    const inputQtdPassante = $('#input-qtd-passante');
    const inputMateriaPrimaPassante = $('#input-materia-prima-passante'); 

    // Campos MI
    const inputMedidaCorteMi = $('#input-medida-corte-mi');
    const inputDiametroHasteMi = $('#input-diametro-haste-mi');
    const inputMedidaRdMi = $('#input-medida-rosca-dianteira-mi');

    // Campos Tubo
    const inputTubo = $('#input-cilindro-tubo');
    const inputMateriaPrimaTubo = $('#input-materia-prima-tubo');
    const inputMedidaCorteTubo = $('#input-medida-corte-tubo');
    const inputCursoTubo = $('#curso-tubo'); // Campo de exibição do curso para tubo
    const inputMedidaRoscaTubo = $('#input-medida-rosca-tubo');
    const inputImagemTubo = $('#imagem-tubo');
    const inputQtdTubo = $('#input-qtd-tubo');

    // Campos Guias
    const inputCilindroGuias = $('#input-cilindro-tubo-guias');
    const inputMateriaPrimaGuias = $('#input-materia-prima-guias');
    const inputMedidaCorteGuias = $('#input-medida-corte-guias');
    const inputCursoGuias = $('#curso-guias');
    const inputQtdGuias = $('#input-qtd-guias');
    const inputImagemGuias = $('#imagem-guias');
    const inputDiametroHasteGuias = $('#input-diametro-haste-guias');
    const inputCodigoGuias = $('#codigo-guias');
    const inputRoscaGuia = $('#input-medida-rosca-guias');

    // Campos Tirantes
    const inputCilindroTirantes = $('#input-cilindro-tubo-tirantes');
    const inputMateriaPrimaTirantes = $('#input-materia-prima-tirantes');
    const inputMedidaCorteTirantes = $('#input-medida-corte-tirantes');
    const inputCursoTirantes = $('#curso-tirantes');
    const inputQtdTirantes = $('#input-qtd-tirantes');
    const inputImagemTirantes = $('#imagem-tirantes');
    const inputDiametroHasteTirantes = $('#input-diametro-haste-tirantes');
    const inputCodigoTirantes = $('#codigo-tirantes');
    const inputRoscaTirantes = $('#input-medida-rosca-tirantes');
    const inputRoscaTirantesLadoB = $('#input-medida-rosca-tirantes-lado-b');

    // Campos CCMB
    const inputCcmbDianteiraImg = $('#imgRebaixoD');
    const inputCilindroCcmb = $('#codigo-ccmb');
    const inputQtdCcmb = $('#input-qtd-ccmb');
    const inputCcmbC = $('#ccmb-c');
    const inputCcmbDc = $('#ccmb-dc');
    const inputCcmbA = $('#ccmb-a');
    const inputCcmbAe = $('#ccmb-ae');
    const inputCcmbB = $('#ccmb-b');

    const inputCcmbTraseiraImg = $('#imgRebaixoT');
    const inputCcmbCt = $('#ccmb-ct');
    const inputCcmbDct = $('#ccmb-dct');
    const inputCcmbAt = $('#ccmb-at');
    const inputCcmbAet = $('#ccmb-aet');
    const inputCcmbBt = $('#ccmb-bt');

    const inputImgAlimentacao = $('#imgAlimentacao');
    const inputRoscaAlimentacao = $('#ccmb-rosca-alimentacao');
    const inputComprimentoAlimentacao = $('#ccmb-comprimento-alimentacao');

    const inputImgFuracao = $('#imgFixacao');
    const inputDiametroRebaixo = $('#ccmb-diametro-rebaixo');
    const inputComprimentoRebaixo = $('#ccmb-comprimento-rebaixo');

    //CAMPOS PASSANTE
    const inputCortePassante = $('#input-medida-corte-passante');
    const inputDiametroHastePassante = $('#input-diametro-haste-passante');
    const inputMedidaRdPassante = $('#input-medida-rosca-dianteira-passante');
    const inputMedidaRtPassante = $('#input-medida-rosca-traseira-passante');
    const inputMedidaRebaixoPassante = $('#input-medida-rebaixo-passante');
    const inputMedidaComprimentoPassante = $('#input-medida-comprimento-passante');
    const inputMedidaCorteAce = $('#input-medida-corte-ace');
    const inputDiametroHasteAcePassante = $('#input-diametro-haste-ace');
    const inputMedidaRtAced = $('#input-medida-rosca-traseira-aced');
    const imgHasteAced = $('#imgHasteAced');
    const RdAced = $('#input-medida-rosca-dianteira-aced');

    // Lista de cilindros que devem mostrar a página de guias
    const cilindrosGuiados = [
      "CCNG12", "CCNG16", "CCNG20", "CCNG25", "CCNG32", 
      "CCNG40", "CCNG50", "CCNG63", "CCNG80", "CCNG100", 
      "CDVUL12", "CDVUL16", "CDVUL20", "CDVUL25", "CDVUL32",
      "CDVUL40", "CDVUL50", "CDVUL63", "CDVUL80", "CDVUL100", 
    ];

    const cilindrosGb = [
      "GB12", "GB16", "GB20", "GB25", "GB32", "GB40", "GB50", "GB63", 
      "GB80", "GB100","GR12", "GR16", "GR20", "GR25", "GR32", "GR40", "GR50", "GR63", 
      "GR80", "GR100",
    ];

    // Lista de cilindros que devem mostrar a página de tirantes
    const cilindrosTirantados = [
      "CTN32", "CTN40", "CTN50", "CTN63", "CTN80", "CTN100", 
      "CTN125", "CTE32", "CTE40", "CTE50", "CTE63", "CTE80", 
      "CTE100", "CTE125", "CTE160", "CTE200", "CTB32", "CTB40",
      "CTB50", "CTB63", "CTB80", "CTB100", "CTB125", "SAI160SNG", 
      "SAI200SNG", "CT2M63", "CT2M100", "CT2M125", "SGC160SNG", "SGC200SNG", "SGC250SNG"
    ];

    const cilindrosCcmb = [
      "CCMB12-F", "CCMB16-F", "CCMB20-F", "CCMB25-F", "CCMB32-F", "CCMB40-F", "CCMB50-F", "CCMB63-F", "CCMB80-F", "CCMB100-F",
      "CCMB16L-F", "CCMB20L-F", "CCMB25L-F",
      "CCMB12-M", "CCMB16-M", "CCMB20-M", "CCMB25-M", "CCMB32-M", "CCMB40-M", "CCMB50-M", "CCMB63-M", "CCMB80-M", "CCMB100-M",
      "CCMB16L-M", "CCMB20L-M", "CCMB25L-M"
    ]

    const cilindrosCcb = [
      "CCB12-F", "CCB16-F", "CCB20-F", "CCB25-F", "CCB32-F", "CCB40-F", "CCB50-F", "CCB63-F", "CCB80-F", "CCB100-F",
      "CCB12-M", "CCB16-M", "CCB20-M", "CCB25-M", "CCB32-M", "CCB40-M", "CCB50-M", "CCB63-M", "CCB80-M", "CCB100-M"
    ]

    const familiaCc = [...cilindrosCcmb, ...cilindrosCcb];

    if (!cilindroSelecionado) {
      // Limpa todos os campos se nenhum cilindro for selecionado
      inputMedidaCorte.val('');
      inputMedidaRd.val('');
      inputMedidaRt.val('');
      inputImagem.attr('src', '');
      inputMedidaRebaixo.val('');
      inputMedidaComprimento.val('');
      inputDiametroR.val('');
      inputComprimentoR.val('');
      inputRebaixoTraseira.val('');
      inputRebaixoOring.val('');
      inputDistanciaOring.val('');
      inputDiametroHaste.val('');
      inputMateriaPrima.val('');
      inputEmbolo.val('');
      inputQtdHaste.val('');
      inputInfoCompRebaixo.val('');
      inputInfoDiamRebaixo.val('');

      inputImgHastePassante.attr('src', '');
      inputQtdPassante.val('');
      inputMateriaPrimaPassante.val('');

      inputMedidaCorteMi.val('');
      inputDiametroHasteMi.val('');
      inputMedidaRdMi.val('');

      inputTubo.val('');
      inputMateriaPrimaTubo.val('');
      inputMedidaCorteTubo.val('');
      inputCursoTubo.val(''); // Limpa o campo de curso do tubo
      inputMedidaRoscaTubo.val('');
      inputImagemTubo.attr('src', '');
      inputQtdTubo.val('');

      // Limpa campos de Guias
      inputCilindroGuias.val('');
      inputMateriaPrimaGuias.val('');
      inputMedidaCorteGuias.val('');
      inputCursoGuias.val('');
      inputQtdGuias.val('');
      inputImagemGuias.attr('src', '');
      inputDiametroHasteGuias.val('');
      inputCodigoGuias.val('');
      inputRoscaGuia.val('');

      // Limpa campos de Tirantes
      inputCilindroTirantes.val('');
      inputMateriaPrimaTirantes.val('');
      inputMedidaCorteTirantes.val('');
      inputCursoTirantes.val('');
      inputQtdTirantes.val('');
      inputImagemTirantes.attr('src', '');
      inputDiametroHasteTirantes.val('');
      inputCodigoTirantes.val('');
      inputRoscaTirantes.val('');
      inputRoscaTirantesLadoB.val('');

      // Limpa campos de CCMB
      inputCcmbDianteiraImg.attr('src', '');
      inputCilindroCcmb.val('');
      inputQtdCcmb.val('');
      inputCcmbC.val('');
      inputCcmbDc.val('');
      inputCcmbA.val('');
      inputCcmbAe.val('');
      inputCcmbB.val('');

      inputCcmbTraseiraImg.attr('src', '');
      inputCcmbCt.val('');
      inputCcmbDct.val('');    
      inputCcmbAt.val('');
      inputCcmbAet.val('');
      inputCcmbBt.val('');

      inputImgAlimentacao.attr('src', '');
      inputRoscaAlimentacao.val('');
      inputComprimentoAlimentacao.val('');

      inputImgFuracao.attr('src', '');
      inputDiametroRebaixo.val('');
      inputComprimentoRebaixo.val('');

      // Limpa os campos de passante
      inputCortePassante.val('');
      inputDiametroHastePassante.val('');
      inputMedidaRdPassante.val('');
      inputMedidaRtPassante.val('');
      inputMedidaRebaixoPassante.val('');
      inputMedidaComprimentoPassante.val('');
      inputMedidaCorteAce.val('');
      inputDiametroHasteAcePassante.val('');
      inputMedidaRtAced.val('');
      imgHasteAced.attr('src', '');
      RdAced.val('');
      

      // Esconde páginas opcionais
      $("#paginaGuias").addClass("hidden");
      $("#paginaTirantes").addClass("hidden");

      // Reseta o título da Operação 2
      $("#titulo-op2-rosca-fixacao").text("Operação 2: Rosca de Fixação");
      
      // Esconde as imagens de rebaixo CCMB e mostra a imagem do tubo normal
      $(".rebaixoCCMBD").addClass("hidden");
      $(".rebaixoCCMBT").addClass("hidden");
      $(".imgtubonormal").removeClass("hidden"); // Ensure normal tube image is visible
      $(".imgtubo").removeClass("hidden"); // Ensure main tube image is visible if it was hidden

      atualizarCodigo();
      return;
    }

    // Encontra o item correspondente ao cilindro selecionado
    const item = dadosPlanilha.find(d => d.cilindro === cilindroSelecionado);

    if (item) {

      // 1. Busca os valores das duas novas colunas da planilha.
      // O `|| ''` garante que, se a célula estiver vazia, teremos uma string vazia em vez de 'undefined'.
      const medidaRD = item.medidaRD || '';
      const medidaCRD = item.medidaCRD || '';

      const medidaRDConcatenada = (medidaRD + medidaCRD).trim();
      //==============================================================
      const medidaRDAced = item.medidardacedb || '';
      const medidaCRDAced = item.medidaCRDacedb || '';

      const medidaRDAcedConcatenada = (medidaRDAced + medidaCRDAced).trim();
      //============================================================
      const medidaRDMi = item.medidaRD_MI || '';
      const medidaCRDMi = item.medidaCRDMI || '';

      const medidaRDMidConcatenada = (medidaRDMi + medidaCRDMi).trim();
      

      // Preenche os campos da haste
      inputMedidaCorte.val(item.medidacorte || '');
      inputMedidaRd.val(medidaRDConcatenada);

      inputMedidaRt.val(item.medidaRT || '');
      inputImagem.attr('src', item.imagemdahaste || '');
      inputMedidaRebaixo.val(item.medidarebaixo || '');
      inputMedidaComprimento.val(item.medidacomprimento || '');
      inputDiametroR.val(item.diamrebbocadechave || '');
      inputComprimentoR.val(item.rebaixobocadechave || '');
      inputRebaixoTraseira.val(item.rebaixotraseira || '');
      inputRebaixoOring.val(item.rebaixooring || '');
      inputDistanciaOring.val(item.distanciaoring || '');
      inputDiametroHaste.val(item.diametrohaste || '');
      inputEmbolo.val(item.embolo || '');
      inputMateriaPrima.val(item.materiaprima || '');
      inputMateriaPrimaPassante.val(item.materiaprima || '');
      inputInfoCompRebaixo.val(item.infoRebaixoComp || '');
      inputInfoDiamRebaixo.val(item.infoRebaixoDiam || '');

      inputImgHastePassante.attr('src', item.imgpassante || '');
      inputQtdPassante.val($('#input-qtd-haste').val() || '');

      // Preenche os campos MI
      inputMedidaCorteMi.val(item.medidacorte || '');
      inputDiametroHasteMi.val(item.diametrohaste || '');
      inputMedidaRdMi.val(medidaRDConcatenada);

      // Preenche os campos do tubo
      inputTubo.val(item.cilindro || '');
      inputMateriaPrimaTubo.val(item.materiaprimatubo || '');
      inputMedidaCorteTubo.val(item.medidacortetubo || ''); // Preenche a medida base do corte do tubo
      inputCursoTubo.val($('#curso').val() || ''); // Sincroniza o campo de exibição do curso do tubo com o curso da haste
      inputMedidaRoscaTubo.val(item.rosca || '');
      inputImagemTubo.attr('src', item.imagemdotubo || '');
      inputQtdTubo.val($('#input-qtd-haste').val() || ''); // Sincroniza o campo de quantidade do tubo com a quantidade da haste

      // Preenche os campos de Guias
      inputCilindroGuias.val(item.cilindro || '');
      inputMateriaPrimaGuias.val(item.materiaprimaguia || '');
      inputMedidaCorteGuias.val(item.medidaguia || ''); 
      inputCursoGuias.val($('#curso').val() || ''); // Sincroniza o campo de curso das guias com o curso da haste
      inputImagemGuias.attr('src', item.imagemguia  || '');
      inputDiametroHasteGuias.val(item.diametroguia || '');
      inputRoscaGuia.val(item.roscaguia || '');

      // Preenche os campos de Tirantes
      inputCilindroTirantes.val(item.cilindro || '');
      inputMateriaPrimaTirantes.val(item.materiaprimatirante || '');
      inputMedidaCorteTirantes.val(item.medidatirante || ''); 
      inputCursoTirantes.val($('#curso').val() || ''); // Sincroniza o campo de curso das guias com o curso da haste
      inputImagemTirantes.attr('src', item.imagemtirante || '');
      inputDiametroHasteTirantes.val(item.diametrotirante || '');
      inputRoscaTirantes.val(item.roscatirante || '');
      inputRoscaTirantesLadoB.val(item.roscatiranteb || '');

      //preenche os campos CCMB
        inputCcmbDianteiraImg.attr('src', item.rebaixoDianteiraCCMB || ''); 
        inputCcmbC.val(item.c || '');
        inputCcmbDc.val(item.diametroc || '');
        inputCcmbA.val(item.a || '');
        inputCcmbAe.val(item.diametroae || '');
        inputCcmbB.val(item.b || '');

        inputCcmbTraseiraImg.attr('src', item.rebaixoTraseiraCCMB || '');
        inputCcmbCt.val(item.ctraseira || '');
        inputCcmbDct.val(item.diametroctraseira || '');
        inputCcmbAt.val(item.atraseira || '');
        inputCcmbAet.val(item.diametroaetraseira || '');
        inputCcmbBt.val(item.btraseira || '');
        
        inputImgAlimentacao.attr('src', item.imgAlimentacao || '');
        inputRoscaAlimentacao.val(item.roscaalimentacao || '');
        inputComprimentoAlimentacao.val(item.comprimentoalimentacao || '');

        inputImgFuracao.attr('src', item.furacao || '');
        inputDiametroRebaixo.val(item.diametrorebaixo || '');
        inputComprimentoRebaixo.val(item.comprimentorebaixo || '');

        //preenche os campos passante
        inputCortePassante.val(item.cortepassante || '');
        inputDiametroHastePassante.val(item.diametrohaste || '');
        inputMedidaRdPassante.val(medidaRDConcatenada);
        inputMedidaRtPassante.val(item.medidaRTpassante || '');
        inputMedidaRebaixoPassante.val(item.medidarebaixo || '');
        inputMedidaComprimentoPassante .val(item.medidacomprimento || '');
        inputMedidaCorteAce.val(item.cortepassanteace || '');
        inputDiametroHasteAcePassante.val(item.diametrohaste || '');
        inputMedidaRtAced.val(item.medidartaced || '');
        imgHasteAced.attr('src', item.imghasteaced || '');
        RdAced.val(medidaRDAcedConcatenada || '');
      

      // Calcula as medidas finais
      calcular();
      calcularMi();
      calcularTubo(); // Calcula a medida final do corte do tubo
      calcularGuias();
      calcularTirantes();

      // Lógica para alterar o título da Operação 2 (Rosca de Fixação)
      const tituloOp2 = $("#titulo-op2-rosca-fixacao");
      const cilindrosObservacao = [
        "CCNG12", "CCNG16", "CCNG20", "CCNG25", "CCNG32",
        "CCNG40", "CCNG50", "CCNG63", "CCNG80", "CCNG100",
        "CCN12-M", "CCN16-M", "CCN20-M", "CCN25-M", "CCN32-M",
        "CCN40-M", "CCN50-M", "CCN63-M", "CCN80-M", "CCN100-M", "CCN125-M",
        "CCN12-F", "CCN16-F", "CCN20-F", "CCN25-F", "CCN32-F",
        "CCN40-F", "CCN50-F", "CCN63-F", "CCN80-F", "CCN100-F", "CCN125-F"
      ];
      const textoObservacao = "(Ø 80, 100 e 125, fazer nos 4 furos)";
      const textoPadrao = "Operação 2: Rosca de Fixação";

      if (cilindrosObservacao.includes(cilindroSelecionado)) {
        tituloOp2.text(`${textoPadrao} ${textoObservacao}`);
      } else {
        tituloOp2.text(textoPadrao); // Reseta para o padrão se não for um dos cilindros
      }

      const infoccb = $('#info-ccb');

      if (cilindrosCcb.includes(cilindroSelecionado)){
        infoccb.removeClass("hidden");
      } else {
        infoccb.addClass("hidden");
      }
      

      // Lógica para tolerancia dianteira
      const toleranciaD = $("#toleranciaHasteRD");

      const textoToleranciaD1 = "(Tolerância CRD: ± 0,5 mm)";
      const textoToleranciaD2 = "(Tolerância CRD: ± 0,5 mm)";
      const textoToleranciaD3 = "(Tolerância CRD: - 0mm e + 5 mm)";

      const textoPadraoTolerancia = "";

      const cilindrosToleranciaD1 = [
        "CPN32", "CPN40", "CPN50", "CPN63", "CPN80", "CPN100", "CPN125",
        "CTN32", "CTN40", "CTN50", "CTN63", "CTN80", "CTN100", "CTN125",
        "CTE160", "CTE200", "SAI160", "SAI200",
        "CPME32", "CPME40", "CPME50", "CPME63", "CPME80", "CPME100", "CPME125",
        "CTE32", "CTE40", "CTE50", "CTE63", "CTE80", "CTE100", "CTE125",
        "CPB32", "CPB40", "CPB50", "CPB63", "CPB80", "CPB100", "CPB125",
        "CTB32", "CTB40", "CTB50", "CTB63", "CTB80", "CTB100", "CTB125"
      ];

      const cilindrosToleranciaD2 = [
        "CSM10", "CSM12", "CSM16", "CSM20", "CSM25", 
        "CSM2B20", "CSM2B25", "CSM2B32", "CSM2B40",
        "CSM3B32-C", "CSM3B40-C", "CSM3B50-C", "CSM3B63-C",
        "CSM3F32-C", "CSM3F40-C", "CSM3F50-C", "CSM3F63-C",
        "CCN12-M", "CCN16-M", "CCN20-M", "CCN25-M", "CCN32-M", "CCN40-M", "CCN50-M", "CCN63-M", "CCN80-M", "CCN100-M", "CCN125-M",
        "CCN12-F", "CCN16-F", "CCN20-F", "CCN25-F", "CCN32-F", "CCN40-F", "CCN50-F", "CCN63-F", "CCN80-F", "CCN100-F", "CCN125-F",
        "CDVU12-M", "CDVU16-M", "CDVU20-M", "CDVU25-M", "CDVU32-M", "CDVU40-M", "CDVU50-M", "CDVU63-M", "CDVU80-M", "CDVU100-M", "CDVU125-M",
        "CDVU12-F", "CDVU16-F", "CDVU20-F", "CDVU25-F", "CDVU32-F", "CDVU40-F", "CDVU50-F", "CDVU63-F", "CDVU80-F", "CDVU100-F", "CDVU125-F",
        "CDVUL12", "CDVUL16", "CDVUL20", "CDVUL25", "CDVUL32", "CDVUL40", "CDVUL50", "CDVUL63", "CDVUL80", "CDVUL100",
        "CCMB12-M", "CCMB16-M", "CCMB20-M", "CCMB25-M", "CCMB16L-M", "CCMB20L-M", "CCMB25L-M", "CCMB32-M", "CCMB40-M", "CCMB50-M", "CCMB63-M", "CCMB80-M", "CCMB100-M",
        "CCB12-M", "CCB16-M", "CCB20-M", "CCB25-M", "CCB32-M", "CCB40-M", "CCB50-M", "CCB63-M", "CCB80-M", "CCB100-M",
        "ACE12S", "ACE16S", "ACE20S", "ACE25S", "ACE32SG", "ACE40SG", "ACE50SG", "ACE63SG", "ACE80SG", "ACE100SG", "ACE125SG",
        "ACEB12SB", "ACEB16SB", "ACEB20SB", "ACEB25SB", "ACEB32SBG", "ACEB40SBG", "ACEB50SBG", "ACEB63SBG", "ACEB80SBG", "ACEB100SBG", "ACEB125SBG",
      ];

      const cilindrosToleranciaD3 = [
        "CCMB12-F", "CCMB16-F", "CCMB20-F", "CCMB25-F", "CCMB16L-F", "CCMB20L-F", "CCMB25L-F", "CCMB32-F", "CCMB40-F", "CCMB50-F", "CCMB63-F", "CCMB80-F", "CCMB100-F",
        "CCB12-F", "CCB16-F", "CCB20-F", "CCB25-F", "CCB32-F", "CCB40-F", "CCB50-F", "CCB63-F", "CCB80-F", "CCB100-F"
      ];

      

      if (cilindrosToleranciaD1.includes(cilindroSelecionado)) {
        toleranciaD.text(`${textoToleranciaD1}`);
      } else if(cilindrosToleranciaD2.includes(cilindroSelecionado)) {
        toleranciaD.text(`${textoToleranciaD2}`);
      } else if(cilindrosToleranciaD3.includes(cilindroSelecionado)) {
        toleranciaD.text(`${textoToleranciaD3}`);
      } else {
        toleranciaD.text(`${textoPadraoTolerancia}`);
      }


      // Lógica para tolerancia traseira
      const toleranciaT = $("#toleranciaHasteRT");

      const textoToleranciaT1 = "(Tolerância CRT: - 0 mm e + 5 mm)";
      const textoToleranciaT2 = "(Tolerância CRT: ± 0,5 mm)";
      const textoToleranciaT3 = "(Tolerância CRT: ± 0,5 mm)";

      const textoPadraoToleranciaT = "";

      const cilindrosToleranciaT1 = [
        "CPN32", "CPN40", "CPN50", "CPN63", "CPN80", "CPN100", "CPN125",
        "CTN32", "CTN40", "CTN50", "CTN63", "CTN80", "CTN100", "CTN125",
        "CTE160", "CTE200", "SAI160", "SAI200",
        "CPME32", "CPME40", "CPME50", "CPME63", "CPME80", "CPME100", "CPME125",
        "CTE32", "CTE40", "CTE50", "CTE63", "CTE80", "CTE100", "CTE125",
        "CPB32", "CPB40", "CPB50", "CPB63", "CPB80", "CPB100", "CPB125",
        "CTB32", "CTB40", "CTB50", "CTB63", "CTB80", "CTB100", "CTB125"
      ];

      const cilindrosToleranciaT2 = [
        "CSM10", "CSM12", "CSM16", "CSM20", "CSM25", 
        "CSM2B20", "CSM2B25", "CSM2B32", "CSM2B40",
        "CSM3B32-C", "CSM3B40-C", "CSM3B50-C", "CSM3B63-C",
        "CSM3F32-C", "CSM3F40-C", "CSM3F50-C", "CSM3F63-C",
        "CCN12-M", "CCN16-M", "CCN20-M", "CCN25-M", "CCN32-M", "CCN40-M", "CCN50-M", "CCN63-M", "CCN80-M", "CCN100-M", "CCN125-M",
        "CCN12-F", "CCN16-F", "CCN20-F", "CCN25-F", "CCN32-F", "CCN40-F", "CCN50-F", "CCN63-F", "CCN80-F", "CCN100-F", "CCN125-F",
        "CDVU12-M", "CDVU16-M", "CDVU20-M", "CDVU25-M", "CDVU32-M", "CDVU40-M", "CDVU50-M", "CDVU63-M", "CDVU80-M", "CDVU100-M", "CDVU125-M",
        "CDVU12-F", "CDVU16-F", "CDVU20-F", "CDVU25-F", "CDVU32-F", "CDVU40-F", "CDVU50-F", "CDVU63-F", "CDVU80-F", "CDVU100-F", "CDVU125-F",
        "CDVUL12", "CDVUL16", "CDVUL20", "CDVUL25", "CDVUL32", "CDVUL40", "CDVUL50", "CDVUL63", "CDVUL80", "CDVUL100",
        "CCMB12-M", "CCMB16-M", "CCMB20-M", "CCMB25-M", "CCMB32-M", "CCMB40-M", "CCMB50-M", "CCMB63-M", "CCMB80-M", "CCMB100-M",
        "CCB12-M", "CCB16-M", "CCB20-M", "CCB25-M", "CCB32-M", "CCB40-M", "CCB50-M", "CCB63-M", "CCB80-M", "CCB100-M",
        "ACE12S", "ACE16S", "ACE20S", "ACE25S", "ACE32SG", "ACE40SG", "ACE50SG", "ACE63SG", "ACE80SG", "ACE100SG", "ACE125SG",
        "ACEB12SB", "ACEB16SB", "ACEB20SB", "ACEB25SB", "ACEB32SBG", "ACEB40SBG", "ACEB50SBG", "ACEB63SBG", "ACEB80SBG", "ACEB100SBG", "ACEB125SBG",
      ];

      const cilindrosToleranciaT3 = [
        "CCMB12-F", "CCMB16-F", "CCMB20-F", "CCMB25-F", "CCMB32-F", "CCMB40-F", "CCMB50-F", "CCMB63-F", "CCMB80-F", "CCMB100-F",
        "CCB12-F", "CCB16-F", "CCB20-F", "CCB25-F", "CCB32-F", "CCB40-F", "CCB50-F", "CCB63-F", "CCB80-F", "CCB100-F"
      ];

      if (cilindrosToleranciaT1.includes(cilindroSelecionado)) {
        toleranciaT.text(`${textoToleranciaT1}`);
      } else if(cilindrosToleranciaT2.includes(cilindroSelecionado)) {
        toleranciaT.text(`${textoToleranciaT2}`);
      } else if(cilindrosToleranciaT3.includes(cilindroSelecionado)) {
        toleranciaT.text(`${textoToleranciaT3}`);
      } else {
        toleranciaT.text(`${textoPadraoToleranciaT}`);
      }


      // Lógica para mostrar/esconder seções baseadas no cilindro
      const opCorte = $("#opCorte");
      const opRd = $("#opRd");
      const acabamento = $("#acabamento");
      const linhaDuplaContainer = $("#linha-dupla-container");
      const linhaDuplaContainerRoscaMi = $("#linha-dupla-container-rosca-mi");
      const especial = $("#especial");

      const cilindrosMI = [
        "MI12SCA", "MI16SCA", "MI20SCAG", "MI25SCAG",
        "MI12SU", "MI16SU", "MI20SUG", "MI25SUG",
        "MIC12SCA", "MIC16SCA", "MIC20SCAG", "MIC25SCAG",
        "MIC12SU", "MIC16SU", "MIC20SUG", "MIC25SUG",
        "MSI12SCA", "MSI16SCA", "MSI20SCAG", "MSI25SCAG",
        "MSI12SU", "MSI16SU", "MSI20SUG", "MSI25SUG",
        "MTI12SCA", "MTI16SCA", "MTI20SCAG", "MTI25SCAG",
        "MTI12SU", "MTI16SU", "MTI20SUG", "MTI25SUG",
        "ACE12S", "ACE16S", "ACE20S", "ACE25S", "ACE32SG", 
        "ACE40SG", "ACE50SG", "ACE63SG",
        "ACE125SG", "ACE12SB", "ACE16SB", "ACE20SB", "ACE25SB", 
        "ACE32SBG", "ACE40SBG", "ACE50SBG", "ACE63SBG", 
        "ACE125SBG", "ASE12", "ASE16", "ASE20", "ASE25", 
        "ASE32SG", "ASE40SG", "ASE50SG", "ASE63SG", "ASE80SG", "ASE100SG", 
        "ASE125SG", "ASE12SB", "ASE16SB", "ASE20SB", "ASE25SB", "ASE32SBG", 
        "ASE40SBG", "ASE50SBG", "ASE63SBG", "ASE80SBG", "ASE100SBG", "ASE125SBG", 
        "ATE12S", "ATE16S", "ATE20S", "ATE25S", "ATE32SG", "ATE40SG", "ATE50SG", "ATE63SG", 
        "ATE80SG", "ATE100SG", "ATE125SG", "ATE12SB", "ATE16SB", "ATE20SB", "ATE25SB", "ATE32SBG", 
        "ATE40SBG", "ATE50SBG", "ATE63SBG", "ATE80SBG", "ATE100SBG", "ATE125SBG"
      ];

      const cilindrosEspecial = [
        "MI12SCA", "MI16SCA", "MI20SCAG", "MI25SCAG",
        "MI12SU", "MI16SU", "MI20SUG", "MI25SUG",
        "MIC12SCA", "MIC16SCA", "MIC20SCAG", "MIC25SCAG",
        "MIC12SU", "MIC16SU", "MIC20SUG", "MIC25SUG",
        "MSI12SCA", "MSI16SCA", "MSI20SCAG", "MSI25SCAG",
        "MSI12SU", "MSI16SU", "MSI20SUG", "MSI25SUG",
        "MTI12SCA", "MTI16SCA", "MTI20SCAG", "MTI25SCAG",
        "MTI12SU", "MTI16SU", "MTI20SUG", "MTI25SUG",
        "ACE12S", "ACE16S", "ACE20S", "ACE25S", "ACE32SG", 
        "ACE40SG", "ACE50SG", "ACE63SG", "ACE100SG", 
        "ACE125SG", "ACE12SB", "ACE16SB", "ACE20SB", "ACE25SB", 
        "ACE32SBG", "ACE40SBG", "ACE50SBG", "ACE63SBG",
        "ACE125SBG", "ASE12", "ASE16", "ASE20", "ASE25", 
        "ASE32SG", "ASE40SG", "ASE50SG", "ASE63SG", "ASE80SG", "ASE100SG", 
        "ASE125SG", "ASE12SB", "ASE16SB", "ASE20SB", "ASE25SB", "ASE32SBG", 
        "ASE40SBG", "ASE50SBG", "ASE63SBG", "ASE80SBG", "ASE100SBG", "ASE125SBG", 
        "ATE12S", "ATE16S", "ATE20S", "ATE25S", "ATE32SG", "ATE40SG", "ATE50SG", "ATE63SG", 
        "ATE80SG", "ATE100SG", "ATE125SG", "ATE12SB", "ATE16SB", "ATE20SB", "ATE25SB", "ATE32SBG", 
        "ATE40SBG", "ATE50SBG", "ATE63SBG", "ATE80SBG", "ATE100SBG", "ATE125SBG"
      ];

      const observacao = $("#obs-avanco-retorno");
      const textoObsAvanco = "Avanço Mola - Usinar cabeçote traseiro";
      const textoObsRetorno = "Retorno Mola - Usinar cabeçote dianteiro";
      const textoPadraoAR = "";

      const cilindrosAvanco = [
        "MTI12SCA", "MTI16SCA", "MTI20SCAG", "MTI25SCAG",
        "MTI12SU", "MTI16SU", "MTI20SUG", "MTI25SUG",
        "CSM12A", "CSM16A", "CSM20A", "CSM25A", "CSM2B20A",
        "CSM2B25A", "CSM2B32A", "CSM2B40A"
      ];

      const cilindrosRetorno = [
        "MSI12SCA", "MSI16SCA", "MSI20SCAG", "MSI25SCAG",
        "MSI12SU", "MSI16SU", "MSI20SUG", "MSI25SUG",
        "CSM12R", "CSM16R", "CSM20R", "CSM25R", "CSM2B20R",
        "CSM2B25R", "CSM2B32R", "CSM2B40R"
      ];

      if (cilindrosAvanco.includes(cilindroSelecionado)) {
        observacao.text(`${textoObsAvanco}`);
      } else if (cilindrosRetorno.includes(cilindroSelecionado)) {
        observacao.text(`${textoObsRetorno}`);
      } else {
        observacao.text(`${textoPadraoAR}`)
      }
 
      if (cilindrosMI.includes(cilindroSelecionado)) {
        opCorte.addClass("hidden");
        opRd.addClass("hidden");
        linhaDuplaContainer.removeClass("hidden");
        linhaDuplaContainerRoscaMi.removeClass("hidden");
      } else {
        opCorte.removeClass("hidden");
        opRd.removeClass("hidden");
        linhaDuplaContainer.addClass("hidden");
        linhaDuplaContainerRoscaMi.addClass("hidden");
      }

      if (cilindrosEspecial.includes(cilindroSelecionado)) {
        especial.removeClass("hidden");
      } else {
        especial.addClass("hidden");
      }

      // VARIÁVEIS LOCAIS (dentro do bloco de seleção do cilindro)
      const paginaGuias = $("#paginaGuias");
      const folhaHaste = $("#folhaHaste");
      const folhaTubo = $("#tubos");

      // 1. Unifique as verificações de cilindros guiados
      const isCilindroGuiado = cilindrosGuiados.includes(cilindroSelecionado) || cilindrosGb.includes(cilindroSelecionado);

      // 2. Controla a visibilidade da Página de Guias
      if (isCilindroGuiado) {
        paginaGuias.removeClass("hidden"); // Mostra a página de guias se for de qualquer tipo guiado
      } else {
        paginaGuias.addClass("hidden"); // Esconde a página de guias se não for guiado
      }

      // 3. Controla a lógica especial para a série GB/GR (alerta e ocultação de Haste/Tubo)
      if (cilindrosGb.includes(cilindroSelecionado)) {
        alert("Lembrete: 1 peça GB/GR possui 2 hastes, verifique a quantidade antes de imprimir a OP!");
        
        // Esconde as folhas de Haste e Tubo, deixando apenas a de Guias (que já está visível)
        folhaHaste.addClass("hidden");
        folhaTubo.addClass("hidden");

      } else {
        // Garante que as folhas de Haste e Tubo estejam visíveis para TODOS os outros cilindros
        folhaHaste.removeClass("hidden");
        folhaTubo.removeClass("hidden");
      }

      // Lógica para mostrar/esconder a página de tirantes
      const paginaTirantes = $("#paginaTirantes");
      if (cilindrosTirantados.includes(cilindroSelecionado)) {
        paginaTirantes.removeClass("hidden"); // Mostra a página de guias
      } else {
        paginaTirantes.addClass("hidden"); // Esconde a página de guias
      }

      // Lógica para mostrar/esconder a página CCMB/CCB
    const paginaCcmb = $("#paginaCcmb"); // <--- ADICIONE ESTA LINHA
    if (familiaCc.includes(cilindroSelecionado)) { // <--- ADICIONE ESTE BLOCO
      paginaCcmb.removeClass("hidden"); // Mostra a página CCMB
    } else {
      paginaCcmb.addClass("hidden"); // Esconde a página CCMB
    }
      
      // Lógica para exibir imagens de rebaixo CCMB16 ou imagem do tubo normal
      const rebaixoCCMBD = $(".agrupar-tubo");;
      const imgtubo = $(".imgtubo"); // The main image-tubo container

      if (cilindroSelecionado === "CCMB16") {
          rebaixoCCMBD.removeClass("hidden");
          imgtubo.removeClass("hidden"); // Ensure the main tube image container is visible
      } else {
          rebaixoCCMBD.addClass("hidden");
          imgtubo.removeClass("hidden"); // Ensure the main tube image container is visible
      }

    } else {
       // Limpa todos os campos se o item não for encontrado
      inputMedidaCorte.val('');
      inputMedidaRd.val('');
      inputMedidaRt.val('');
      inputImagem.attr('src', '');
      inputMedidaRebaixo.val('');
      inputMedidaComprimento.val('');
      inputDiametroR.val('');
      inputComprimentoR.val('');
      inputRebaixoTraseira.val('');
      inputRebaixoOring.val('');
      inputDistanciaOring.val('');
      inputDiametroHaste.val('');
      inputMateriaPrima.val('');
      inputEmbolo.val('');
      inputQtdHaste.val('');
      inputInfoCompRebaixo.val('');
      inputInfoDiamRebaixo.val('');

      inputImgHastePassante.attr('src', '');
      inputQtdPassante.val('');
      inputMateriaPrimaPassante.val('');

      inputMedidaCorteMi.val('');
      inputDiametroHasteMi.val('');
      inputMedidaRdMi.val('');

      inputTubo.val('');
      inputMateriaPrimaTubo.val('');
      inputMedidaCorteTubo.val('');
      inputCursoTubo.val('');
      inputMedidaRoscaTubo.val('');
      inputImagemTubo.attr('src', '');
      inputQtdTubo.val('');

      // Limpa campos de Guias
      inputCilindroGuias.val('');
      inputMateriaPrimaGuias.val('');
      inputMedidaCorteGuias.val('');
      inputCursoGuias.val('');
      inputQtdGuias.val('');
      inputImagemGuias.attr('src', '');
      inputDiametroHasteGuias.val('');
      inputCodigoGuias.val('');
      inputRoscaGuia.val('');
      // Esconde páginas opcionais
      $('#paginaGuias').addClass('hidden');

      // Limpa campos de Tirantes
      inputCilindroTirantes.val('');
      inputMateriaPrimaTirantes.val('');
      inputMedidaCorteTirantes.val('');
      inputCursoTirantes.val('');
      inputQtdTirantes.val('');
      inputImagemTirantes.attr('src', '');
      inputDiametroHasteTirantes.val('');
      inputCodigoTirantes.val('');
      inputRoscaTirantes.val('');
      inputRoscaTirantesLadoB.val('');
      // Esconde páginas opcionais
      $('#paginaTirantes').addClass('hidden');
      
      //CCMB
      inputCcmbDianteiraImg.attr('src', '');
      inputCilindroCcmb.val('');
      inputQtdCcmb.val('');
      inputCcmbTraseiraImg.attr('src', '');

      inputImgAlimentacao.attr('src', '');
      inputRoscaAlimentacao.val('');
      inputComprimentoAlimentacao.val('');

      inputImgFuracao.attr('src', '');
      inputDiametroRebaixo.val('');
      inputComprimentoRebaixo.val('');

      //Limpa campos passante 
      inputCortePassante.val('');
      inputDiametroHastePassante.val('');
      inputMedidaRdPassante.val('');
      inputMedidaRtPassante.val('');
      inputMedidaRebaixoPassante.val('');
      inputMedidaComprimentoPassante.val('');
      inputMedidaCorteAce.val('');
      inputDiametroHasteAcePassante.val('');
      inputMedidaRtAced.val('');
      imgHasteAced.attr('src', '');
      RdAced.val('');
    

      // Esconde as imagens de rebaixo CCMB e mostra a imagem do tubo normal
      $(".rebaixoCCMBD").addClass("hidden");
      $(".rebaixoCCMBT").addClass("hidden");
      $(".imgtubonormal").removeClass("hidden"); // Ensure normal tube image is visible
      $(".imgtubo").removeClass("hidden"); // Ensure main tube image is visible if it was hidden
    }

    const cilindrosAirTac = [
        "MI12SCA", "MI16SCA", "MI20SCAG", "MI25SCAG",
        "MI12SU", "MI16SU", "MI20SUG", "MI25SUG",
        "MIC12SCA", "MIC16SCA", "MIC20SCAG", "MIC25SCAG",
        "MIC12SU", "MIC16SU", "MIC20SUG", "MIC25SUG",
        "MSI12SCA", "MSI16SCA", "MSI20SCAG", "MSI25SCAG",
        "MSI12SU", "MSI16SU", "MSI20SUG", "MSI25SUG",
        "MTI12SCA", "MTI16SCA", "MTI20SCAG", "MTI25SCAG",
        "MTI12SU", "MTI16SU", "MTI20SUG", "MTI25SUG",
      ];

      

      if(cilindrosAirTac.includes(cilindroSelecionado)) {
        $("#componenteViton").addClass("hidden");
        $("#componenteInox").addClass("hidden");
      } else {
          $("#componenteViton").removeClass("hidden");
          $("#componenteInox").removeClass("hidden");
      }


    atualizarCodigo(); // Atualiza o código exibido
  });

  // Evento input para o campo de curso principal (#curso)
  $('#curso').on('input', () => {
    calcular(); // Recalcula haste
    calcularMi(); // Recalcula haste MI
    calcularTubo(); // Recalcula tubo
    calcularGuias(); // Recalcula as guias
    calcularTirantes(); //Recalcula os tirantes
    atualizarCodigo(); // Atualiza código e sincroniza cursos
    
    // Sincroniza o campo de curso das guias com o valor do curso da haste
    $('#curso-guias').val($('#curso').val());
    $('#curso-tirantes').val($('#curso').val());
  });

// --- INÍCIO DA LÓGICA DE QUANTIDADE CORRIGIDA ---

// Evento para quando a quantidade de hastes for alterada
$('#input-qtd-haste').on('input', function() {
  const qtdHaste = parseInt($(this).val()) || 0;
  const isPassante = $('#versaoPassante').is(':checked');
  const cilindroSelecionado = $('#select-cilindro').val() || '';

  let qtdTubo; // Variável para armazenar a quantidade de tubos calculada

  // A lógica de tubo = metade da haste só se aplica se for um cilindro SAI com opção passante
  if (isPassante && cilindroSelecionado.toUpperCase().startsWith("SAI")) {
      qtdTubo = Math.round(qtdHaste / 2) || 0;
  } else {
      // Para todos os outros casos, a quantidade de tubos é igual à de hastes
      qtdTubo = qtdHaste || 0;
  }
  
  // Atualiza os campos do formulário
  $('#input-qtd-tubo').val(qtdTubo || '');
  $('#input-qtd-guias').val(qtdHaste * 2 || '');
  // <<< ALTERADO: A quantidade de tirantes agora é baseada na quantidade de TUBOS
  $('#input-qtd-tirantes').val(qtdTubo * 4 || ''); 

  $('#input-qtd-passante').val(qtdHaste || '');
});

// Evento para a checkbox 'passante'
$('#versaoPassante').on('change', function() {

  const isChecked = $(this).is(':checked');

    if (isChecked) {
        $('#haste-passante').removeClass('hidden');
        $('#imgrebaixoTccmb').addClass('hidden');
        $('#tabelaRebaixoTccmb').addClass('hidden');
    } else {
        $('#haste-passante').addClass('hidden');
        $('#imgrebaixoTccmb').removeClass('hidden');
        $('#tabelaRebaixoTccmb').removeClass('hidden');
    }


    const cilindroSelecionado = $('#select-cilindro').val() || '';

    // Apenas executa a lógica de trocar o campo para a familía ace
    if (cilindroSelecionado.toUpperCase().startsWith("ACE")){
      if($(this).is(':checked')) {

        $('#linha-dupla-container-corte').addClass('hidden');
        $('#especial').addClass('hidden');
        $('#op3-rosca-traseira').addClass('hidden');
        $('#imagem-haste').addClass('hidden');
        $('#linha-dupla-container-rosca-mi').addClass('hidden');

        $('#opCorteAce').removeClass('hidden');
        $('#rtAced').removeClass('hidden');
        $('#imgHasteAced').removeClass('hidden');
        $('#rdAced').removeClass('hidden');

      } else {

        $('#linha-dupla-container-corte').removeClass('hidden');
        $('#especial').removeClass('hidden');
        $('#op3-rosca-traseira').removeClass('hidden'); // Corrigi o seletor aqui (adicionei #)
        $('#imagem-haste').removeClass('hidden');
        $('#linha-dupla-container-rosca-mi').removeClass('hidden');

        $('#opCorteAce').addClass('hidden');
        $('#rtAced').addClass('hidden');
        $('#imgHasteAced').addClass('hidden');
        $('#rdAced').addClass('hidden');

      }
    }

    // Apenas executa a lógica de alterar quantidades para a família SAI
    if (cilindroSelecionado.toUpperCase().startsWith("SAI")) {
        const qtdHasteInput = $('#input-qtd-haste');
        const qtdTuboInput = $('#input-qtd-tubo');
        const qtdBase = parseInt(qtdTuboInput.val()) || 0;

        if ($(this).is(':checked')) {
            qtdHasteInput.val(qtdBase * 2);
            $('#haste-passante').addClass('hidden');
        } else {
            qtdHasteInput.val(qtdBase);
            $('#haste-passante').addClass('hidden');
        }
        
        // Dispara a atualização das outras quantidades
        qtdHasteInput.trigger('input');
    }

    // A função para atualizar o código do produto e a visibilidade da folha
    // é chamada para TODOS os cilindros, o que está correto.
    atualizarCodigo();
});



// --- FIM DA LÓGICA DE QUANTIDADE ---

});



// Função calcular: Calcula a medida de corte final da haste padrão
function calcular() {
  // --- Valores de entrada ---
  const cilindroSelecionado = $('#select-cilindro').val();
  const curso = parseFloat($('#curso').val()) || 0; 
  
  // 1. LÊ O VALOR DO NOVO CAMPO "PROLONGAMENTO DE HASTE"
  // Usamos o ID que definimos no HTML corrigido: "inputAdicionaPh"
  const prolongamentoPH = parseFloat($('#inputAdicionaPh').val()) || 0; // Converte para número, ou usa 0 se estiver vazio
  const prolongamentoPR = parseFloat($('#inputAdicionaPr').val()) || 0;


  // --- Busca dos dados da planilha ---
  const item = dadosPlanilha.find(d => d.cilindro === cilindroSelecionado);

  if (item && item.medidacorte) {
    // --- Cálculo ---
    const medidaOriginalStr = String(item.medidacorte).replace(',', '.').replace('mm', '').trim();
    const medidaOriginal = parseFloat(medidaOriginalStr) || 0;

    // 2. SOMA O PROLONGAMENTO NA MEDIDA FINAL
    const medidaFinal = medidaOriginal + curso + prolongamentoPH + prolongamentoPR; // Adicione "+ prolongamentoPR"

    // --- Exibição do resultado ---
    $('#input-medida-corte').val(medidaFinal.toFixed(2).replace('.', ',') + "mm");
  } else {
    $('#input-medida-corte').val('');
  }

  //CALCULO DE HASTE PARA O ACED
  if (item && item.cortepassanteace){
  const medidaOriginalAcedStr = String(item.cortepassanteace).replace(',', '.').replace('mm', '').trim();
  const medidaOriginalAced = parseFloat(medidaOriginalAcedStr) || 0;

  const medidaFinalAced = medidaOriginalAced + curso + prolongamentoPH + prolongamentoPR; // Adicione "+ prolongamentoPR"

  $('#input-medida-corte-ace').val(medidaFinalAced.toFixed(2).replace('.', ',') + "mm");
  }else {
    $('#input-medida-corte-ace').val('');
  }

  // --- Cálculo Corte Passante ---
  if (item && item.cortepassante) {
      const cortePassanteStr = String(item.cortepassante).replace(',', '.').replace('mm', '').trim();
      const cortePassante = parseFloat(cortePassanteStr) || 0;

      // Soma corte passante com o curso
      const medidaPassanteFinal = cortePassante + curso;

      $('#input-medida-corte-passante').val(medidaPassanteFinal.toFixed(2).replace('.', ',') + "mm");
    } else {
      $('#input-medida-corte-passante').val('');
    }
}

// Função calcularMi: Calcula a medida de corte final da haste MI
function calcularMi() {
  const curso = parseFloat($('#curso').val()) || 0;
  const cilindroSelecionado = $('#select-cilindro').val();
  
  // 1. LÊ O VALOR DO PROLONGAMENTO (a linha que faltava)
  const prolongamentoPH = parseFloat($('#inputAdicionaPh').val()) || 0;
  const prolongamentoPR = parseFloat($('#inputAdicionaPr').val()) || 0; // Adicione esta

  const item = dadosPlanilha.find(d => d.cilindro === cilindroSelecionado);

  if (item && item.medidacorte) {
    const medidaOriginalStr = String(item.medidacorte).replace(',', '.').replace('mm', '').trim();
    const medidaOriginal = parseFloat(medidaOriginalStr) || 0;

    // 2. SOMA O PROLONGAMENTO NO CÁLCULO FINAL (a alteração que faltava)
    const medidaFinal = medidaOriginal + curso + prolongamentoPH + prolongamentoPR; // Adicione "+ prolongamentoPR"
    
    // Atualiza o campo correto, o da linha MI
    $('#input-medida-corte-mi').val(medidaFinal.toFixed(2).replace('.', ',') + "mm");
  } else {
    $('#input-medida-corte-mi').val('');
  }
}

// --- ADICIONE ESTA NOVA FUNÇÃO ---
/**
 * Calcula a medida final da rosca dianteira com base no PR.
 */
function calcularRosca() {
    const prolongamentoPR = parseFloat($('#inputAdicionaPr').val()) || 0;
    const item = dadosPlanilha.find(d => d.cilindro === $('#select-cilindro').val());

    if (item) {
        // Usa as colunas que você já havia preparado
        const medidaRD_texto = item.medidaRD || ''; 
        const medidaCRD_base_str = item.medidaCRD || '0';
        
        // Extrai o valor numérico
        const valorBaseCRD = parseFloat(medidaCRD_base_str) || 0;
        const unidadeCRD = medidaCRD_base_str.replace(/[0-9.,]/g, '');
        
        // Soma o valor base da rosca apenas com o prolongamento da rosca (PR)
        const valorFinalCRD = valorBaseCRD + prolongamentoPR;

        // Monta a string final e atualiza os campos
        const roscaFinalString = `${medidaRD_texto}${valorFinalCRD}${unidadeCRD}`.trim();
        $('#input-medida-rosca-dianteira').val(roscaFinalString);
        $('#input-medida-rosca-dianteira-mi').val(roscaFinalString);
    }
}

// Função calcularTubo: Calcula a medida de corte final do tubo
function calcularTubo() {
  const inputCurso = $('#curso'); // Lê o valor do curso principal
  const cilindroSelecionado = $('#select-cilindro').val();
  const curso = parseFloat(inputCurso.val()) || 0;

  const item = dadosPlanilha.find(d => d.cilindro === cilindroSelecionado);

  if (item && item.medidacortetubo) {
    const medidaOriginalStr = String(item.medidacortetubo).replace(',', '.').replace('mm', '').trim();
    const medidaOriginal = parseFloat(medidaOriginalStr) || 0;
    const medidaFinal = medidaOriginal + curso;
    $('#input-medida-corte-tubo').val(medidaFinal.toFixed(2).replace('.', ',') + "mm"); // Formata para padrão brasileiro
  } else {
    $('#input-medida-corte-tubo').val(''); // Limpa se não houver dados
  }
}

// Função calcularTubo: Calcula a medida de corte final do tubo
function calcularGuias() {
  const inputCurso = $('#curso'); // Lê o valor do curso principal
  const cilindroSelecionado = $('#select-cilindro').val();
  const curso = parseFloat(inputCurso.val()) || 0;

  const item = dadosPlanilha.find(d => d.cilindro === cilindroSelecionado);

  if (item && item.medidaguia) {
    const medidaOriginalStr = String(item.medidaguia).replace(',', '.').replace('mm', '').trim();
    const medidaOriginal = parseFloat(medidaOriginalStr) || 0;
    const medidaFinal = medidaOriginal + curso;
    $('#input-medida-corte-guias').val(medidaFinal.toFixed(2).replace('.', ',') + "mm"); // Formata para padrão brasileiro
  } else {
    $('#input-medida-corte-guias').val(''); // Limpa se não houver dados
  }
}

// Função calcularTubo: Calcula a medida de corte final do tubo
function calcularTirantes() {
  const inputCurso = $('#curso'); // Lê o valor do curso principal
  const cilindroSelecionado = $('#select-cilindro').val();
  const curso = parseFloat(inputCurso.val()) || 0;

  const item = dadosPlanilha.find(d => d.cilindro === cilindroSelecionado);

  if (item && item.medidatirante) {
    const medidaOriginalStr = String(item.medidatirante).replace(',', '.').replace('mm', '').trim();
    const medidaOriginal = parseFloat(medidaOriginalStr) || 0;
    const medidaFinal = medidaOriginal + curso;
    $('#input-medida-corte-tirantes').val(medidaFinal.toFixed(2).replace('.', ',') + "mm"); // Formata para padrão brasileiro
  } else {
    $('#input-medida-corte-tirantes').val(''); // Limpa se não houver dados
  }
}


function atualizarCodigo() {
    const cilindro = $('#select-cilindro').val() || '';
    const curso = $('#curso').val() || '';
    const versaoVitonChecked = $('#versaoViton').is(':checked');
    const versaoInoxChecked = $('#versaoInox').is(':checked');
    const versaoPassanteChecked = $('#versaoPassante').is(':checked');
    const prolongamento = parseFloat($('#inputAdicionaPh').val()) || 0;
    const prolongamentoAtivo = (parseFloat($('#inputAdicionaPh').val()) || 0) > 0;
    const prolongamentoPR = parseFloat($('#inputAdicionaPr').val()) || 0;

    let textoFinalBase = '';
    let separador = '';

    if (cilindro) {
    const cilindroUpper = cilindro.toUpperCase();

    //=================================================================
    // CILINDROS FAMÍLIA ACE / ASE / ATE (Separador " X ")
    //=================================================================

    // ACE com sufixo S
    if (cilindroUpper.match(/^ACE(12|16|20|25)S$/)) {
        let base = cilindroUpper.replace("S", "");
        separador = " X ";
        // --- LÓGICA PASSANTE ADICIONADA AQUI ---
        if (versaoPassanteChecked) {
        base = base.replace("ACE", "ACED"); // Transforma ACE32 em ACED32
       }
        // --- FIM DA LÓGICA PASSANTE ---
        const sufixoFinal = versaoVitonChecked ? 'SH' : 'S'; // Lógica Viton
        textoFinalBase = `${base}${separador}${curso} ${sufixoFinal}`;
    }


    // ACE com sufixo SG
      else if (cilindroUpper.match(/^ACE(32|40|50|63|80|100|125)SG$/)) {
      let base = cilindroUpper.replace("SG", ""); // Mude para 'let'
      separador = " X ";
    // --- LÓGICA PASSANTE ADICIONADA AQUI ---
      if (versaoPassanteChecked) {
        base = base.replace("ACE", "ACED"); // Transforma ACE32 em ACED32
      }
    // --- FIM DA LÓGICA PASSANTE ---
      const sufixoFinal = versaoVitonChecked ? 'SHG' : 'SG'; // Lógica Viton
      textoFinalBase = `${base}${separador}${curso} ${sufixoFinal}`;
    }

    else if (cilindroUpper.match(/^ACE(12|16|20|25)SB$/)) {
        let base = cilindroUpper.replace('SB', '');
        separador = " X ";
        // --- LÓGICA PASSANTE ADICIONADA AQUI ---
        if (versaoPassanteChecked) {
        base = base.replace("ACE", "ACED"); // Transforma ACE32 em ACED32
       }
        // --- FIM DA LÓGICA PASSANTE ---
        const sufixoFinal = versaoVitonChecked ? 'SBH' : 'SB'; // Lógica Viton
        textoFinalBase = `${base}${separador}${curso} ${sufixoFinal}`;
    }

    // ACE com sufixo SBG
      else if (cilindroUpper.match(/^ACE(32|40|50|63|80|100|125)SBG$/)) {
      let base = cilindroUpper.replace("SBG", "");
      separador = " X ";
      if (versaoPassanteChecked) {
      base = base.replace("ACE", "ACED"); // Transforma ACE32 em ACED32
      }
      const sufixoFinal = versaoVitonChecked ? 'SBHG' : 'SBG'; // Lógica Viton (Corrigido de SBHG para SBH)
      textoFinalBase = `${base}${separador}${curso} ${sufixoFinal}`;
    }


    // ASE com sufixo S
      else if (cilindroUpper.match(/^ASE(12|16|20|25)$/)) {
        let base = cilindroUpper;
        separador = " X ";
        if (versaoPassanteChecked) {
        base = base.replace("ASE", "ASED"); // Transforma ACE32 em ACED32
        }
        const sufixoFinal = versaoVitonChecked ? 'SH' : 'S'; // Lógica Viton
        textoFinalBase = `${base}${separador}${curso}${sufixoFinal}`;
      }


    // ASE com sufixo SG
      else if (cilindroUpper.match(/^ASE(32|40|50|63|80|100|125)SG$/)) {
        let base = cilindroUpper.replace("SG", "");
        separador = " X ";
        if (versaoPassanteChecked) {
        base = base.replace("ASE", "ASED"); // Transforma ACE32 em ACED32
      }
      const sufixoFinal = versaoVitonChecked ? 'SHG' : 'SG'; // Lógica Viton
        textoFinalBase = `${base}${separador}${curso} ${sufixoFinal}`;
      }
    // ASE com sufixo SB
    else if (cilindroUpper.match(/^ASE(12|16|20|25)SB$/)) {
        let base = cilindroUpper.replace("SB", "");
        separador = " X ";
        if (versaoPassanteChecked) {
        base = base.replace("ASE", "ASED"); // Transforma ACE32 em ACED32
        }
        const sufixoFinal = versaoVitonChecked ? 'SBH' : 'SB'; // Lógica Viton
        textoFinalBase = `${base}${separador}${curso} ${sufixoFinal}`;
    }
    // ASE com sufixo SBG
    else if (cilindroUpper.match(/^ASE(32|40|50|63|80|100|125)SBG$/)) {
        let base = cilindroUpper.replace("SBG", "");
        separador = " X ";
        if (versaoPassanteChecked) {
        base = base.replace("ASE", "ASED"); // Transforma ACE32 em ACED32
      }
      const sufixoFinal = versaoVitonChecked ? 'SBHG' : 'SBG'; // Lógica Viton
        textoFinalBase = `${base}${separador}${curso} ${sufixoFinal}`;
    }
    // ATE com sufixo S
    else if (cilindroUpper.match(/^ATE(12|16|20|25)S$/)) {
        let base = cilindroUpper.replace("S", "");
        separador = " X ";
        if (versaoPassanteChecked) {
        base = base.replace("ATE", "ATED"); // Transforma ACE32 em ACED32
      }
      const sufixoFinal = versaoVitonChecked ? 'SH' : 'S'; // Lógica Viton
        textoFinalBase = `${base}${separador}${curso} ${sufixoFinal}`;
    }
    // ATE com sufixo SG
    else if (cilindroUpper.match(/^ATE(32|40|50|63|80|100|125)SG$/)) {
        let base = cilindroUpper.replace("SG", "");
        separador = " X ";
        if (versaoPassanteChecked) {
        base = base.replace("ATE", "ATED"); // Transforma ACE32 em ACED32
      }
      const sufixoFinal = versaoVitonChecked ? 'SHG' : 'SG'; // Lógica Viton
        textoFinalBase = `${base}${separador}${curso} ${sufixoFinal}`;
    }
    // ATE com sufixo SB
    else if (cilindroUpper.match(/^ATE(12|16|20|25)SB$/)) {
        let base = cilindroUpper.replace("SB", "");
        separador = " X ";
        if (versaoPassanteChecked) {
        base = base.replace("ATE", "ATED"); // Transforma ACE32 em ACED32
      }
      const sufixoFinal = versaoVitonChecked ? 'SBH' : 'SB'; // Lógica Viton
        textoFinalBase = `${base}${separador}${curso} ${sufixoFinal}`;
    }
    // ATE com sufixo SBG
    else if (cilindroUpper.match(/^ATE(32|40|50|63|80|100|125)SBG$/)) {
        let base = cilindroUpper.replace("SBG", "");
        separador = " X ";
        if (versaoPassanteChecked) {
        base = base.replace("ATE", "ATED"); // Transforma ACE32 em ACED32
      }
      const sufixoFinal = versaoVitonChecked ? 'SBHG' : 'SBG'; // Lógica Viton
        textoFinalBase = `${base}${separador}${curso} ${sufixoFinal}`;
    }

    else if (cilindroUpper.match(/^CSM(10|12|16|20|25)R$/)){
      const base = cilindroUpper.replace("R","");
      separador = " - ";
      const sufixoFinal = versaoVitonChecked ? ' - V ' : '';
      textoFinalBase = `${base}${separador}${curso}R ${sufixoFinal}`
    }

    else if (cilindroUpper.match(/^CSM(10|12|16|20|25)A$/)){
      const base = cilindroUpper.replace("A","");
      separador = " - ";
      const sufixoFinal = versaoVitonChecked ? ' - V ' : '';
      textoFinalBase = `${base}${separador}${curso}A ${sufixoFinal}`
    }

    else if (cilindroUpper.match(/^CSM(10|16|20|25)F$/)){
      const base = cilindroUpper.replace("F","");
      separador = " - ";
      const sufixoFinal = versaoVitonChecked ? ' - V ' : '';
      textoFinalBase = `${base}${separador}${curso}F ${sufixoFinal}`
    }

    else if (cilindroUpper.match(/^CSM2B(20|25|32|40)A$/)){
      const base = cilindroUpper.replace("A","");
      separador = " - ";
      const sufixoFinal = versaoVitonChecked ? ' - V ' : '';
      textoFinalBase = `${base}${separador}${curso}A ${sufixoFinal}`
    }
    
    else if (cilindroUpper.match(/^CSM2B(20|25|32|40)R$/)){
      const base = cilindroUpper.replace("R","");
      separador = " - ";
      const sufixoFinal = versaoVitonChecked ? ' - V ' : '';
      textoFinalBase = `${base}${separador}${curso}R ${sufixoFinal}`
    }

    else if (cilindroUpper.match(/^CSM2B(20|25|32|40)F$/)){
      const base = cilindroUpper.replace("F","");
      separador = " - ";
      const sufixoFinal = versaoVitonChecked ? ' - V ' : '';
      textoFinalBase = `${base}${separador}${curso}F ${sufixoFinal}`
    }

    //=================================================================
    // CILINDROS FAMÍLIA CSM (Separador " - ")
    //=================================================================

     // CSM com sufixo -C
    else if (cilindroUpper.match(/^CSM(16|20|25)$/)) {
        const base = cilindroUpper.replace("", "");
        separador = " - ";
        const sufixoFinal = versaoVitonChecked ? ' - V' : ''; // Lógica Viton
        textoFinalBase = `${base}${separador}${curso}${sufixoFinal}`;

    }
    // CSM com sufixo -C
    else if (cilindroUpper.match(/^CSM(16|20|25)-C$/)) {
        const base = cilindroUpper.replace("-C", "");
        separador = " - ";
        const sufixoFinal = versaoVitonChecked ? 'C - V' : 'C'; // Lógica Viton
        textoFinalBase = `${base}${separador}${curso}${sufixoFinal}`;

    }
    // CSM com sufixo F-C
    else if (cilindroUpper.match(/^CSM(16|20|25)F-C$/)) {
        const base = cilindroUpper.replace("-C", "");
        const prefixoCorreto = (cilindroUpper === "CSM25F-C") ? "CSM25F" : base;
        separador = " - ";
        const sufixoFinal = versaoVitonChecked ? 'C - V' : 'C'; // Lógica Viton
        textoFinalBase = `${base}${separador}${curso}${sufixoFinal}`;

        
    }
    // CSM3F (Formato especial)
    else if (cilindroUpper.match(/^CSM3F(32|40|50|63)-C$/)) {
        const match = cilindroUpper.match(/^CSM3F(\d+)-C$/);
        const numero = match[1];
        separador = " - ";
        const sufixoFinal = versaoVitonChecked ? ' - V' : '';
        textoFinalBase = `CSM3F ${numero}${separador}${curso}${sufixoFinal}C`;
    }
    // CSM3B (Formato especial)
    else if (cilindroUpper.match(/^CSM3B(32|40|50|63)-C$/)) {
        const match = cilindroUpper.match(/^CSM3B(\d+)-C$/);
        const numero = match[1];
        separador = " - ";
        const sufixoFinal = versaoVitonChecked ? ' - V' : '';
        textoFinalBase = `CSM3B ${numero}${separador}${curso}${sufixoFinal}C`;
    }

    //=================================================================
    // CILINDROS FAMÍLIA "CC" (CCN, CDVU, CCMB, CCB) (Separador " - ")
    //=================================================================

    // CCN...-M / -F
    else if (cilindroUpper.match(/^CCN(12|16|20|25|32|40|50|63|80|100|125)-M$/)) {
        const base = cilindroUpper.replace("-M", "");
        separador = " - ";
        textoFinalBase = `${base}${separador}${curso} M`;
    } else if (cilindroUpper.match(/^CCN(12|16|20|25|32|40|50|63|80|100|125)-F$/)) {
        const base = cilindroUpper.replace("-F", "");
        separador = " - ";
        textoFinalBase = `${base}${separador}${curso} F`;
    }
    // CCN...A-M / A-F (haste anti-giro)
    else if (cilindroUpper.match(/^CCN(12|16|20|25|32|40|50|63|80|100|125)M-A$/)) {
        const base = cilindroUpper.replace("M-A", "");
        separador = " - ";
        textoFinalBase = `${base}${separador}${curso}M - A`;
    } else if (cilindroUpper.match(/^CCN(12|16|20|25|32|40|50|63|80|100|125)F-A$/)) {
        const base = cilindroUpper.replace("F-A", "");
        separador = " - ";
        textoFinalBase = `${base}${separador}${curso}F - A`;
    }
    // CCN...R-M / R-F (haste reforçada)
    else if (cilindroUpper.match(/^CCN(12|16|20|25|32|40|50|63|80|100|125)M-R$/)) {
        const base = cilindroUpper.replace("M-R", "");
        separador = " - ";
        textoFinalBase = `${base}${separador}${curso}M - R`;
    } else if (cilindroUpper.match(/^CCN(12|16|20|25|32|40|50|63|80|100|125)F-R$/)) {
        const base = cilindroUpper.replace("F-R", ""); // Bug corrigido
        separador = " - ";
        textoFinalBase = `${base}${separador}${curso}F - R`;
    }
    // CDVU...-M / -F
    else if (cilindroUpper.match(/^CDVU(12|16|20|25|32|40|50|63|80|100|125)-M$/)) {
        const base = cilindroUpper.replace("-M", "");
        separador = " - ";
        textoFinalBase = `${base}${separador}${curso} M`;
    } else if (cilindroUpper.match(/^CDVU(12|16|20|25|32|40|50|63|80|100|125)-F$/)) {
        const base = cilindroUpper.replace("-F", "");
        separador = " - ";
        textoFinalBase = `${base}${separador}${curso} F`;
    }
    // CCMB...-M / -F
    else if (cilindroUpper.match(/^CCMB(12|16|20|25|32|40|50|63|80|100)-M$/)) {
        let base = cilindroUpper.replace("-M", "");
        if (cilindroUpper === "CCMB20-M") {
            base = "CCMB20";
        }
        separador = " - ";
        textoFinalBase = `${base}${separador}${curso} M`;
    } else if (cilindroUpper.match(/^CCMB(12|16|20|25|32|40|50|63|80|100)-F$/)) {
        const base = cilindroUpper.replace("-F", "");
        separador = " - ";
        textoFinalBase = `${base}${separador}${curso} F`;
    }

    // CCMB...-M / -F
    else if (cilindroUpper.match(/^CCMB(12|16|20|25|32|40|50|63|80|100)L-M$/)) {
        let base = cilindroUpper.replace("L-M", "");
        if (cilindroUpper === "CCMBL20-M") {
            base = "CCMBL20";
        }
        separador = " - ";
        textoFinalBase = `${base}L${separador}${curso} M`;
    } else if (cilindroUpper.match(/^CCMB(12|16|20|25|32|40|50|63|80|100)L-F$/)) {
        const base = cilindroUpper.replace("L-F", "");
        separador = " - ";
        textoFinalBase = `${base}L${separador}${curso} F`;
    }

    // CCB...-M / -F
    else if (cilindroUpper.match(/^CCB(12|16|20|25|32|40|50|63|80|100)-M$/)) {
        const base = cilindroUpper.replace("-M", "");
        separador = " - ";
        textoFinalBase = `${base}${separador}${curso} M`;
    } else if (cilindroUpper.match(/^CCB(12|16|20|25|32|40|50|63|80|100)-F$/)) {
        const base = cilindroUpper.replace("-F", "");
        separador = " - ";
        textoFinalBase = `${base}${separador}${curso} F`;
    }

    //=================================================================
    // CILINDROS FAMÍLIA MI / MSI / MTI (Separador " X ")
    //=================================================================

    // MI com vários sufixos
   else if (
    cilindroUpper.match(/^MI(C)?(12|16)SCA$/) ||
    cilindroUpper.match(/^MI(C)?(20|25)SCAG$/) ||
    cilindroUpper.match(/^MI(C)?(12|16|20|25)SUG$/) ||
    cilindroUpper.match(/^MI(C)?(12|16)SU$/)
) {
    const match = cilindroUpper.match(/^(MI(C)?)(\d+)(SCA|SCAG|SUG|SU)$/);

    // Define o prefixo condicionalmente com base na seleção do passante
    const prefixo = versaoPassanteChecked 
      ? `${match[1]}D${match[3]}`  // Ex: "MIC" + "D" + "12" = "MICD12"
      : `${match[1]}${match[3]}`;  // Ex: "MIC" + "12"     = "MIC12"

    const sufixo = match[4];
    separador = " X ";
    
    // LINHA CRÍTICA: Certifique-se de usar ACENTOS GRAVES (`) aqui
    textoFinalBase = `${prefixo}${separador}${curso} ${sufixo}`;
} 

    // MSI/MTI com SCA/SCAG
    else if (cilindroUpper.match(/^MSI(12|16)SCA$/)) {
        const base = cilindroUpper.replace("SCA", "");
        separador = " X ";
        textoFinalBase = `${base}${separador}${curso} SCA`;
    } else if (cilindroUpper.match(/^MSI(20|25)SCAG$/)) {
        const base = cilindroUpper.replace("SCAG", "");
        separador = " X ";
        textoFinalBase = `${base}${separador}${curso} SCAG`;
    } else if (cilindroUpper.match(/^MTI(12|16)SCA$/)) {
        const base = cilindroUpper.replace("SCA", "");
        separador = " X ";
        textoFinalBase = `${base}${separador}${curso} SCA`;
    } else if (cilindroUpper.match(/^MTI(20|25)SCAG$/)) {
        const base = cilindroUpper.replace("SCAG", "");
        separador = " X ";
        textoFinalBase = `${base}${separador}${curso} SCAG`;
    }
    // MSI/MTI com SU/SUG
    else if (cilindroUpper.match(/^MSI(12|16)SU$/)) {
        const base = cilindroUpper.replace("SU", "");
        separador = " X ";
        textoFinalBase = `${base}${separador}${curso} SU`;
    } else if (cilindroUpper.match(/^MSI(20|25)SUG$/)) {
        const base = cilindroUpper.replace("SUG", "");
        separador = " X ";
        textoFinalBase = `${base}${separador}${curso} SUG`;
    } else if (cilindroUpper.match(/^MTI(12|16)SU$/)) {
        const base = cilindroUpper.replace("SU", "");
        separador = " X ";
        textoFinalBase = `${base}${separador}${curso} SU`;
    } else if (cilindroUpper.match(/^MTI(20|25)SUG$/)) {
        const base = cilindroUpper.replace("SUG", "");
        separador = " X ";
        textoFinalBase = `${base}${separador}${curso} SUG`;
    }

    //=================================================================
    // CILINDROS FAMÍLIA SAI (Separador " X ")
    //=================================================================

  // Condição SAI corrigida
  else if (cilindroUpper.match(/^SAI(32|40|50|63|80|100|125|160|200)SNG$/)) {
      const numero = cilindroUpper.match(/\d+/)[0];
      let base = "SAI" + numero; // Start with "SAI" and the captured number.
      separador = " X ";
      if (versaoInoxChecked) {
          base += 'B'; // Append 'B' after the number.
      }
      if (versaoPassanteChecked) {
          base += 'D'; // Append 'D' after the number (and 'B' if applicable).
      }
      const sufixoFinal = versaoVitonChecked ? 'SHG' : 'SNG';
      textoFinalBase = `${base}${separador}${curso} ${sufixoFinal}`;
  }

    //=================================================================
    // REGRAS GERAIS (Menor Prioridade)


    else if (cilindroUpper.startsWith("MI") || cilindroUpper.startsWith("ACE") || cilindroUpper.startsWith("SAI")) {
        separador = " X ";
        textoFinalBase = `${cilindroUpper}${separador}${curso}`;
    } else {
        separador = " - ";
        textoFinalBase = `${cilindroUpper}${separador}${curso}`;
    }

} else {
    textoFinalBase = '';
}

    // --- INÍCIO DA LÓGICA MODIFICADA ---
    // --- Lógica para Sufixos Condicionais com Ordem V -> P -> I ---
    let codigoFinalFormatado = textoFinalBase;

    if (textoFinalBase) {
    // A lógica do Viton agora é condicional:
    // SÓ adiciona ' - V' se a caixa estiver marcada E se o código ainda não contiver 'SHG'.
    if (versaoVitonChecked && !codigoFinalFormatado.includes('SHG') && !codigoFinalFormatado.includes('S')) {
        codigoFinalFormatado += ' - V';
    }

    // As outras lógicas permanecem iguais.
    // Adiciona '- P' somente se for passante E NÃO for um cilindro ACE
    const cilindroUpper = cilindro.toUpperCase();
    if (versaoPassanteChecked && !(cilindroUpper.startsWith("ACE") || cilindroUpper.startsWith("ASE") || cilindroUpper.startsWith("ATE") || cilindroUpper.startsWith("SAI") || cilindroUpper.startsWith("MI"))) {
    codigoFinalFormatado += ' - P';
    }
    if (versaoInoxChecked && !(cilindroUpper.startsWith("SAI"))) {
        codigoFinalFormatado += ' - I';
    }

    if (prolongamentoAtivo) {
            codigoFinalFormatado += ` - PH${prolongamento}`;
       }

    if (prolongamentoPR > 0) {
            codigoFinalFormatado += ` - PR${prolongamentoPR}`;
        } 

}

    // Lógica para efeitos colaterais das checkboxes (executa separadamente da criação do código)

    // Efeito colateral da Versão Passante: Mostrar/Esconder a folha
    if (versaoPassanteChecked) {
        $('.folhaPassante').removeClass('hidden');
    } else {
        $('.folhaPassante').addClass('hidden');
    }

    // Efeito colateral da Versão Inox: Alterar matéria-prima
    const inputMateriaPrimaHaste = $('#input-materia-prima');
    const inputMateriaPrimaHastePassante = $('#input-materia-prima-passante');
    const sufixoInox = ' - I';
    // Remove o sufixo '- I' para garantir que não seja duplicado
    const materiaPrimaBase = (inputMateriaPrimaHaste.val() || '').replace(sufixoInox, '');
    
    if (versaoInoxChecked) {
        if (materiaPrimaBase) {
            inputMateriaPrimaHaste.val(materiaPrimaBase + sufixoInox);
            inputMateriaPrimaHastePassante.val(materiaPrimaBase + sufixoInox);
        }
    } else {
        // Remove o sufixo se a caixa for desmarcada
        if (materiaPrimaBase) {
            inputMateriaPrimaHaste.val(materiaPrimaBase);
            inputMateriaPrimaHastePassante.val(materiaPrimaBase);
        }
    }


    // --- FIM DA LÓGICA MODIFICADA ---
    

    // --- Atualiza os Campos do Formulário ---
    if (typeof $ !== "undefined") {
        $("#codigo").val(codigoFinalFormatado);
        $("#codigo-tubo").val(codigoFinalFormatado);
        $("#codigo-guias").val(codigoFinalFormatado);
        $("#codigo-tirantes").val(codigoFinalFormatado);
        $("#codigo-ccmb").val(codigoFinalFormatado);
        $('#codigo-passante').val(codigoFinalFormatado);

        $("#curso-tubo").val(curso);
        $("#curso-guias").val(curso);
        $("#curso-tirantes").val(curso);
    } else {
        console.error("jQuery ($) não está definido. A atualização dos campos falhou.");
    }
}
// --- Configuração dos Eventos (Ouvintes) ---
$(document).ready(function() {
    $('#select-cilindro').on('change', atualizarCodigo);
    $('#curso').on('input', atualizarCodigo);
    $('#versaoViton').on('change', atualizarCodigo);
    $('#versaoInox').on('change', atualizarCodigo); 
    $('#versaoPassante').on('change', atualizarCodigo);

    // Chame 'atualizarCodigo()' uma vez ao carregar a página.
    atualizarCodigo();
});

/**
 * Função acionada pelo botão "Adicionar" do Prolongamento de Haste.
 * @param {Event} event - O objeto do evento do clique.
 */
function adicionaPH(event) {
  // 1. Impede o comportamento padrão do botão (como recarregar a página)
  event.preventDefault(); 
  
  // 2. Apenas chama a função calcular(), que já sabe o que fazer!
  console.log("Calculando com prolongamento de haste...");
  calcular();
  calcularMi();
  atualizarCodigo();
}

/**
 * Remove o valor do prolongamento de haste e recalcula a medida de corte.
 * @param {Event} event - O objeto do evento do clique.
 */
function removePH(event) {
  // 1. Impede o comportamento padrão do botão (prevenção)
  event.preventDefault(); 

  // 2. Limpa o campo de entrada do prolongamento
  $('#inputAdicionaPh').val('');

  // 3. Chama a função principal de cálculo para atualizar o resultado
  console.log("Removendo prolongamento de haste e recalculando...");
  calcular();
  calcularMi();
  atualizarCodigo();
}

// --- ADICIONE ESTAS DUAS NOVAS FUNÇÕES ---

/**
 * Função acionada pelo botão "Adicionar" do Prolongamento de Rosca (PR).
 */
function adicionaPR(event) {
    event.preventDefault();
    console.log("Calculando com prolongamento de rosca...");
    // Chama todas as funções, pois PR afeta tanto o corte quanto a rosca
    calcular();
    calcularMi();
    calcularRosca();
    atualizarCodigo();
}

/**
 * Remove o valor do prolongamento de rosca e recalcula tudo.
 */
function removePR(event) {
    event.preventDefault();
    $('#inputAdicionaPr').val('');
    console.log("Removendo prolongamento de rosca e recalculando...");
    calcular();
    calcularMi();
    calcularRosca();
    atualizarCodigo();
}