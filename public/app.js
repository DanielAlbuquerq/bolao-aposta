const VALOR_COTA = 5.00;

// Sistema de Navegação entre telas
function navegarPara(idTela) {
    // Esconde todas as telas
    document.querySelectorAll('.screen').forEach(tela => {
        tela.classList.remove('active');
    });
    // Mostra a tela selecionada
    document.getElementById(idTela).classList.add('active');
    
    // Se abriu a tela de participantes, atualiza os dados
    if(idTela === 'tela-participantes') {
        carregarApostas();
    }
}

// Enviar Formulário para o WhatsApp
document.getElementById('form-user-aposta').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nome = document.getElementById('bet-nome').value;
    const zap = document.getElementById('bet-zap').value;
    const br = document.getElementById('bet-gols-br').value;
    const no = document.getElementById('bet-gols-no').value;
    const gols1t = document.getElementById('bet-gols-1t').value;
    const gols2t = document.getElementById('bet-gols-2t').value;
    const cartoes = document.getElementById('bet-cartoes').value;

    const mensagem = `⚽ *NOVA APOSTA - BOLÃO LUIS GOMES* ⚽\n\n` +
                     `👤 *Nome:* ${nome}\n` +
                     `📱 *WhatsApp:* ${zap}\n\n` +
                     `*PALPITE PRINCIPAL:*\n` +
                     `🇧🇷 Brasil ${br} x ${no} Noruega 🇳🇴\n\n` +
                     `*CRITÉRIOS:*\n` +
                     `⏱️ Gols no 1º Tempo: ${gols1t}\n` +
                     `⏱️ Gols no 2º Tempo: ${gols2t}\n` +
                     `_Segue em anexo o meu comprovante Pix!_`;

    const numeroAdmin = "5511964548597";
    const url = `https://wa.me/${numeroAdmin}?text=${encodeURIComponent(mensagem)}`;
    
    window.open(url, '_blank');
});

// Buscar dados do banco (Lendo a nova tabela)
async function carregarApostas() {
    try {
        const resposta = await fetch('/api/apostas');
        const apostas = await resposta.json();
        
        const tbody = document.getElementById('lista-apostas');
        tbody.innerHTML = ''; 
        
        apostas.forEach(aposta => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="text-align: left; font-weight: 600;">${aposta.nome}</td>
                <td class="placar-destaque">${aposta.gols_br} x ${aposta.gols_no}</td>
                <td>${aposta.gols_1t}</td>
                <td>${aposta.gols_2t}</td>
            `;
            tbody.appendChild(tr);
        });

        const totalParticipantes = apostas.length;
        document.getElementById('total-participantes').innerText = totalParticipantes;
        document.getElementById('valor-arrecadado').innerText = (totalParticipantes * VALOR_COTA).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

    } catch (error) {
        console.error('Erro ao carregar apostas:', error);
    }
}

// ==========================================
// FUNÇÃO DO BOTÃO PIX (TELA 2)
// ==========================================
document.getElementById('btn-pix-tela2').addEventListener('click', function() {
    // COLOQUE SUA CHAVE PIX REAL AQUI:
    const chavePix = "11964548597"; 
    
    navigator.clipboard.writeText(chavePix).then(() => {
        // Efeito visual quando copia com sucesso
        const btn = document.getElementById('btn-pix-tela2');
        const textoOriginal = btn.innerHTML;
        
        btn.innerHTML = "✅ Chave Copiada!";
        btn.style.backgroundColor = "#166534"; // Fica verde escuro

        // Volta ao texto e cor original depois de 3 segundos
        setTimeout(() => {
            btn.innerHTML = textoOriginal;
            btn.style.backgroundColor = ""; 
        }, 3000);
    }).catch(err => {
        console.error('Erro ao copiar Pix:', err);
        alert("Erro ao copiar a chave Pix. Tente novamente.");
    });
});

carregarApostas(); // Carrega os valores financeiros na tela 1 ao abrir o app