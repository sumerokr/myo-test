import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useUsers } from './use-users';

const { usersAPI: mockedUsersAPI } = vi.hoisted(() => {
  return {
    usersAPI: {
      getUsers: vi.fn(),
      createUser: vi.fn(),
      updateUser: vi.fn(),
      deleteUser: vi.fn(),
    },
  };
});

vi.mock('../api/users', () => {
  return <typeof import('../api/users')>{ usersAPI: mockedUsersAPI };
});

const user = {
  createdAt: '2020-01-18T07:17:51.988Z',
  username: 'firstOne',
  profile: {
    firstName: 'Ophelia',
    lastName: 'Maggio',
    avatar: 'https://some.url/here.jpg',
  },
  id: '1',
};

describe('useUsers composable', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('Sends GET request to fetch users upon execution', async () => {
    useUsers();
    expect(mockedUsersAPI.getUsers).toHaveBeenCalled();
  });

  it('Adds the created user to the existing ones', async () => {
    mockedUsersAPI.getUsers.mockReturnValueOnce([]);
    mockedUsersAPI.createUser.mockReturnValueOnce(user);

    const { users, createUser } = useUsers();
    await createUser(user);

    expect(mockedUsersAPI.createUser).toHaveBeenCalledWith(user);
    expect(users.value).toEqual([user]);
  });

  it('Replaces an existing user after a successful API call', async () => {
    const updatedUser = {
      ...user,
      username: 'updatedOne',
    };
    mockedUsersAPI.getUsers.mockReturnValueOnce([user]);
    mockedUsersAPI.updateUser.mockReturnValueOnce(updatedUser);

    const { users, updateUser } = useUsers();
    await updateUser(updatedUser);

    expect(mockedUsersAPI.updateUser).toHaveBeenCalledWith(updatedUser);
    expect(users.value).toEqual([updatedUser]);
  });

  it('Receives and fulfills updateUserError variable when the API call fails', async () => {
    const updatedUser = {
      ...user,
      username: 'updatedOne',
    };
    mockedUsersAPI.getUsers.mockReturnValueOnce([user]);
    mockedUsersAPI.updateUser.mockRejectedValueOnce('ERROR');

    const { users, updateUserError, updateUser } = useUsers();
    await updateUser(updatedUser);

    expect(mockedUsersAPI.updateUser).toHaveBeenCalledWith(updatedUser);
    expect(users.value).toEqual([user]);
    expect(updateUserError.value).toEqual('ERROR');
  });
});
