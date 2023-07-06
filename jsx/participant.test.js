/**
 * @jest-environment jsdom
 */

import { act } from "react-dom/test-utils";
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';
import React from 'react';

import { Participant, Participants } from './participant.jsx';
import { useTournament, useTournamentDispatch } from './context';
import { ResultTable, TeamResultTable } from './result.jsx';
import getCookie from './cookie';

jest.mock('./context', () => ({
    useTournament: jest.fn(),
    useTournamentDispatch: jest.fn(),
}));


describe('Participant component', () => {
    it('should render participant', async () => {
        const tournamentMock = {
            id: 123,
            slug: 'tournament-slug',
            name: 'Tri Wizard',
            team_size: 3,
        };

        const participant = {
            "id": 1800,
            "name": "Jessica Richardson",
            "played": 0,
            "game_wins": 0,
            "round_wins": 0,
            "spread": 0,
            "offed": 0,
            "rating": 1335,
            "tournament_id": 41,
            "seed": 7,
            "white": 0,
            "members": null,
            "results": [
                {
                    "id": 5295,
                    "p1_id": 1797,
                    "p2_id": 1800,
                    "table": 3,
                    "boards": null,
                    "score1": null,
                    "score2": null,
                    "round_id": 339,
                    "games_won": null,
                    "starting_id": 1800
                }
            ]
        }
        tournamentMock.participants = [participant];
        useTournament.mockReturnValue(tournamentMock);
        global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue(participant),
        });

        await act(async () => {
            render(<MemoryRouter><Participant /></MemoryRouter>);
        });

        // wait for the mocked fetch to resolve
        await waitFor(() => {
            expect(screen.getByText('Jessica Richardson')).toBeInTheDocument();
        })

    })
})


// Mock the useTournament and useTournamentDispatch hooks

// Mock the tournament data
const tournamentMock = {
    id: 1,
    slug: 'tournament-slug',
    name: 'Tri Wizard',
    participants: [
        { id: 1, pos: 1, name: 'Participant 1', rating: 1500, game_wins: 5, spread: 100 },
        { id: 2, pos: 2, name: 'Participant 2', rating: 1400, game_wins: 3, spread: 50 },
        { id: 3, pos: 3, name: 'Participant 3', rating: 1600, game_wins: 4, spread: 75 },
    ],
    rounds: [{ paired: true }],
};

describe('Participants component', () => {
    // Mock the getCookie function
    jest.mock('./cookie', () => jest.fn());

    // Set up the mock implementations for the hooks
    beforeEach(() => {
        const tournamentDispatchMock = jest.fn();
        useTournament.mockReturnValue(tournamentMock);
        useTournamentDispatch.mockReturnValue(tournamentDispatchMock);
    });

    it('renders the Participants component correctly', async () => {
        const { getByPlaceholderText, queryByText, getByText, debug } = await act(() => 
            render(<MemoryRouter><Participants /></MemoryRouter>)
        );

        expect(getByText(/Participant 1/)).toBeInTheDocument();
        expect(getByText(/Participant 2/)).toBeInTheDocument();
        expect(getByText(/Participant 3/)).toBeInTheDocument();

        // Mock the toggleParticipant function and test its functionality
        const toggleCheckbox = screen.queryByRole('checkbox');
        expect(toggleCheckbox).toBeNull()

    })

    it('tests the deleteParticipant function', async () => {
        // before rendering the component add a an html hidden input field to the document
        // that contains the participant id to be deleted
        document.body.innerHTML = `<input type='hidden' id='hh' value='1'/>`

        const { debug, queryAllByRole } = await act(() => 
            render(<MemoryRouter><Participants /></MemoryRouter>)
        )
        const toggleCheckbox = queryAllByRole('checkbox');
        
        expect(toggleCheckbox.length).toBe(3)
        //debug()
        global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue({'status': 'success'})
        });
        fireEvent.click(toggleCheckbox[0]);
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
        expect(useTournamentDispatch).toHaveBeenCalledTimes(2)
        
    })
});


