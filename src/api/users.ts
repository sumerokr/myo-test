import type { User, UserDraft } from '@/types';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const usersAPI: {
  getUsers: () => Promise<User[]>;
  createUser: (userData: UserDraft) => Promise<User>;
  updateUser: (user: User) => Promise<User>;
  deleteUser: (userId: string) => Promise<User>;
} = {
  getUsers: async () => {
    const response = await fetch(baseUrl);
    return response.json();
  },
  createUser: async (userData) => {
    const response = await fetch(baseUrl, {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },
  updateUser: async (user) => {
    const response = await fetch(`${baseUrl}/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },
  deleteUser: async (id) => {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};
