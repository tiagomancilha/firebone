import React,{  useContext, useEffect, useState, useRef }  from 'react'
import { StyleSheet,  View, Text, TextInput, Modal, Pressable, FlatList, TouchableOpacity} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import firebase from '../api/firebase'

const lista = [
    {id: 1, de: "São lourenço", para: "Pouso Alto", nome: "SAL-POA",
        comprimento: 23456, descricao: "Cabo que interliga Sal a Poa"
    },
    {id: 2, de: "São lourenço", para: "Pouso Alto", nome: "SAL-POA",
        comprimento: 23456, descricao: "Cabo que interliga Sal a Poa"
    },
    {id: 3, de: "Santa Rita do Sapucaí", para: "Poços de Caldas", nome: "SAL-POA",
        comprimento: 23456, descricao: "Cabo que interliga Sal a Poa"
    },
    {id: 4, de: "São lourenço", para: "Pouso Alto", nome: "SAL-POA",
        comprimento: 23456, descricao: "Cabo que interliga Sal a Poa"
    },
    {id: 5, de: "São lourenço", para: "Pouso Alto", nome: "SAL-POA",
        comprimento: 23456, descricao: "Cabo que interliga Sal a Poa"
    },
    {id: 6, de: "São lourenço", para: "Pouso Alto", nome: "SAL-POA",
        comprimento: 23456, descricao: "Cabo que interliga Sal a Poa"
    },
    {id: 7, de: "São lourenço", para: "Pouso Alto", nome: "SAL-POA",
        comprimento: 23456, descricao: "Cabo que interliga Sal a Poa"
    },
    {id: 8, de: "São lourenço", para: "Pouso Alto", nome: "SAL-POA",
        comprimento: 23456, descricao: "Cabo que interliga Sal a Poa"
    }
]


export default function ModalListaDeBackbones(props) {  
    const [listaDeBackbones, setListaDeBackbones] = useState([])
    const [carregando, setCarregando] = useState(false)
     /////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() =>{
    setCarregando(true)
    firebase.firestore().collection("backbones").get()
        .then((querySnapshot) => {  
            const l = [] 
            querySnapshot.forEach((doc) => {               
                const dados = doc.data();
               
                const item = {
                    id: doc.id,
                    nome: dados.nome,
                    origem: dados.origem,
                    destino: dados.destino,
                    comprimento: dados.comprimento,
                    descricao: dados.descricao
                }
               // console.log(item)
                l.push(item)               
            })
            setListaDeBackbones(l)
        }).catch((erro) =>{
            console.error(erro)
        })
        setCarregando(false)      
    },[])
    ////////////////////////////////////////////////////////////////////////////////////////////////
    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() =>{
               props.setBackboneSelected(item)
               props.esconder(false)    
            }}
        >
            <View style={styles.itemContainer}>
            <View style={styles.linhaSuperior}>
                <Text style={{fontSize: 18, fontWeight: "bold"}}>{item.nome}</Text>
                
                <Text style={{fontSize: 18}}>{item.comprimento}m</Text>
            </View>

            <View style={styles.linhaInferior}>
               
                <Text >{item.origem}</Text>
               
                <Text >{item.destino}</Text>
                
            </View>

            <View style={styles.descricao}>
                <Text>{item.descricao}</Text>
            </View>
            </View>
        </TouchableOpacity>
      );
    
    ////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    props.esconder(false)
                }}
            >
       
                <View style={styles.modalView}>
                    <FlatList
                    showsVerticalScrollIndicator={false}
                        data={[]}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}>

                    </FlatList>
                                           
                </View>           
            </Modal>         
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
      modalView: {      
        margin: 10,
        backgroundColor: "#eee",
        borderRadius: 15,
        padding: 5,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      itemContainer:{
       
        flexDirection: 'column',
        borderRadius: 5,
        borderColor: "#ccc",
        margin: 5,
        padding: 10,
        marginBottom:8,
        marginTop: 8, 
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5

      },
      linhaSuperior:{
      
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:  "center"
       
      },
      linhaInferior:{
       
        flexDirection: 'row',
        justifyContent: 'space-between',
       
      },
      descricao: {marginTop: 10, borderColor: "#000"}
});