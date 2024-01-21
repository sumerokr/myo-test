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

  it('sends GET request to fetch users as soon as executed', async () => {
    useUsers();
    expect(mockedUsersAPI.getUsers).toHaveBeenCalled();
  });

  it('adds created user to the existing ones', async () => {
    mockedUsersAPI.getUsers.mockReturnValueOnce([]);
    mockedUsersAPI.createUser.mockReturnValueOnce(user);

    const { users, createUser } = useUsers();
    await createUser(user);

    expect(mockedUsersAPI.createUser).toHaveBeenCalledWith(user);
    expect(users.value).toEqual([user]);
  });

  it('replaces existing user after successful API call', async () => {
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

  it('receives and fullfill updateUserError when API call fail', async () => {
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
