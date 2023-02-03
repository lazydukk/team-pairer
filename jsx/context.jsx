
import React, {
    createContext, useContext,
    useEffect, useReducer
} from 'react';

const TournamentContext = createContext(null)
const TournamentDispatchContext = createContext(null)


export function TournamentProvider({ children }) {
    const [tournament, dispatch] = useReducer(
        tournamentReducer,
        null
    );
  
    return (
        <TournamentContext.Provider value={tournament}>
            <TournamentDispatchContext.Provider value={dispatch}>
                {children}
            </TournamentDispatchContext.Provider>
        </TournamentContext.Provider>
    );
}

export function useTournament() {
    return useContext(TournamentContext);
}

export function useTournamentDispatch() {
    return useContext(TournamentDispatchContext);
}

function tournamentReducer(state, action) {
    // i keep typing this as action instead of type!! so ....
    const type = action.type || action.action;
    switch (type) {
        case 'addParticipant': {
            if (state.participants === null) {
                return { ...state, participants: [action.participant] }
            }
            const p = [...state.participants, action.participant]
            return { ...state, participants: p }
        }
        case 'editParticipant': {
            let matched = false;
            const p = state.participants.map(p => {
                if (p.id == action.participant.id) {
                    matched = true;
                    return action.participant
                }
                return p
            })
            if(matched === false) {
                return {...state,
                     participants: [...state.participants, action.participant]}
            }
            return { ...state, participants: p }
        }
        case 'deleteParticipant': {
            if (state.participants === null) {
                return state
            }
            const p = state.participants.filter(p => p.id != action.participant.id)
            return { ...state, participants: p }
        }

        case 'changed': {
            return state.map(t => {
                if (t.id === action.task.id) {
                    return action.task;
                } else {
                    return t;
                }
            });
        }

        case 'updateResult': {
            // updates the results section of the tournament.
            // results are maintained as an array referenced by round number 
            // but round numbers start from one. The caller needs to make sure
            // that round numbers are adjusted to zero based.

            const round = action.round
            if(state.results === undefined) {
                return {...state, results: [action.result]}
            }
            const results = [...state.results]
            if(round >= results.length) {
                results.push(action.result)
            }
            else {
                results[round] = action.result
            }
            return { ...state, results: results }
        }

        case 'addRound': {
            const rounds = [...state.rounds]
            return { ...state, rounds: rounds }
        }

        case 'editRound':
            const r = state.participants.map(p => {
                if (p.id == action.round.id) {
                    return action.round
                }
                return p
            })
            return { ...state, rounds: r }


        case 'reset':
        case 'replace':
            console.log(action.value)
            return { ...action.value }

        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}
