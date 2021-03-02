import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { ImageBackground, TouchableOpacity, Text, contentContainerStyle, ScrollView, Image, StyleSheet, Platform, StatusBar, View, Button, LogBox } from 'react-native';
import colors from '../config/colors';
import { useIsFocused } from '@react-navigation/native';
import { back } from 'react-native/Libraries/Animated/src/Easing';
import "firebase/firestore";
import * as firebase from 'firebase';
import Login from './Login';
import { color } from 'react-native-reanimated';
import { FontAwesome, FontAwesome5, Entypo } from '@expo/vector-icons';
import { firestore } from 'firebase';

function Dashboard({ route, navigation }) {
    const [bio, setBio] = React.useState('')
    const [name, setName] = React.useState('')
    const [location, setLocation] = React.useState('')
    const [job, setJob] = React.useState('')
    const [skill1, setSkill1] = React.useState('')
    const [skill2, setSkill2] = React.useState('')
    const [skill3, setSkill3] = React.useState('')
    const [pb, setPb] = React.useState('')
    const [points, setPoints] = React.useState('')
    const [task1, setTask] = React.useState('')
    const [taskCategory, setCat] = React.useState('')
    const [taskDisplay, setTaskDisplay] = React.useState([]);
    const [displayUser, setDisplayUser] = React.useState()

    const { userValue } = route.params;
    //setDisplayUser(require("../assets/"+userValue.toString()+".png"));

    const isFocused = useIsFocused();

    useEffect(() => {
        //console.log(task1)
    }, [isFocused]);

    let user = firestore()
        .collection('users')
        .doc(userValue)
    user.get()
        .then((docSnapshot) => {
            if (docSnapshot.exists) {
                setBio(docSnapshot.get("bio"));
                setName(docSnapshot.get("name"));
                setJob(docSnapshot.get("occupation"));
                setLocation(docSnapshot.get("location"));
                setPb(docSnapshot.get("personalBest"));
                setPoints(docSnapshot.get("points"));
                setSkill1(docSnapshot.get("skill1"));
                setSkill2(docSnapshot.get("skill2"));
                setSkill3(docSnapshot.get("skill3"));
                setTask(docSnapshot.get("task1"));
            }
        });
    useEffect(() => {
        const subscriber =
            firestore().collection('tasks').where("user", "==", userValue)
                .get()
                .then((docSnapshot) => {
                    const taskData = []
                    docSnapshot.forEach((doc) => {
                        taskData.push(doc.data())
                    });
                    //console.log("yes")

                    setTaskDisplay(taskData)
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
        return () => subscriber;
    }, [task1])
    const displayByArray = taskDisplay.map((item, index) =>
        <View key={index} style={styles.request}>
            <Text style={[styles.requestText, styles.requestPosted]}>Pending</Text>
            <Text style={[styles.requestText, styles.requestCat]}>{item.category}</Text>
            <Image style={styles.requestImage} source={require('../assets/whiteCoin.png')} />
            <Text style={styles.requestPoint}>{item.points}</Text>
            <FontAwesome5 name="check-circle" style={styles.requestIcon} />
        </View>
    )

    return (
        <View style={styles.parentContainer}>
            <View style={styles.container}>
                <ScrollView >
                    <Image
                        source={require('../assets/logo.png')}
                        style={styles.logoImage}>
                    </Image>

                    <View style={styles.pfContainer1}>
                        <Image
                            source={require('../assets/portfolio_bg.png')}
                            style={styles.pfBg}
                        >
                        </Image>
                        <Image
                            source={userValue == "4161112222" ? require("../assets/4161112222.png") : require("../assets/9053334444.png")}
                            style={styles.profilePic}>
                        </Image>
                        <Text style={styles.name}>{name}</Text>
                        <View style={styles.bioContainer}>
                            <View style={styles.descContainer}>
                                <FontAwesome name="suitcase" style={styles.bioIcon} />
                                <Text style={styles.bioItem}>{job}</Text>
                                <FontAwesome name="map-pin" style={styles.bioIcon} />
                                <Text style={styles.bioItem}>{location}</Text>

                            </View>
                            <Text style={styles.bioLong}>{bio}</Text>
                        </View>

                        <View style={styles.skillContainer}>
                            <Text style={styles.item}>{skill1}</Text>
                            <Text style={styles.item}>{skill2}</Text>
                            <Text style={styles.item}>{skill3}</Text>
                        </View>

                    </View>
                    <View style={styles.portfolioBox1}>

                        <Text style={[styles.titles, styles.pointTitle]}>Your Points</Text>
                        <View style={styles.pointBox}>
                            <Image style={styles.pointImage} source={require('../assets/coin.png')} />
                            <Text style={styles.pointItem1}>{points} Recipoints</Text>
                            <Text style={styles.pointItem2}>personal best</Text>
                        </View>

                        <View style={styles.pointsBar}></View>
                        <View style={styles.personalPoints}></View>
                        <View style={styles.scoreCircle}></View>
                        <Text style={styles.bestScore}>{pb}</Text>

                        <Image style={styles.badges} source={require('../assets/Badges.png')} />

                        <Text style={[styles.titles, styles.requestTitle]}>Active Requests</Text>
                        {displayByArray}
                        <Text style={[styles.titles, styles.leaderTitle]}>Friend Leaderboard</Text>
                        <Image style={styles.leaderImage} source={require('../assets/leaderboard.png')} />

                    </View>
                </ScrollView>
            </View>
            <View style={styles.barContainer}>
                <View style={styles.buttons}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Dashboard')}
                        style={styles.workButton}>
                        <Image
                            source={require("../assets/dashboardButton.png")}
                            style={styles.buttonItem}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Work', { userValue })}
                        style={styles.workButton}>
                        <Image
                            source={require("../assets/workButton.png")}
                            style={styles.buttonItem}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('SendRequest', { userValue })}
                        style={styles.sendButton}>
                        <Image
                            source={require("../assets/sendButton.png")}
                            style={styles.buttonItem}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Message', { userValue })}
                        style={styles.chatButton}>
                        <Image
                            source={require("../assets/chatButton.png")}
                            style={styles.buttonItem}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    requestIcon: {
        fontSize: 24,
        color: "white",
        width: '12%',
    },
    leaderImage: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    leaderTitle: {
        marginVertical: 20,
    },
    requestTitle: {
        marginBottom: 15,
    },
    badges: {
        marginBottom: 20,
    },
    pointTitle: {
        margin: 21,
    },
    request: {
        flexDirection: 'row',
        backgroundColor: colors.secondary,
        borderRadius: 7,
        width: '82%',
        alignSelf: 'center',
        paddingVertical: 6,
        marginBottom: 10,
    },
    requestPosted: {
        width: '25%',
        fontWeight: 'bold',
    },
    requestCat: {
        width: '38%',
    },
    requestImage: {
        width: '9%',
        resizeMode: 'contain',
        height: '100%',
    },
    requestPoint: {
        fontSize: 16,
        width: '16%',
        paddingLeft: 5,
        color: colors.cream,
    },
    requestText: {
        fontSize: 16,
        color: colors.cream,
        textAlign: 'center',
    },
    titles: {
        fontSize: 24,
        color: colors.coffee,
        fontWeight: 'bold',
        marginLeft: 25,
    },
    bestScore: {
        position: 'absolute',
        marginTop: 112,
        marginLeft: 324.5,
        color: colors.cream,
    },
    scoreCircle: {
        borderRadius: 50,
        backgroundColor: colors.secondary,
        width: 34,
        height: 34,
        position: 'absolute',
        marginTop: 105,
        marginLeft: 320,
    },
    pointImage: {
        width: '9%',
        resizeMode: 'contain'
    },
    pointItem1: {
        width: '59%',
        color: colors.primary,
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 10,
    },
    pointItem2: {
        width: '32%',
        color: colors.primary,
        fontSize: 16,
        alignSelf: 'flex-end'
    },
    pointBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '90%',
        alignSelf: 'center'
    },
    personalPoints: {
        backgroundColor: colors.primary,
        width: 250,
        borderRadius: 25,
        padding: 6,
        marginLeft: '6%',
        position: 'absolute',
        marginTop: 117,
    },
    pointsBar: {
        backgroundColor: colors.orange,
        width: '84%',
        padding: 6,
        borderRadius: 25,
        marginTop: 15,
        alignSelf: 'center',
        marginBottom: 10,
    },
    bioContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '84%',
        position: 'absolute',
        alignSelf: 'center',
        marginTop: 235,
    },
    descContainer: {
        width: '80%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'center',
        marginLeft: '11%',
    },
    bioLong: {
        width: '100%',
        color: colors.coffee,
        fontSize: 15,
        marginLeft: '3%'
    },
    bioItem: {
        width: '89%',
        color: colors.coffee,
        fontWeight: 'bold',
        fontSize: 14,
        alignSelf: 'center',
        marginBottom: 3,
    },
    bioIcon: {
        width: '11%',
        color: colors.coffee,
        fontSize: 15,
        alignSelf: 'center',
        textAlign: 'center',
    },
    job: {
        paddingTop: 0,
    },
    location: {
        marginTop: 250,
    },
    parentContainer: {
        flex: 1,
    },
    container: {
        backgroundColor: colors.primary,
        flex: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    background: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    nextButton: {
        width: '100%',
        height: 70,
        backgroundColor: "#fc5c65",
    },
    logoImage: {
        marginTop: 20,
        alignSelf: 'center',
    },
    pfContainer1: {
        marginTop: 5,
        marginBottom: 35,
        alignSelf: 'center',
    },
    pfBg: {
        alignSelf: 'center',
    },
    skillContainer: {
        flexDirection: 'row',
        width: '80%',
        position: 'absolute',
        marginTop: 330,
        alignSelf: 'center',
    },
    item: {
        flex: 1,
        borderRadius: 9,
        margin: 4,
        paddingHorizontal: 7,
        paddingVertical: 5,
        backgroundColor: colors.primary,
        alignSelf: 'center',
        textAlign: 'center',
        color: 'white',
    },
    desc: {
        alignContent: 'center',
        marginLeft: 20,
    },
    portfolioBox1: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 20,
    },
    profilePic: {
        position: 'absolute',
        alignSelf: 'center',
        marginTop: 20,
    },
    profileName: {
        position: 'absolute',
        alignSelf: 'center',
        marginTop: 270,
    },
    profileBio: {
        position: 'absolute',
        alignSelf: 'center',
        marginTop: 303,
    },
    barContainer: {
        flex: 2,
        backgroundColor: colors.secondary,
    },
    buttons: {
        width: '95%',
        alignSelf: 'center',
        marginTop: 10,
        flexDirection: 'row',
    },
    sendButton: {
        flex: 1,
    },
    chatButton: {
        flex: 1,
    },
    workButton: {
        flex: 1,
    },
    buttonItem: {
        alignSelf: 'center',
    },
    name: {
        fontSize: 28,
        position: 'absolute',
        alignSelf: 'center',
        marginTop: 193,
        color: colors.primary,
        fontWeight: 'bold',
    }
})


export default Dashboard;