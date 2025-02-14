import {render,screen} from '@testing-library/react';
import { expect, test } from "vitest";
import App from './App.jsx';
import "@testing-library/jest-dom";
import { MemoryRouter } from 'react-router-dom';

test('renders learn react link', ()=>{
    render(
        <MemoryRouter>
            <App></App>
        </MemoryRouter>
    );
    const homeLink = screen.getByText(/home/i);
    expect(homeLink).toBeInTheDocument();
});