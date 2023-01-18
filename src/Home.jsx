import React, { useState } from 'react';
import './App.css';

export default function Home() {

    const [showModal, setShowModal] = useState(false);

    const newGameOption = [
        { label: 'Black Pieces', value: 'b' },
        { label: 'Whit Pieces', value: 'w' },
        { label: 'Random', value: 'r' },
    ]

    function handlePlayOnline() {
        setShowModal(true);
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
                            <span className='card-footer-item' key={value}>
                                {label}
                            </span>
                        ))}
                    </footer>
                </div>
                <button className='modal-close is-large'
                onClick={() =>  setShowModal(false)}
                ></button>
            </div>
        </>
    )
}
