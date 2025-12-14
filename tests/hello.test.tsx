import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Hello } from '../src/components/hello';

describe('Hello', () => {
    it('renders greeting', () => {
        render(<Hello />);
        expect(screen.getByText(/hello world/i)).toBeInTheDocument();
    });
});
