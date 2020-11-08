

<View style={styles.panel}>
            <View style={styles.panelHeader}>      
              <Icon
                name='ios-remove'
                type = 'ionicon'
                size = {60}
              />         
            </View>
            
            {/* <View style={{ flex:1, marginLeft:15, marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <FlatList
                data={this.state.business}
                renderItem={({item}) => {
                  console.log("the marker item", item);
                  return(
                    <Home 
                      width={width}
                      height= {height}
                      item = {item}
                    />
                  );
                }}
                showsVerticalScrollIndicator = {true}
                horizontal = {false}
                keyExtractor={item => item.place_id}
                contentContainerStyle = {{ flexGrow: 1 }}
              />  
            </View> */}
            
          </View>