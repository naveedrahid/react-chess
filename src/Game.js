import * as Chess from 'chess.js'
import { BehaviorSubject } from 'rxjs'
import {map} from 'rxjs/operators'
import {auth} from './firebase'
import * as fromDocRef  from 'rxfire/firestore'

let gameRef
let member
const chess = new Chess()

export let gameSubject;

export async function initGame(gameRefFb) {
    const {currentUser} = auth;
    if (gameRefFb) {
        gameRef = gameRefFb
        const initialGame = await gameRefFb.get().then(doc => doc.data())
        if (!initialGame) {
            return 'notFound'
        }
        const creator = initialGame.members.find(m => m.creator === true)
        if (initialGame.status === 'waiting' && creator.uid === currentUser.uid) {
            const currentUser = {
                uid: currentUser.uid,
                name: localStorage.getItem('userName'),
                piece: creator.piece === 'w'? 'b' : 'w'
            }
            const updateMembers = [...initialGame.members, currentUser]
            await gameRefFb.update({
                members: updateMembers,
                status: 'ready'
            })
        } else if(!initialGame.members.map(m => m.uid).includes(currentUser.uid)){
            return 'intruder';
        }
        chess.reset();

        gameSubject = fromDocRef(gameRefFb).pipe(
            map( gameDoc =>{
                const game = gameDoc.data()
                const {pendingPromotion, gameData , ...restOfGame} = game
                member = game.members.find(m => m.uid === currentUser.uid)
                const oponent = game.members.find(m => m.uid === currentUser.uid)

                if (gameData) {
                    chess.load(gameData)
                }
                const isGameOver = chess.game_over()
                return{
                    board: chess.board(),
                    pendingPromotion,
                    isGameOver,
                    position: member.piece,
                    member,
                    oponent,
                    result: isGameOver ? getGameResult : null,
                    ...restOfGame
                }
            })
        )

    }else{
        gameRef = null
        gameSubject = new BehaviorSubject()
        const savedGame = localStorage.getItem('savedGame')
        if (savedGame) {
            chess.load(savedGame)
        }
        updateGame()
    }
}

export function resetGame() {
    chess.reset()
    updateGame()
}

export function handleMove(from, to) {
    const promotions = chess.moves({ verbose: true }).filter(m => m.promotion)
    console.table(promotions)
    if (promotions.some(p => `${p.from}:${p.to}` === `${from}:${to}`)) {
        const pendingPromotion = { from, to, color: promotions[0].color }
        updateGame(pendingPromotion)
    }
    const { pendingPromotion } = gameSubject.getValue()

    if (!pendingPromotion) {
        move(from, to)
    }
}


export function move(from, to, promotion) {
    let tempMove = { from, to }
    if (promotion) {
        tempMove.promotion = promotion
    }
    const legalMove = chess.move(tempMove)

    if (legalMove) {
        updateGame()
    }
}

function updateGame(pendingPromotion) {
    const isGameOver = chess.game_over()

    const newGame = {
        board: chess.board(),
        pendingPromotion,
        isGameOver,
        position: chess.turn(),
        result: isGameOver ? getGameResult() : null
    }

    localStorage.setItem('savedGame', chess.fen())

    gameSubject.next(newGame)
}
function getGameResult() {
    if (chess.in_checkmate()) {
        const winner = chess.turn() === "w" ? 'BLACK' : 'WHITE'
        return `CHECKMATE - WINNER - ${winner}`
    } else if (chess.in_draw()) {
        let reason = '50 - MOVES - RULE'
        if (chess.in_stalemate()) {
            reason = 'STALEMATE'
        } else if (chess.in_threefold_repetition()) {
            reason = 'REPETITION'
        } else if (chess.insufficient_material()) {
            reason = "INSUFFICIENT MATERIAL"
        }
        return `DRAW - ${reason}`
    } else {
        return 'UNKNOWN REASON'
    }
}