jest.mock('../../src/lib/api', () => ({
  apiPost: jest.fn(),
}));
jest.mock('expo-secure-store');

import { apiPost } from '../../src/lib/api';
import { login } from '../../src/lib/auth';

describe('Pruebas unitarias de Login', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe devolver los datos del usuario con un token', async () => {
    (apiPost as jest.Mock).mockResolvedValue({
      token: 'mocked_token',
      user: {
        id: 8,
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        dateOfBirth: '1990-01-01',
        gender: 'Hombre',
      },
    });

    const response = await login('john@example.com', 'password123');

    expect(apiPost).toHaveBeenCalledWith('/api/auth/login', {
      email: 'john@example.com',
      password: 'password123',
    });
    expect(response.token).toBe('mocked_token');
    expect(response.user.name).toBe('John Doe');
  });

  it('debe manejar el error cuando las credenciales son incorrectas', async () => {
    (apiPost as jest.Mock).mockRejectedValue(new Error('Credenciales inválidas'));

    await expect(login('wrong@example.com', 'wrongpassword'))
      .rejects
      .toThrow('Credenciales inválidas');
  });
});
