const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Supabase (Lendo as variáveis de ambiente do Render)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuração do Express para aceitar JSON e servir a pasta public
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// ROTA 1: LER todas as apostas
// ==========================================
app.get('/api/apostas', async (req, res) => {
    const { data, error } = await supabase
        .from('apostas_simples')
        .select('*')
        .order('id', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// ==========================================
// ROTA 2: SALVAR nova aposta
// ==========================================
app.post('/api/apostas', async (req, res) => {
    // Recolhendo e formatando os dados enviados pelo formulário
    const nome = req.body.nome;
    const whatsapp = req.body.whatsapp || '';
    const gols_br = parseInt(req.body.gols_br, 10);
    const gols_no = parseInt(req.body.gols_no, 10);
    const gol_1t = req.body.gol_1t; // Campo de Sim/Não
    
    // Inserindo na tabela do Supabase
    const { data, error } = await supabase
        .from('apostas_simples')
        .insert([{ nome, whatsapp, gols_br, gols_no, gol_1t }])
        .select();
        
    if (error) {
        console.error("Erro do Supabase:", error); 
        return res.status(500).json({ error: error.message });
    }
    res.status(201).json({ id: data[0].id });
});

// ==========================================
// ROTA 3: DELETAR aposta (Acesso do Admin)
// ==========================================
app.delete('/api/apostas/:id', async (req, res) => {
    const id = req.params.id;
    
    const { error } = await supabase
        .from('apostas_simples')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Aposta excluída com sucesso" });
});

// ==========================================
// INICIANDO O SERVIDOR
// ==========================================
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});