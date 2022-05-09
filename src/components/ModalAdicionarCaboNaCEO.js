import React,{  useContext, useEffect, useState, useRef }  from 'react'
import { StyleSheet,  View, Text, FlatList, TextInput, Modal, Pressable} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons'
import criarCabo, { Cabos } from '../api/Utils'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default function ModalAdicionarCaboNaCEO(props) {

  const [quantidadeDeGrupos, setQuantidadeDeGrupos] = useState(0)
  const [quantidadeDeFibras, setQuantidadeDeFibras] = useState(0)
  const [nome, setNome] = useState("") 
  const [descricao, setDescricao] = useState("") 

    


    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    props.esconder(false)
            }}
            >        
               
              <View style={styles.modalView}>
                  <View style={styles.box}>
                    <Text style={styles.texto}>Inserção de cabo </Text>
                    <Text style={styles.texto}>Quantidade de grupos</Text>
                    <View style={styles.pickerContainer}>
                      <Picker       
                          mode='dropdown'
                          selectedValue={quantidadeDeGrupos}
                          onValueChange={(itemValue, itemIndex) => {
                            setQuantidadeDeGrupos(itemValue)
                            
                          }}                      
                          >              
                            <Picker.Item label="1" value="1"  />
                            <Picker.Item label="2" value="2"  />
                            <Picker.Item label="3" value="3"  />
                            <Picker.Item label="4" value="4"  />
                            <Picker.Item label="6" value="6"  />
                            <Picker.Item label="8" value="8"  />
                            <Picker.Item label="12" value="12"  />
                      </Picker>
                    </View>

                    <Text style={styles.texto}>Quantidade total de fibras</Text>
                    <View style={styles.pickerContainer}>
                      <Picker    
                          mode='dropdown'
                          selectedValue={quantidadeDeFibras}
                          onValueChange={(itemValue, itemIndex) => {
                            setQuantidadeDeFibras(itemValue)
                            
                          }}                      
                          >              
                            <Picker.Item label="1" value="1"  />
                            <Picker.Item label="2" value="2"  />
                            <Picker.Item label="6" value="6"  />
                            <Picker.Item label="12" value="12"  />
                            <Picker.Item label="24" value="24"  />
                            <Picker.Item label="36" value="36"  />
                            <Picker.Item label="48" value="48"  />
                            <Picker.Item label="72" value="72"  />
                            <Picker.Item label="96" value="96"  />
                            <Picker.Item label="144" value="144"  />
                      </Picker>
                    </View>
                    <Text style={styles.texto}>Identificação do cabo</Text>
                    <TextInput style={styles.textInput} value={nome} onChangeText={(valor) => setNome(valor)} />
                    <Text style={[styles.texto]}>Descrição do cabo</Text>
                    <TextInput style={[styles.textInput, {height: 100}]} multiline={true}  value={descricao} onChangeText={(valor) => setDescricao(valor)} />
                    <View style={styles.linha}>
                        <Pressable style={[styles.botaoInferior,{backgroundColor: "#ddd"}]}
                        
                        onPress={() => {
                        
                           props.esconder(false)
                          
                        }}
                        >
                        <MaterialIcons name="keyboard-return" size={48} color="#fff"/>
                        </Pressable>
                        
                        <Pressable
                         style={[styles.botaoInferior,{backgroundColor: "#2196F3"}]}
                        onPress={() => {
                          var cabo = criarCabo(props.marcador.id, nome, descricao, quantidadeDeFibras, quantidadeDeGrupos, true)
                          props.add(cabo)
                          props.esconder(false)
                        }}
                        >
                        <MaterialIcons name="check" size={48} color="#fff"/>
                        </Pressable>
                    </View>
                  </View>
                  
              </View>
                    
                            
                                               
            </Modal>   
        </View>
    )
}

const styles = StyleSheet.create({
   
    centeredView: {
        flex: 1,
        
        justifyContent: "center",
        alignItems: "center",
        marginTop: 35
      },
      modalView: {
       
        margin: 10,
     
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      box:{
        backgroundColor: "#fff",
        margin: 10,
        width: '100%',
       
      },
      texto:{
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        padding: 5

      },
      
      pickerContainer:{
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
      },
      textInput:{
        height: 50,
        padding: 5,
        fontSize: 18,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#fff",
        margin: 5
      },
      linha:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
      },
      botaoInferior:{
        margin: 5,
        height: 60,
        width: 100,
       
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
      }
      
});