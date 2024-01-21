import type { User, UserDraft } from '@/types';

export const usersAPI: {
  getUsers: () => Promise<User[]>;
  createUser: (userData: UserDraft) => Promise<User>;
  updateUser: (user: User) => Promise<User>;
  deleteUser: (userId: string) => Promise<User>;
} = {
  getUsers: async () => {
    const response = await fetch('https://65a7b87994c2c5762da76352.mockapi.io/api/users');
    return response.json();
  },
  createUser: async (userData) => {
    const response = await fetch('https://65a7b87994c2c5762da76352.mockapi.io/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },
  updateUser: async (user) => {
    const response = await fetch(
      `https://65a7b87994c2c5762da76352.mockapi.io/api/users/${user.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.json();
  },
  deleteUser: async (id) => {
    const response = await fetch(`https://65a7b87994c2c5762da76352.mockapi.io/api/users/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};
