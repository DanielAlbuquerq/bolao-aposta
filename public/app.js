const VALOR_COTA = 10.00;

async function carregarApostas() {
    try {
        const resposta = await fetch('/api/apostas');
        const apostas = await resposta.json();
        
        const tbody = document.getElementById('lista-apostas');
        tbody.innerHTML = ''; 
        
        apostas.forEach(aposta => {
            const tr = document.createElement('tr');
          tr.innerHTML = `
                <td style="text-align: left;">${aposta.nome}</td>
                <td>${aposta.apelido || ''}</td>
                <td class="placar-num">${aposta.gols_br}</td>
                <td class="placar-x">x</td>
                <td class="placar-num">${aposta.gols_jp}</td>
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
// FUNÇÃO DO BOTÃO PIX
// ==========================================
document.getElementById('btn-pix').addEventListener('click', function() {
    // COLOQUE SUA CHAVE PIX DENTRO DAS ASPAS ABAIXO:
    const chavePix = "11964548597"; 
    
    navigator.clipboard.writeText(chavePix).then(() => {
        // Efeito visual quando copia com sucesso
        const btn = document.getElementById('btn-pix');
        const textoOriginal = btn.innerHTML;
        
        btn.innerHTML = "✅ Chave Copiada!";
        btn.style.backgroundColor = "#166534"; // Fica verde escuro

        // Volta ao normal depois de 3 segundos
        setTimeout(() => {
            btn.innerHTML = textoOriginal;
            btn.style.backgroundColor = ""; 
        }, 3000);
    }).catch(err => {
        console.error('Erro ao copiar Pix:', err);
        alert("Erro ao copiar a chave Pix.");
    });
});

carregarApostas();