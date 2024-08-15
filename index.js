





import React, { useEffect, useState } from 'react';
import { usarBD } from './hooks/usarBD';
import { View, Button, StyleSheet, TextInput, Alert, FlatList, ImageBackground } from 'react-native';
import { Produto } from './components/produto';

export function Index() {
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [produtos, setProdutos] = useState([]);
    const [selectedId, setSelectedId] = useState(null);  // Estado para armazenar o ID do item selecionado

    const produtosBD = usarBD();

    async function create() {
        if (isNaN(quantidade)) {
            return Alert.alert('Quantidade', 'A quantidade precisa ser um número!');
        }
        try {
            const item = id ? await produtosBD.update(id, { nome, quantidade }) : await produtosBD.create({ nome, quantidade });
            Alert.alert(id ? 'Produto atualizado!' : 'Produto cadastrado com o ID: ' + item.idProduto);
            setId('');
            setNome('');
            setQuantidade('');
            listar();
        } catch (error) {
            console.log(error);
        }
    };

    async function listar() {
        try {
            const captura = await produtosBD.read(pesquisa);
            setProdutos(captura);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        listar();
    }, [pesquisa]);

    const remove = async (id) => {
        try {
            await produtosBD.remove(id);
            await listar();
        } catch (error) {
            console.log(error);
        }
    };

    const selectItem = (item) => {
        setId(item.id);
        setNome(item.nome);
        setQuantidade(String(item.quantidade));
        setSelectedId(item.id);
    };

    return (
          <ImageBackground source={require('./assets/fundo.png')} style={styles.container}>
        <View style={styles.container}>
            <TextInput style={styles.texto} placeholder="Nome" onChangeText={setNome} value={nome} />
            <TextInput style={styles.texto} placeholder="Quantidade" onChangeText={setQuantidade} value={quantidade} keyboardType="numeric" />
            <Button title={id ? "Editar" : "Salvar"} onPress={create} />
            <TextInput style={styles.texto} placeholder="Pesquisar" onChangeText={setPesquisa} />
            <FlatList
                contentContainerStyle={styles.listContent}
                data={produtos}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <Produto 
                        data={item} 
                        onDelete={() => remove(item.id)} 
                        onSelect={() => selectItem(item)} 
                        isSelected={selectedId === item.id} 
                    />
                )}
            />
         
        </View></ImageBackground>
    );   
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 32,
        gap: 16,
    },
    texto: {
        height: 54,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: "#999",
        paddingHorizontal: 16,
    },
    listContent: {
        gap: 16,
    },
});
