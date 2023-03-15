
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

/**
 * Sorts the tournament participant list based on the order property
 * 
 * @param {*} tournament 
 * @returns 
 */
function sortTournament(tournament, participants) {
    let field = tournament.order || 'pos';
    console.log('Sort tournament by ', field)
    const reverse = field[0] == '-'
    if(reverse) {
        field = field.substr(1)
    }
    if(participants === undefined) {
        participants = tournament.participants
    }
    if(field === 'name') {
        if(reverse) {
            participants.sort( (a,b) => b.name.localeCompare(a.name))    
        }
        else {
            participants.sort( (a,b) => a.name.localeCompare(b.name))
        }
    }
    else {
        if(reverse) {
            participants.sort( (a,b) => b[field] - a[field])
        }
        else {
            participants.sort( (a,b) => a[field] - b[field])
        }
    }
    return [...participants]
}

function tournamentReducer(state, action) {
    // i keep typing this as action instead of type!! so ....
    const type = action.type || action.action;
    switch (type) {
        case 'participants':
            // replace all the participants with the new once
            return {...state, 
                participants: sortTournament(state, action.participants)
            }

        case 'addParticipant': {
            // add a single participant
            if (state.participants === null) {
                return { ...state, participants: [action.participant] }
            }
            state.participants.push(action.participant)
            return { ...state, 
                participants: sortTournament(state, state.participants) 
            }
        }
        case 'editParticipant': {
            // replace a single participant
            let matched = false;
            
            if (state.participants === null) {
                return { ...state, participants: [action.participant] }
            }

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
            return { ...state, participants: sortTournament(state, p) }
        }
        case 'deleteParticipant': {
            // delete a single participant
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
                const results = []
                for(let i = 0 ; i < state.num_rounds ; i++) {
                    results.push([])
                }
                results[round] = action.result
                return {...state, results: results}
            }
            const res = [...state.results]
            res[round] = action.result
            
            const p = new Set()
            action.result.forEach(r => {
                p.add(r.p1)
                p.add(r.p2)
            })
            
            return { ...state, results: res, 
                participants: sortTournament(state, Array.from(p))
            }
        }

        case 'addRound': {
            const rounds = [...state.rounds]
            return { ...state, rounds: rounds }
        }

        case 'editRound':
            const r = state.rounds.map(p => {
                if (p.id == action.round.id) {
                    return action.round
                }
                return p
            })
            return { ...state, rounds: r }

        case 'sort': 
            state.order = action.field
            return {...state, order: action.field, 
                participants: sortTournament(state, state.participants)
            }
        case 'reset':
        case 'replace':
            console.log('Warning replace/reset is deprecated')
            return { ...action.value }

        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}
