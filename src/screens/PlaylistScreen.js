import React, { Component, PropTypes } from 'react'
import { AsyncStorage, Image, ListView, StatusBar, StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from 'react-native'
import { observer } from 'mobx-react/native'
import { getTheme } from 'react-native-material-kit'
// import Zeroconf from 'react-native-zeroconf'
import Toolbar from '../components/Toolbar'
import colors from '../theme/colors'

const theme = getTheme()

@observer
export default class PlaylistScreen extends Component {
  static propTypes = {
    navigator: PropTypes.object,
    playlist: PropTypes.object,
    webSocketStore: PropTypes.object
  }

  _handlePress = (track) => {
    return () => {
      this.props.webSocketStore.sendPlayPlaylistTrack({
        id: this.props.playlist.id,
        name: this.props.playlist.name
      }, track)
    }
  }

  render () {
    const { playlist } = this.props
    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2) })
    const cleanTracks = []
    for (let i = 0; i < playlist.tracks.length; i++) {
      const { id, title, artist, album, albumArt, duration, playCount } = playlist.tracks[i]
      cleanTracks.push({
        id,
        title,
        artist,
        album,
        albumArt,
        duration,
        playCount
      })
    }

    ds = ds.cloneWithRows(cleanTracks)

    return (
      <View style={styles.container}>
        <StatusBar animated backgroundColor={colors.ORANGE_DARK} />
        <Toolbar title={playlist.name} navigator={this.props.navigator} />
        <View style={styles.content}>
          <View style={{ flex: 1 }}>
            <ListView
              dataSource={ds}
              style={{ flex: 1 }}
              renderRow={(track) => (
                <TouchableNativeFeedback
                  onPress={this._handlePress(track)}
                  background={TouchableNativeFeedback.SelectableBackground()}
                >
                  <View>
                    <View style={styles.track}>
                      <Image source={{ uri: track.albumArt }} style={styles.trackImage} />
                      <View style={styles.trackMeta}>
                        <Text>{track.title}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableNativeFeedback>
              )}
            />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch'
  },
  content: {
    flex: 1,
    backgroundColor: colors.GREY_LIGHTER
  },
  controlBar: {
    flex: 0,
    height: 100,
    elevation: 4
  },
  track: {
    margin: 10,
    height: 64,
    flex: 1,
    flexDirection: 'row'
  },
  trackImage: {
    height: 64,
    width: 64
  },
  trackMeta: {
    flex: 1,
    marginLeft: 16
  }
})
