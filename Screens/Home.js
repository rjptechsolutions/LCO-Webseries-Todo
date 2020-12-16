import React,{useState, useEffect} from 'react'
import {    
    StyleSheet,
    ScrollView 
} from 'react-native'

import AsyncStorage from '@react-native-community/async-storage'

import { 
  List,
  ListItem,
  Left,
  Button,
  Body,
  Icon,
  CheckBox,
  Title,
  Text,
  H1,
  Fab,
  Subtitle,
  Container,
  Right,
  Spinner
 } from 'native-base'

import {useIsFocused} from '@react-navigation/native'

export default function Home({navigation, route}) {

  const [listOfSeasons, setListOfSeasons] = useState([])
  const [loading, setLoading] = useState(false)

  const isFocused = useIsFocused()

  const getList = async () => {
    setLoading(true)

    const storeValue = await AsyncStorage.getItem('@season_list')

    if(!storeValue){
      setListOfSeasons([])
    }
    const list= JSON.parse(storeValue)
    setListOfSeasons(list)
    setLoading(false)
  }
  const deleteSeason = async (id) => {
    const newList = await listOfSeasons.filter((list) => list.id !== id)
    await AsyncStorage.setItem('@season_list',JSON.stringify(newList))
    setListOfSeasons(newList)
  }
  const markComplete  = async (id) => {
    const newArr = listOfSeasons.map((list) => {
      if (list.id == id) {
        list.isWatched = !list.isWatched
      }
      return list
    })
    await AsyncStorage.setItem('@season_list',JSON.stringify(newArr))
    setListOfSeasons(newArr)
  }

  useEffect(() => {
    getList()
  },[isFocused])

  if(loading){
    return(
      <Container styles={styles.container}>
        <Spinner color="#00b7c2" />
      </Container>
    )
  }
    return (
      <ScrollView contentContainerStyle={styles.container}>
         {listOfSeasons.length == 0 ? (
           <Container
           style={styles.container}>
              <H1 style={styles.heading}>
                WatchList is empty. Please Add a season
              </H1>
           </Container>
         ) : (
           <>
           <H1 style={styles.heading}>Next Series to watch</H1>
           <List>
             {listOfSeasons.map((season) => (
               <ListItem key={season.id} style={styles.listItem} noBorder>
               <Left>
                 <Button
                 style={styles.actionButton}
                 danger
                 onPress={() => deleteSeason(season.id)}
                 >
                   <Icon name="trash" active />
                 </Button>
                 <Button
                 style={styles.actionButton} 
                 onPress={() => {
                   navigation.navigate('Edit',{season})
                 }}                 
                 >
                   <Icon active name="edit" type="Feather" />
                 </Button>
               </Left>
               <Body>
                 <Title style={styles.seasonName}>{season.name} </Title>
                 <Text note>{season.totalNoSeason} seasons to watch </Text>
               </Body>
               <Right>
                 <CheckBox
                 checked={season.isWatched}
                 onPress={() => markComplete(season.id)}
                 />
               </Right>
            </ListItem>
             ))}
           </List>
           </>
         )}
          <Fab
          style={{backgroundColor:"#5067FF"}}
          position="bottomRight"
          onPress={() => navigation.navigate('Add')}
          >
            <Icon name="add" />
          </Fab>
      </ScrollView>
      
    )
}


const styles = StyleSheet.create({
    emptyContainer: {
      backgroundColor: '#1b262c',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: '#1b262c',
      flex: 1,
    },
    heading: {
      textAlign: 'center',
      color: '#00b7c2',
      marginVertical: 15,
      marginHorizontal: 5,
    },
    actionButton: {
      marginLeft: 5,
    },
    seasonName: {
      color: '#fdcb9e',
      textAlign: 'justify',
    },
    listItem: {
      marginLeft: 0,
      marginBottom: 20,
    },
  });
  