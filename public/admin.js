async function carregarApostasAdmin() {
    try {
        const resposta = await fetch('/api/apostas');
        const apostas = await resposta.json();
        
        const tbody = document.getElementById('lista-admin');
        tbody.innerHTML = ''; 
        
        apostas.forEach(aposta => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="text-align: left;">
                    <strong>${aposta.nome}</strong><br>
                    <small style="color: #64748b;">${aposta.whatsapp || 'S/N'}</small>
                </td>
                <td class="placar-destaque">${aposta.gols_br} x ${aposta.gols_no}</td>
                <td>${aposta.gol_1t}</td>
                <td><button class="btn-excluir" onclick="deletarAposta(${aposta.id})">Apagar</button></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar apostas:', error);
    }
}

document.getElementById('form-aposta').addEventListener('submit', async (e) => {
    e.preventDefault();
    
// Recolhe os dados
    const novaAposta = {
        nome: document.getElementById('nome').value,
        whatsapp: document.getElementById('whatsapp').value,
        gols_br: document.getElementById('gols-br').value,
        gols_no: document.getElementById('gols-no').value,
        gol_1t: document.getElementById('gol-1t').value
    };
    
    try {
        const resposta = await fetch('/api/apostas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaAposta)
        });

        if (resposta.ok) {
            document.getElementById('form-aposta').reset();
            carregarApostasAdmin(); 
            alert('Aposta gravada com sucesso na base de dados!');
        } else {
            alert('Erro ao gravar aposta. Verifique a ligação.');
        }
    } catch (error) {
        alert('Erro de rede ao registar aposta.');
    }
});

async function deletarAposta(id) {
    if(confirm("Tem a certeza que deseja excluir esta aposta?")) {
        try {
            const resposta = await fetch(`/api/apostas/${id}`, { method: 'DELETE' });
            if (resposta.ok) {
                carregarApostasAdmin();
            }
        } catch (error) {
            alert('Erro ao excluir aposta.');
        }
    }
}

carregarApostasAdmin();