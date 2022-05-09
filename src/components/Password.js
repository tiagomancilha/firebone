import React,{useState} from 'react'
import {StyleSheet, Text, TextInput, View, TouchableOpacity} from 'react-native'
import {Ionicons} from "@expo/vector-icons"

export default function Password(props){

    const textChange = props.textChange

    const [input, setInput] = useState('')
    const [hidePass, setHidePass] = useState(true)

    return(
        <View style={styles.inputArea}>
            <TextInput
            style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#777"
               
                onChangeText={(txt) => {textChange(txt)}}
                secureTextEntry={hidePass}
            />
            <TouchableOpacity
                style={styles.icon}
                onPress={()=>setHidePass(!hidePass)}
            >
                {
                    hidePass ? <Ionicons  name="eye"  color="#d62e2e" size={25} /> : <Ionicons  name="eye-off"  color="#670304" size={25} />
                }
                

            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    inputArea:{
        flexDirection: 'row',
        width: '90%',
        backgroundColor: '#f1c300',
        borderRadius: 5,
        height: 50,
        alignItems: 'center'
    },
    input:{
        width: '85%',
        height: 50,
        color: '#222',
        padding: 10,
        fontSize: 18
    },
    icon:{
        width: '15%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    }
})