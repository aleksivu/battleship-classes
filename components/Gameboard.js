import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import styles from '../style/style';

let board = [];
let ship = [];
const NBR_OF_ROWS = 5;
const START = 'plus';
const CROSS = 'cross';
const CIRCLE = 'circle';

export default class Gameboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: 'Game has not started.',
            seconds: 0,
            hits: 0,
            bombs: 0,
            ships: 0,
        }
        this.initializeBoard();
    }

    initializeBoard() {
        for (let i = 0; i < 25; i++) {
            board[i] = START;
        }
    }

    addShips() {
        while (ship.length < 3) {
            let rand = Math.floor(Math.random() * 25);
            if (ship.indexOf(rand) === -1) ship.push(rand);
        }
    }

    drawItem(number) {
        if (this.state.status === 'Game has not started.') {
            this.setState({ status: 'Click the start button first...' });
        } else if (ship.indexOf(number) === -1  && this.state.status === 'Game is on...') {
            board[number] = CROSS;
            this.setState(state => ({ bombs: state.bombs - 1 }));
        }
        else if (ship.indexOf(number) !== -1  && this.state.status === 'Game is on...') {
            board[number] = CIRCLE;
            this.setState(state => ({ bombs: state.bombs - 1 }));
            this.setState(state => ({ hits: state.hits + 1 }));
            this.setState(state => ({ ships: state.ships - 1 }));
        }

        this.interval2 = setInterval(() => {
            if (this.state.status === 'Game is on...' && this.state.bombs === 0) {
                this.setState({ status: 'Game Over. Ships remaining.' });
                clearInterval(this.interval);
            }
            else if (this.state.hits === 3) {
                this.setState({ status: 'All ships sank.' });
                clearInterval(this.interval);
            }
        }, 100);
    }

    chooseItemColor(number) {
        if (board[number] === CROSS) {
            return '#FF3031';
        } else if (board[number] === CIRCLE) {
            return '#45CE30';
        }
        else {
            return '#74B9FF';
        }
    }

    resetGame() {
        ship = [];
        this.setState({
            isCross: true,
            status: 'Game is on...',
            seconds: 30,
            bombs: 15,
            ships: 3,
            hits: 0,
        });
        this.initializeBoard();
        this.addShips();
        clearInterval(this.interval);
        clearInterval(this.interval2);
        this.Tick();
    }

    Tick() {
        this.interval = setInterval(() => {
            this.setState(state => ({
                seconds: state.seconds - 1
            }));
            if (this.state.seconds < 1) {
                clearInterval(this.interval);
                this.setState({ status: 'Timeout. Ships remaining.' });
            }
        }, 1000);
    }

    render() {
        const firstRow = [];
        const secondRow = [];
        const thirdRow = [];
        const fourthRow = [];
        const fifthRow = [];

        for (let i = 0; i < NBR_OF_ROWS; i++) {
            firstRow.push(
                <Pressable key={i} style={styles.row} onPress={() => this.drawItem(i)}>
                    <Entypo key={i} name={board[i]} size={32} color={this.chooseItemColor(i)} />
                </Pressable>
            )
        }

        for (let i = NBR_OF_ROWS; i < NBR_OF_ROWS * 2; i++) {
            secondRow.push(
                <Pressable key={i} style={styles.row} onPress={() => this.drawItem(i)}>
                    <Entypo key={i} name={board[i]} size={32} color={this.chooseItemColor(i)} />
                </Pressable>
            )
        }

        for (let i = NBR_OF_ROWS * 2; i < NBR_OF_ROWS * 3; i++) {
            thirdRow.push(
                <Pressable key={i} style={styles.row} onPress={() => this.drawItem(i)}>
                    <Entypo key={i} name={board[i]} size={32} color={this.chooseItemColor(i)} />
                </Pressable>
            )
        }

        for (let i = NBR_OF_ROWS * 3; i < NBR_OF_ROWS * 4; i++) {
            fourthRow.push(
                <Pressable key={i} style={styles.row} onPress={() => this.drawItem(i)}>
                    <Entypo key={i} name={board[i]} size={32} color={this.chooseItemColor(i)} />
                </Pressable>
            )
        }

        for (let i = NBR_OF_ROWS * 4; i < NBR_OF_ROWS * 5; i++) {
            fifthRow.push(
                <Pressable key={i} style={styles.row} onPress={() => this.drawItem(i)}>
                    <Entypo key={i} name={board[i]} size={32} color={this.chooseItemColor(i)} />
                </Pressable>
            )
        }

        return (
            <View style={styles.gameboard}>
                <View style={styles.flex}>{firstRow}</View>
                <View style={styles.flex}>{secondRow}</View>
                <View style={styles.flex}>{thirdRow}</View>
                <View style={styles.flex}>{fourthRow}</View>
                <View style={styles.flex}>{fifthRow}</View>

                <Pressable style={styles.button} onPress={() => this.resetGame()}>
                    <Text style={styles.buttonText}>Start Game</Text>
                </Pressable>

                <Text style={styles.gameinfo}>Hits: {this.state.hits} Bombs: {this.state.bombs} Ships: {this.state.ships}</Text>
                <Text style={styles.gameinfo}>Time: {this.state.seconds}</Text>
                <Text style={styles.gameinfo}>Status: {this.state.status}</Text>
            </View>
        )
    }
}