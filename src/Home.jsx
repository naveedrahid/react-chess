import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './App.css';
import { auth, db } from './firebase';


export default function Home() {

    const history = useHistory();
    const { currentUser } = auth;
    const [showModal, setShowModal] = useState(false);

    const newGameOption = [
        { label: 'Black Pieces', value: 'b' },
        { label: 'Whit Pieces', value: 'w' },
        { label: 'Random', value: 'r' },
    ]

    function handlePlayOnline() {
        setShowModal(true);
    }

    async function startOnlineGame(startingPiece) {
        const member = {
            uid: currentUser.uid,
            piece: startingPiece === 'random' ? ['b', 'w'][Math.round(Math.random)] : startingPiece,
            name: localStorage.getItem('userName'),
            creator: true
        }
        const game = {
            status: 'waiting',
            members: [member],
            gameId: `${Math.random().toString(36).substr(2, 9)}_${Date.now()}`
        }
        await db.collection('games').doc(game.gameId).set(game);
        history.push(`/game/${game.gameId}`);
    }

    return (
        <>
            <div className='columns home'>
                <div className='columns has-background-primary home-columns'>
                    <button className='button is-link'>
                        Play Locally
                    </button>
                </div>
                <div className='columns has-background-link home-columns'>
                    <button className='button is-link'
                        onClick={handlePlayOnline}
                    >
                        Play Online
                    </button>
                </div>
            </div>
            <div className={`modal ${showModal ? 'is-active' : ''}`}>
                <div className='modal-background'></div>
                <div className='card'>
                    <div className='card-content'>
                        Please Slect your piece want to start
                    </div>
                    <footer className='card-footer'>
                        {newGameOption.map(({ label, value }) => (
                            <span
                                className='card-footer-item pointer'
                                key={value}
                                onClick={() => startOnlineGame(value)}
                            >
                                {label}
                            </span>
                        ))}
                    </footer>
                </div>
                <button className='modal-close is-large'
                    onClick={() => setShowModal(false)}
                ></button>
            </div>
        </>
    )
}
