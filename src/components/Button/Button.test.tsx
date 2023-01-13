import React from 'react';
import { render, screen } from '@testing-library/react';
import {Button} from './Button';

it('renders welcome message', () => {
    render(<Button label={'Learn React'} />);
    expect(screen.getByText('Learn React')).toBeInTheDocument();
});
