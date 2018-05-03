/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Image,
  Animated,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  FlatList
} from 'react-native';

import {
  Container,
  Button,
  Header,
  Content,
  List,
  ListItem,
  Icon,
  Left,
  Body,
  Right,
  Switch
} from 'native-base';

import MapView from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';
// import {mapStyle} from './mapStyle.js'

const { height, width } = Dimensions.get('window');

const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0142
const LONGITUDE_DELTA = 0.0231


export default class App extends Component {
  state = {
    scrollX: new Animated.Value(0),
    offset: new Animated.ValueXY({ x: 0, y: height }),
    text: 'Let\'s play soccer',
    address: [],
    userLatitude: 0,
    userLongitude: 0,
    initialRegion: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0,
      longitudeDelta: 0,
  },
    markerPosition: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0,
      longitudeDelta: 0,
    },
    error: '',
    places: [
      {
        id: 1,
        title: 'Quadra do Zé',
        description: 'Grama Sintética.',
        latitude: -19.867845, 
        longitude: -43.984736,
      },
      {
        id: 2,
        title: 'Futebol de Salão',
        description: 'Temos Vestiários Climatizados',
        latitude: -19.9384408,
        longitude: -43.9417656,
      },
      {
        id: 3,
        title: 'Campo Oficial',
        description: 'Jogos Profissionais',
        latitude: -19.9369419,
        longitude: -43.9368658,
      }
    ],

    photos:[
      { uri: 'https://3k17pg4on1x4dc3q9jf49ydd-wpengine.netdna-ssl.com/wp-content/uploads/2015/01/Hondurasindoorsoccer5.jpg' },
      { uri: 'https://3k17pg4on1x4dc3q9jf49ydd-wpengine.netdna-ssl.com/wp-content/uploads/2015/01/Hondurasindoorsoccer1.jpg' },
      { uri: 'https://3k17pg4on1x4dc3q9jf49ydd-wpengine.netdna-ssl.com/wp-content/uploads/2015/01/Hondurasindoorsoccer18.jpg' },
      { uri: 'https://static.wixstatic.com/media/12ec54_2b95275df9504ac6bcbf60aa59b9ad6d.jpg/v1/fill/w_787,h_488,al_c,q_85,usm_0.66_1.00_0.01/12ec54_2b95275df9504ac6bcbf60aa59b9ad6d.jpg'}
    ],
    infoDetalhe: [],
  };

 watchID: ?number = null 
  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position)=>{
    let lat = parseFloat(position.coords.latitude)
    let long = parseFloat(position.coords.longitude)

    let initialRegion = {
      latitude: lat,
      longitude: long,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }

    this.setState({ initialPosition: initialRegion})
    this.setState({ markerPosition: initialRegion})
  },
  (error) => alert(JSON.stringify(error)),
  { enableHighAccuracy: true, timeout: 2000, maximumAge: 1000 })

  this.watchID = navigator.geolocation.watchPosition((position) => {
    let lat = parseFloat(position.coords.latitude);
    let long = parseFloat(position.coords.longitude);

    let lastRegion = {
      latitude: lat,
      longitude: long,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }
    this.setState({ initialPosition: lastRegion })
    this.setState({ markerPosition: lastRegion })
  })
}

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

 onPressIn = (place) => {
    Animated.spring(this.state.offset.y, {
      toValue: 0,
      speed: 5,
      bouciness: 20,
    }).start();
    this.setState({
      nfoDetalhe: place,
    })
  }

   onPressOut = () => {
    Animated.spring(this.state.offset.y, {
      toValue: height,
      speed: 5,
      bouciness: 20,
    }).start();
  }
  
  getAddressPrediction = (text) => {
    RNGooglePlaces.getAutocompletePredictions(text)
    .then((results) => {
      this.setState({ address: results })
      console.log(results)
    }, () => {
      console.log(this.state)
    })
    .catch((error) => console.log(err))
  }

  _mapReady = () => {
    this.state.places[0].mark.showCallout();
  };

handleAddPress = () => {
  this.attendee.setNativeProps({ text: '' })
  // this.getAddressPrediction(this.state.text)
  this.onPressIn();
}
  render() {
    let position = Animated.divide(this.state.scrollX, width);
    const { latitude, longitude } = this.state.places[0];
    return (

      <View style={styles.container}>
        <MapView
          hybridFlyover
          ref={map => this.mapView = map}
          region={this.state.initialPosition}
          style={styles.mapView}
          
          
          showsPointsOfInterest
          showBuildings={false}
         
        >
          { this.state.places.map(place => (
            
            <MapView.Marker
              onPress={() => {this.setState({ infoDetalhe: place })}}
              ref={mark => place.mark = mark}
              title={place.title}
              description={place.description}
              key={place.id}
              coordinate={{
                latitude: place.latitude,
                longitude: place.longitude,
              }}
              image={require('./assets/stadium1.png')}
            />
          ))}
        </MapView>
        <ScrollView
          style={styles.placesContainer}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            // quanto scroll foi realizado
            const place = (e.nativeEvent.contentOffset.x > 0)
              ? e.nativeEvent.contentOffset.x / Dimensions.get('window').width
              : 0;

            const { latitude, longitude, mark } = this.state.places[place];

            this.mapView.animateToCoordinate({
              latitude,
              longitude
            }, 500);

            setTimeout(() => {
              mark.showCallout();
            }, 500)
          }}
        >
          { this.state.places.map(place => (
            <View key={place.id} style={styles.place}>
              <View style={styles.placeItem}>
                <View
                style={{
                  borderWidth: 1,
                  borderRadius: 2,
                  borderColor: '#ddd',
                  borderBottomWidth: 0,
                  shadowColor: '#ddd',
                  shadowOffset: { width: 1, height: 1 },
                  shadowOpacity: 0.6,
    shadowRadius: 3,
                }}>
                  <Image
                    style={{
                      width: 50, 
                      height: 50, 
                      borderRadius: 5}}
                    source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Zinedine_Zidane_by_Tasnim_03.jpg'}}
                  />
                </View>
                <View style={{
                  alignItems: 'stretch', flex: 1, marginLeft: 10, marginBottom: 2}}>
                  <Text style={{
                    fontSize: 20,
                    fontFamily: 'FontAwesome',
                    fontWeight:'400',
                    color: '#262A35', marginTop: 5}}>Quadra do Zé</Text>
                  <Text style={{color: '#A69B9A', fontSize: 15, fontFamily: 'Open Sans', marginBottom: 2}}>Padre Eustáquio, 40, Savassi Belo Horizonte</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 2}}>
                    <View style={{width: 8, height: 8, borderRadius: 8, backgroundColor: '#02ca9d'}} />
                    <Text style={{color: '#02ca9d', marginLeft: 5, fontSize: 10}}>Disponível</Text>
                  </View>
                </View>
                <Image
                  style={{width: 50, height: 50, borderRadius: 5}}
                  source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}}
                />
              </View>
              <View style={styles.placeItem}>
                <Button bordered light>
                  <Text>Light</Text>
                </Button>
              </View>
              <View style={styles.placeItem}>
              <View 
                    style={{ 
                      borderWidth: 0.5,
                      borderColor: '#fba036',
                      shadowColor: '#fba036',
                      shadowOffset: { width: 1, height: 1 },
                      shadowOpacity: 0.6,
                      shadowRadius: 3,
                      width: 55,
                      height: 55, 
                      borderRadius: 55, justifyContent:'center', alignItems: 'center'}}>
                    <Text
                    style={{ 
                      
                      marginHorizontal: 20, color: '#484848'}}
                    >OK</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {this.onPressIn(place)}}
                    >
                      <View 
                        style={{ 
                          shadowColor: '#fba036',
                          shadowOffset: { width: 2, height: 2 },
                          shadowOpacity: 0.6,
                          shadowRadius: 3,
                          backgroundColor: '#fba036', borderRadius: 25, justifyContent:'center', alignItems: 'center'}}>
                        <Text
                        style={{ 
                          
                          marginHorizontal: 20, color: 'white'}}
                        >Detalhes</Text>
                      </View>
                  </TouchableOpacity
                    
                    >
                  <View 
                    style={{ 
                      shadowColor: '#fba036',
                      shadowOffset: { width: 2, height: 2 },
                      shadowOpacity: 0.6,
                      shadowRadius: 3,
                      backgroundColor: '#fba036', borderRadius: 25, justifyContent:'center', alignItems: 'center'}}>
                    <Text
                    style={{ 
                      
                      marginHorizontal: 20, color: 'white'}}
                    >Detalhes</Text>
                  </View>
              </View>
            </View>
            
          )) }

        </ScrollView>
      {/*<View />*/}
        <Animated.View style={[styles.overImg,
          {transform: [
          { translateY: this.state.offset.y }
          ] }
      

          ]}>
            <View style={styles.container}>
        <View style={{justifyContent: 'center',}}>
          
          <ScrollView
            style={styles.placeMainPics}
            horizontal={true}
            pagingEnabled={true} // animates ScrollView to nearest multiple of it's own width
            showsHorizontalScrollIndicator={false}
            // the onScroll prop will pass a nativeEvent object to a function
            onScroll={Animated.event( // Animated.event returns a function that takes an array where the first element...
              [{ nativeEvent: { contentOffset: { x: this.state.scrollX } } }] // ... is an object that maps any nativeEvent prop to a variable
            )} // in this case we are mapping the value of nativeEvent.contentOffset.x to this.state.scrollX
            scrollEventThrottle={16} // this will ensure that this ScrollView's onScroll prop is called no faster than 16ms between each function call
            >
              {
                this.state.photos.map((source, i) => { // for every object in the this.state.photos array...
                return ( // ... we will return a square Image with the corresponding object as the source
                  <Image
                    key={i} // we will use i for the key because no two (or more) elements in an array will have the same index
                    style={{ width, height: width }}
                    source={source}
                  />
                  );
                })
              }
          </ScrollView>
          <View
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: width - 20,
            flexDirection: 'row',
            flex: 1,
            height: 40, 
            // borderWidth: 1, 
            // borderColor: 'red',  
            position: 'absolute', 
            top: 30 }}
          >
          
          <TouchableOpacity
          onPress={() => {this.onPressOut()}}
          >
            <Icon style={styles.headerButton}   type="FontAwesome" name="arrow-left" />
          </TouchableOpacity>
            <Image
              resizeMode="contain"
              style={{width: 200, height: 35, }}
              source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png'}}
            />
            <TouchableOpacity
              onPress={() => {this.onPressOut()}}

            >
              <Icon style={styles.headerButton}   type="FontAwesome" name="heart" />
            </TouchableOpacity>
          </View>
          {/*<Text style={{ borderWidth: 1, borderColor: 'red', color: '#f90', position: 'absolute', top: 120, left: 50 }}>iPlay</Text>*/}
          <View
          style={{
            alignSelf: 'center', 
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
            position: 'absolute', 
            bottom: 2 

            }} // this will layout our dots horizontally (row) instead of vertically (column)
          >
          {this.state.photos.map((_, i) => { // the _ just means we won't use that parameter
            let opacity = position.interpolate({
              inputRange: [i - 1, i, i + 1], // each dot will need to have an opacity of 1 when position is equal to their index (i)
              outputRange: [0.3, 1, 0.3], // when position is not i, the opacity of the dot will animate to 0.3
              // inputRange: [i - 0.50000000001, i - 0.5, i, i + 0.5, i + 0.50000000001], // only when position is ever so slightly more than +/- 0.5 of a dot's index
              // outputRange: [0.3, 1, 1, 1, 0.3], // is when the opacity changes from 1 to 0.3
              extrapolate: 'clamp' // this will prevent the opacity of the dots from going outside of the outputRange (i.e. opacity will not be less than 0.3)
            });
            return (
              <Animated.View // we will animate the opacity of the dots so use Animated.View instead of View here
                key={i} // we will use i for the key because no two (or more) elements in an array will have the same index
                style={{ opacity, height: 5, width: 5, backgroundColor: '#fafafa', margin: 5, borderRadius: 5 }}
              />
            );
          })}
        </View>
        </View>

        <View style={styles.placeName}>
        <View style={styles.info}>
          <Text style={styles.infoText}>{this.state.infoDetalhe.title}</Text>
          <Text style={[styles.infoText, styles.infoTextShield]}>3km</Text>
        </View>
        <View style={styles.info}>
          <View style={{flexDirection: 'row',
          alignItems: 'center'
        }}>
            <View style={{ backgroundColor: 'green', width: 10, height: 10, marginTop: 10, marginRight: 5, borderRadius: 10}} />
            <Text style={styles.subInfoText}>Aberto agora</Text>
          </View>
          
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.subInfoText}>5.0</Text>
            <Text style={styles.subInfoText}>★★★★★</Text>
          </View>
          
        </View>
        <View style={styles.info}>
          <Text style={styles.subInfoText}>Rua da Bahia, 190 Lourdes - Belo Horizonte</Text>
        </View>
      </View>
      <View style={styles.placeActions}/>
      <View style={styles.sectionContainer}>
        <View style={styles.boxContainer}>
          <Icon type="EvilIcons" name="calendar" style={{fontSize: 30, color: '#484848'}}/>
        </View>
        <View style={styles.boxContainer}>
          <Icon type="Ionicons" name="ios-arrow-down-outline" style={{fontSize: 30, color: '#484848'}}/>
        </View>
        <View style={styles.boxContainer}>
          <Icon type="Ionicons" name="ios-arrow-down-outline" style={{fontSize: 30, color: '#484848'}}/>
        </View>
        <View style={styles.boxContainer}>
          <Icon type="Ionicons" name="ios-arrow-down-outline" style={{fontSize: 30, color: '#484848'}}/>
        </View>

      </View>
      
      <View style={{backgroundColor: 'white'}}>
        <List>
            <ListItem icon>
              <Left>
                <Icon name="pin" />
              </Left>
              <Body>
                <Text>Rua Ipė 133, Pedro Leopoldo</Text>
              </Body>
             
            </ListItem>
            <ListItem icon>
              <Left>
                <Icon name="clock" style={{fontSize: 20, color: 'red'}}/>
              </Left>
              <Body>
                <Text>Wi-Fi</Text>
              </Body>
              <Right>
                <Text>GeekyAnts</Text>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem icon>
              <Left>
                <Icon name="bluetooth" />
              </Left>
              <Body>
                <Text>Bluetooth</Text>
              </Body>
              <Right>
                <Text>On</Text>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </List>
        </View>
        
      </View>

        </Animated.View>
        
        
        
      </View>
    );
  }
}



const styles = StyleSheet.create({
    sectionContainer: {
    // flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: '#f90',
    marginHorizontal: 20,
  },
  boxContainer: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d3dfde',
    borderRadius: 60,
  },
  container: {
    flex: 1,
    backgroundColor: '#79e4ed',
    // justifyContent: 'center',
    // alignItems: 'center',
    // width: null,
    //   height: null,
    // // justifyContent: 'space-between',
    // // alignItems: 'flex-end',
    // // paddingVertical: 10,
  },
  overImg: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 1,
    backgroundColor: 'white',
    width: width,
    height: height,
  },
  overComponent: {
    zIndex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  textBox: {
    // zIndex: 1,
    width: width - 40,
    maxHeight: 200,
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 45,
    marginBottom: 40,
    padding: 20,
    backgroundColor: '#fff',
    shadowOffset:{  width: 0,  height: 0,  },
    shadowColor: '#666',
    shadowOpacity: 0.6,
    borderRadius: 2,
    borderWidth: StyleSheet.hairStyle,
    borderColor: '#f90',
  },
   mapView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  // modalList: {
  //   zIndex: 1, 
  //         flex: 1, 
  //         width: width,
  //         height: 400, 
  //         top: 0, 
  //         left: 0, 
  //         backgroundColor: '#f90', 
  //         alignSelf: "flex-start",
  //         justifyContent: "flex-start",
  // },
  placeItem: {
    // backgroundColor: '#F0EFF0',
    height: 40,
    flex: 1,
    margin: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // mapView: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   bottom: 0,
  //   right: 0,
  // },
  // textBox: {
  //   zIndex: 1,
  //   width: width - 40,
  //   maxHeight: 200,
  //   backgroundColor: '#FFF',
  //   marginHorizontal: 20,
  //   marginTop: 45,
  //   padding: 20,
  //   backgroundColor: '#fff',
  //   shadowOffset:{  width: 0,  height: 0,  },
  //   shadowColor: '#666',
  //   shadowOpacity: 0.6,
  //   borderRadius: 2,
  //   borderWidth: 1,
  //   borderColor: '#f90',
  // },
  placesContainer: {
    width: '100%',
    height: 200,
    
    position: 'absolute',
    bottom: 20,
  },

  place: {
    width: width - 40,
    maxHeight: 200,
    backgroundColor: '#F0EFF0',
    marginHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    shadowOffset:{  width: 2,  height: 2,  },
    shadowColor: '#666',
    shadowOpacity: 0.6,
  },

  title: {
    fontWeight: 'bold',
    fontSize: 18,
    backgroundColor: 'transparent',
  },

  description: {
    color: '#999',
    fontSize: 12,
    marginTop: 5,
  },

  ///////////////////

  headerButton: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },  
  placeHeader: {
    width: width,
    height: 80,
    flexDirection: 'row',
  },
  placeMainPics: {
    maxHeight: 200,
  },
  placeName: {
    width: width,
    padding: 10,
    backgroundColor: '#2b314d',
  },
  info: {
    marginHorizontal: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-between',    
  },
  infoText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  infoTextShield: {
    borderWidth: 1, 
    borderColor: '#62679b',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: 'center',
  },
  subInfoText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 5,
    marginTop: 10,
  },
  placeActions: {
    width: width,
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  activeTitle: {
    color: 'red',
  },
  viewShadows: {
    elevation: 3,
    shadowColor: '#f90',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0
  },
  card: {
    width: width, 
    height: 200, 

  },
  placeDescriptionList: {
    backgroundColor: '#f8fafa',
    flex: 1,
  },
});