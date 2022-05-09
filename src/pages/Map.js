import React,{  useContext, useEffect, useState, useRef }  from 'react'
import { StyleSheet, ActivityIndicator,  View, Text, TextInput, Dimensions, PermissionsAndroid, SafeAreaView, FlatList, TouchableWithoutFeedback, Alert , Modal, Pressable} from 'react-native';
import {Picker} from '@react-native-picker/picker'
import { MaterialIcons } from '@expo/vector-icons'

import ModalAdicaoDeMarcador from '../components/ModalAdicaoDeMarcador'
import ModalEdicaoDeMarcador from '../components/ModalEdicaoDeMarcador'
import ModalListaDeBackbones from '../components/ModalListaDeBackbones'
import Cabecalho from  '../components/Cabecalho'
import  MapView,{Marker, Callout, Polyline} from 'react-native-maps'
import * as Location from 'expo-location'
import firebase from '../api/firebase'
import { StatusBar } from 'expo-status-bar'

const height  = Dimensions.get('window').height
const width  = Dimensions.get('window').width
var medicaoTotal = 0
export default function Map() {
    const [showCabecalho, setShowCabecalho] = useState(false)
    const [atualizaDistanciaTotal, setAtualizaDistanciaTotal] = useState(false)
    const [backboneSelected, setBackboneSelected] = useState(null)
    const [modoMedicao, setModoMedicao] = useState(false)
    const [listaDePostesDaMedicao, setListaDePostesDaMedicao] = useState([])
    const [comprimentoDaMedicao, setComprimentoDaMedicao] = useState(0)
    const [linhasDeMedicao, setLinhasDeMedicao] = useState([])
    const [corFabMedicao, setCorFabMedicao] = useState("#fff")
    const [modalAdicaoDeMarcador, setModalAdicaoDeMarcador] = useState(false)
    const [modalEdicaoDeMarcador, setModalEdicaoDeMarcador] = useState(false)
    const [modalListaDeBackbones, setModalListaDeBackbones] = useState(false)
    const [pontoMarcadoNoMapa, setPontoMarcadoNoMapa] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [listaDePostes, setListaDePostes] = useState([])
    const [listaDeBackbones, setListaDeBackbones] = useState([])
    const [selectedValue, setSelectedValue] = useState(null);
    const [userLocation, setUserLocation] = useState(null)
    const [visibleCallout, setVisibleCallout] = useState(false)
    const [markerSelecionado, setMarkerSelecionado] = useState(null)
    const mapRef = useRef()
    const markerRef = useRef()

  
  //////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() =>{
    (async () => {
        let { status } =  await Location.requestPermissionsAsync();
        if (status !== 'granted') {
        console.warn('Permissão para acessar o GPS negada');
        return;
        }
        let location =  await Location.getCurrentPositionAsync({});
        let wid =  await Location.watchPositionAsync({
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 2000,
            distanceInterval: 0  
        }, (loc) =>{
            setUserLocation(loc.coords)
           // console.log('localização')
           // console.log(loc.coords)
          //  const center = {latitude:loc.coords.latitude, longitude: loc.coords.longitude}
           // mapRef.current?.animateCamera({center: center,pitch: 2, heading: 20,altitude: 300, zoom: 16},2000)
        });
    })();
  },[])
  /////////////////////////////////////////////////////////////////////////////////////////////////
  
  /////////////////////////////////////////////////////////////////////////////////////////////////
  function apagarMarcador(id){
      firebase.firestore().collection("postes").doc(id).delete().then(()=>{
        const list = [];
        listaDePostes.map((poste) =>{
            if(poste.id == id){                
                return
            }
            list.push(poste)
        })
        setListaDePostes(list)
      })
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////
  function clickDoPoste(e){
      console.log(e)
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////
  function apagarPoste(poste){
    Alert.alert(
        "Atenção",
        "Deseja realmente excluir o marcador?" ,
        [
        {
            text: "Não",
            onPress: () => {
                
            },
            style: "cancel"
        },
        { text: "Sim", onPress: () => { 
            apagarMarcador(poste.id)
        }}
        ]
    );
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  function setBackbone(backbone){
      setBackboneSelected(backbone)
      console.log('selecionou o backbone')
    setSelectedValue(backbone.nome)
    setProcessing(true)
    const lista = []
    firebase.firestore().collection("postes").where('backbone', '==', backbone.nome).get()
    .then((querySnapshot) => {      
        querySnapshot.forEach((doc) => {               
            const dados = doc.data();
            lista.push({
                id: doc.id,
                tipo: dados.tipo,
                titulo: dados.titulo,
                descricao: dados.descricao,
                latitude : dados.latitude,
                longitude: dados.longitude
            })               
        })
        if(lista.length > 0){
            const center = {latitude:lista[0].latitude, longitude: lista[0].longitude}
            mapRef.current?.animateCamera({center: center,pitch: 2, heading: 20,altitude: 300, zoom: 16},2000)
           // markerRef.current?.hideCallout()
           setVisibleCallout(false)
        }
        setListaDePostes(lista)
    }).catch((erro) =>{
        console.error(erro)
    })
    setProcessing(false)  
    setShowCabecalho(true) 
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////
  function adicionarMarcador(marcador){
    
    const marker = pontoMarcadoNoMapa
    marker.descricao = marcador.descricao
    marker.tipo = marcador.tipo
    if(marcador.tipo == 'Poste'){
        marker.tipoDePoste = marcador.tipoDePoste
    }
    if(marcador.tipo == 'CEO'){
        marker.cabos = []
    }
    marker.titulo = marcador.titulo
    firebase.firestore().collection("postes").add(marker).then((docRef) =>{ 
        marker.id = docRef.id         
        setListaDePostes([...listaDePostes, marker])    
    }).catch((erro) =>{
    console.log(erro)
    })
    setProcessing(false)  
    setModalAdicaoDeMarcador(false)
  }
/////////////////////////////////////////////////////////////////////////////////////////////////
    function verificaTipoDeMarcador(tipo){
        switch(tipo){
            case 'Poste':
                return 'red'
                break
            case 'CEO':
                return 'blue'
                break
            case 'Sobra técnica':
                return 'purple'
                break
        }
    }
/////////////////////////////////////////////////////////////////////////////////////////////////
  function addMarker(local){
    //console.log("------------------------->>>>>")
   // setProcessing(true)
    const point = {
        backbone: selectedValue,
        latitude: local.nativeEvent.coordinate.latitude,
        longitude: local.nativeEvent.coordinate.longitude
    }
    setPontoMarcadoNoMapa(point)
    setModalAdicaoDeMarcador(true)
  }
///////////////////////////////////////////////////////////////////////////////////////////////////
function alterarMarcador(m){
    const novo = {
        tipo: m.tipo,
        titulo: m.titulo,
        descricao: m.descricao,
    }
    if(m.tipoDePoste != null){
        novo.tipoDePoste = m.tipoDePoste
    }else{
        novo.tipoDePoste = "-"
    }
    firebase.firestore().collection("postes").doc(m.id).update(novo).then((docRef) =>{ 
        const list = [];
        listaDePostes.map((poste) =>{
            let p = {}
            if(poste.id == m.id){
                p = novo                
                p.id = m.id
            }
            else{
                p = poste
            }
            list.push(p)
        })
        setListaDePostes(list) 
    }).catch((erro) =>{
    console.log(erro)
    })
    setVisibleCallout(false)
    setProcessing(false)  
    setModalEdicaoDeMarcador(false)
}
////////////////////////////////////////////////////////////////////////////////////////////////////
useEffect(()=>{
  
},[ ])
////////////////////////////////////////////////////////////////////////////////////////////////////
function calcularDistanciaTotal(index){

    var total = 0
    var  distancia = 0
    if(index == 0) return 0
    listaDePostesDaMedicao.map((item, i)=>{
        if(index == ( i )) return 0
        if(i == 0){ return 0}   
        const itemLista = listaDePostesDaMedicao[i - 1]
        distancia =  parseInt(1000 * getDistanceFromLatLonInKm(itemLista.latitude,itemLista.longitude, item.latitude, item.longitude))   
        total = total + distancia
    })
    //console.log("total : " + total)
    return total  
   
}
////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
        <SafeAreaView style={styles.container}>
            <StatusBar translucent={true} hidden={true}/>
            {modalAdicaoDeMarcador && <ModalAdicaoDeMarcador  cadastrarMarcador={adicionarMarcador} esconder={setModalAdicaoDeMarcador}/>}
            {modalEdicaoDeMarcador && <ModalEdicaoDeMarcador markerSelecionado={markerSelecionado} alterar={alterarMarcador} excluir={apagarPoste} esconder={setModalEdicaoDeMarcador} />}
            {modalListaDeBackbones && <ModalListaDeBackbones setBackboneSelected={setBackbone} esconder={setModalListaDeBackbones} />}
            <View style={styles.activityIndicator}>
                <ActivityIndicator animating={processing} size='large' color="yellow"/>
            </View>
            
            
            <MapView 
            ref={mapRef}
            style={styles.map}
            mapType={"hybrid"}
            onPress={(e) => {
                if(backboneSelected){
                    setShowCabecalho(!showCabecalho)
                   // mostrarCabecalho(showCabecalho)
                }
            }}
            onUserLocationChange={(loc) =>{
                 setUserLocation(loc.nativeEvent.coordinate)
            }}
            onLongPress={(e) =>{
                if(visibleCallout){
                    setVisibleCallout(false)
                    return
                }
                if(modoMedicao){                  
                    setListaDePostesDaMedicao([...listaDePostesDaMedicao,e.nativeEvent.coordinate])                   
                    return
                }
                if(selectedValue == null){
                    return
                }
                
                addMarker(e)
            }}           
            showsCompass={false}
            showsUserLocation={true}
            loadingEnabled   
            showsMyLocationButton={false}  
            zoomEnabled
            zoom={5}
            initialRegion={{ 
                latitude: -22.133594, 
                longitude: -45.060456,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121
            }}>
                { listaDePostes.map((item, i) =>{                 
                    return (  
                          
                            <Marker 
                                key={i} 
                                onPress={()=>{
                                    if(modoMedicao) return
                                    setVisibleCallout(true)
                                    setMarkerSelecionado(item)
                                }}
                                pinColor = {verificaTipoDeMarcador(item.tipo)}                           
                                coordinate={{latitude: item.latitude, longitude: item.longitude}}   
                                description={item.id}> 
                                <Callout tooltip={true} onPress={(e) => setModalEdicaoDeMarcador(true)} ref={markerRef}>
                                    <View style={styles.callout}>
                                        <Text style={styles.calloutTitulo}>{item.tipo}</Text>
                                        {(item.tipo == "Poste") && <Text style={styles.calloutTitulo}>{item.tipoDePoste}</Text>}
                                        <Text style={styles.calloutTitulo}>{item.titulo}</Text>
                                        <Text style={styles.calloutDescricao}>{item.descricao}</Text>
                                        
                                        <View>
                                            
                                        </View>
                                    </View>
                                </Callout>                              
                            </Marker>   
                                        
                    )
                })}
                
                { modoMedicao && 
                    
                     listaDePostesDaMedicao.map((item, i)=>{
                    var distancia = 0
                    var total = 0
                    if(i == 1){
                        const itemLista = listaDePostesDaMedicao[i -1]
                        distancia =  parseInt(1000 * getDistanceFromLatLonInKm(itemLista.latitude,itemLista.longitude, item.latitude, item.longitude))
                        console.log("distancia inicial") 
                        total = distancia                         
                    } 
                    if(i > 1){
                        for(var c = 0; c < i ; c++){
                            const origem = listaDePostesDaMedicao[c]
                            const destino = listaDePostesDaMedicao[c + 1]
                            distancia =  parseInt(1000 * getDistanceFromLatLonInKm(origem.latitude,origem.longitude, destino.latitude, destino.longitude))                          
                            total += distancia
                            console.log("distancia total: " + total)  
                        }
                    }

                                  
                        return(
                            <Marker 
                                key={i} 
                                onPress={()=>{
                                   
                                }}
                                pinColor = {"red"}                           
                                coordinate={item}   
                                title={i > 0 ?   distancia + "m" : "Início"}

                                description={ "Total: " + total + "m" }
                            >
                            </Marker>
                        )
                    })

                }

                { modoMedicao && <Polyline  coordinates={listaDePostesDaMedicao} lineCap={"round"} strokeColor="yellow"  strokeWidth={7}/>}
                        
        </MapView>
        <TouchableWithoutFeedback
            onPress={()=>{
                
                if(modoMedicao == false){
                    setCorFabMedicao('#000')
                    setModoMedicao(true)
                }
                else{
                    setCorFabMedicao('#fff')
                    setModoMedicao(false)
                    setListaDePostesDaMedicao([])
                    medicaoTotal = 0
                }
            }}>
            <View style={[styles.fabMedicao, {backgroundColor: corFabMedicao}]}>
                <MaterialIcons name="linear-scale" size={36} color="#aaa"/>
            </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
            onPress={()=>{
                if(modoMedicao) return
                setModalListaDeBackbones(true)
               
            }}>
            <View style={styles.fabLista}>
                <MaterialIcons name="menu" size={36} color="#aaa"/>
            </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
            onPress={()=>{
               
                if(userLocation == null) return
                const center = {latitude:userLocation.latitude, longitude: userLocation.longitude}
                mapRef.current?.animateCamera({center: center,pitch: 2, heading: 20,altitude: 300, zoom: 17},2000)
                if(visibleCallout){
                    setVisibleCallout(false)
                }
            }}>
            <View style={styles.fabGPS}>
                <MaterialIcons name="gps-fixed" size={36} color="#aaa"/>
            </View>
        </TouchableWithoutFeedback>

        <Cabecalho show={showCabecalho}  dados={backboneSelected} />

        </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    map: { 
        height,
        width
    },
    fabMedicao:{
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#254048",
        bottom: 200,
        right: 15
    },
    fabLista:{
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        bottom: 130,
        right: 15
    },
    fabGPS:{
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        bottom: 60,
        right: 15
    },
    pickerModalAddMarcador:{
        height: 50,
        width: '90%'
      //  borderRadius: 20,
      //  textAlign: 'center'
    },
    backbonePicker:{
        position: 'absolute',
        zIndex: 5,
        paddingLeft: 15,
        backgroundColor: '#dddddd',
        top: 10,
        marginTop: 25,
        height: 50,
        width: '90%',
        borderRadius: 10,
        borderColor: '#aaa',
        borderWidth: 2,
        justifyContent: 'center',
       
    },
    picker:{
        fontSize: 30,
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 5,
        textAlign: 'center'
    },
    callout: {
        backgroundColor: '#fff',
        marginBottom: 5,
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 5,
        paddingBottom: 5
    },
    calloutTitulo:{
        fontSize: 11,
        fontWeight: 'bold'
    },
    calloutDescricao:{
        fontSize: 9,
        color: '#444',
        fontWeight: 'bold'
    },
    calloutApagar:{
        fontSize: 8,
        color: '#888',
        fontWeight: 'bold'
    },
    activityIndicator:{
       
        justifyContent: 'center',
        alignItems: 'center',
       
        zIndex: 10,
        position: 'absolute',
       
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
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
      button: {
        borderRadius: 15,
        padding: 10,
        elevation: 2
      },
      buttonOpen: {
        backgroundColor: "#ccc",
        color: "#f00"
      
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      },
      modalInput:{
          
          borderWidth: 1,
          borderRadius: 5,
          borderColor: "#ccc",
          paddingLeft: 10,
          paddingRight: 10,
         
          height: 50,
          marginBottom: 10
      }
});
