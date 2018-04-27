/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Image, ScrollView, View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Container, Header, Content, Button } from 'native-base';

import MapView ,{ PROVIDER_GOOGLE }from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';
// import {mapStyle} from './mapStyle.js'



export default class App extends Component {
  state = {
    text: 'Let\'s play soccer',
    address: [],
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
        latitude: -27.2006710,
        longitude: -49.6362700,
      },
      {
        id: 3,
        title: 'Campo Oficial',
        description: 'Jogos Profissionais',
        latitude: -27.2006710,
        longitude: -49.6262700,
      }
    ]
  };

  
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
  this.getAddressPrediction(this.state.text)
}
  render() {
  const mapStyle = 
  [
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e9e9e9"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dedede"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#333333"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f2f2f2"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    }
]
  
    const { latitude, longitude } = this.state.places[0];
    console.log(this.state)
    return (

      <View style={styles.container}>
    

        <MapView
          hybridFlyover
          ref={map => this.mapView = map}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.0142,
            longitudeDelta: 0.0231,
          }}
          style={styles.mapView}
          
          zoomEnabled
          showsPointsOfInterest={false}
          showBuildings={false}
          onMapReady={this._mapReady}
        >
          { this.state.places.map(place => (
            <MapView.Marker
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
        <View style={styles.textBox}>
          <TextInput
            autoCorrect={false} 
            autoCapitalize="none"
            placeholder="Invitees"
            keyboardType="email-address"
            clearButtonMode="while-editing"
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
            ref={element => {
                this.attendee = element
            }}
            onSubmitEditing={this.handleAddPress}
          />
        </View>
        
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
                  <Text style={{color: '#262A35', marginTop: 5}}>Quadra do Zé</Text>
                  <Text style={{color: '#A69B9A', fontSize: 10, marginBottom: 2}}>Padre Eustáquio, 40, Savassi</Text>
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
        
      </View>
    );
  }
}

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 10,
  },
  modalList: {
    zIndex: 1, 
          flex: 1, 
          width: width,
          height: 400, 
          top: 0, 
          left: 0, 
          backgroundColor: '#f90', 
          alignSelf: "flex-start",
          justifyContent: "flex-start",
  },
  placeItem: {
    // backgroundColor: '#F0EFF0',
    height: 40,
    flex: 1,
    margin: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mapView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  textBox: {
    zIndex: 1,
    width: width - 40,
    maxHeight: 200,
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 45,
    padding: 20,
    backgroundColor: '#fff',
    shadowOffset:{  width: 0,  height: 0,  },
    shadowColor: '#666',
    shadowOpacity: 0.6,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#f90',
  },
  placesContainer: {
    width: '100%',
    maxHeight: 200,
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
});