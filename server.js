const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Supabase (Lendo as chaves ocultas do Render)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota para LER todas as apostas (Vai para a Tela 3)
app.get('/api/apostas', async (req, res) => {
    const { data, error } = await supabase
        .from('apostas_noruega')
        .select('*')
        .order('id', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Rota para SALVAR nova aposta (Acesso do Admin)
app.post('/api/apostas', async (req, res) => {
    const nome = req.body.nome;
    const whatsapp = req.body.whatsapp || '';
    const gols_br = parseInt(req.body.gols_br, 10);
    const gols_no = parseInt(req.body.gols_no, 10);
    const gols_1t = parseInt(req.body.gols_1t, 10);
    const gols_2t = parseInt(req.body.gols_2t, 10);
    const cartoes = parseInt(req.body.cartoes, 10);
    
    const { data, error } = await supabase
        .from('apostas_noruega')
        .insert([{ nome, whatsapp, gols_br, gols_no, gols_1t, gols_2t, cartoes }])
        .select();
        
    if (error) {
        console.error("Erro do Supabase:", error); 
        return res.status(500).json({ error: error.message });
    }
    res.status(201).json({ id: data[0].id });
});


// Precisamos adicionar opções de deleterar se necessario no futuro, mas por
// Rota para DELETAR uma aposta pelo ID (Atualizada para o novo jogo)
app.delete('/api/apostas/:id', async (req, res) => {
    const id = req.params.id;
    
    const { error } = await supabase
        .from('apostas_noruega') // <-- Alterado aqui!
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Aposta excluída com sucesso" });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});