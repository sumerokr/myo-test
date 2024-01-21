import type { User, UserDraft } from '@/types';
import { useAsyncState } from '@vueuse/core';
import { usersAPI } from '@/api/users';

export const useUsers = () => {
  //#region get
  const {
    isLoading: getUsersLoading,
    error: getUsersError,
    state: users,
  } = useAsyncState(usersAPI.getUsers, null);
  //#endregion get

  //#region create
  const {
    isLoading: createUserLoading,
    error: createUserError,
    execute: executeCreateUser,
  } = useAsyncState((userData: UserDraft) => usersAPI.createUser(userData), null, {
    immediate: false,
    onSuccess: (createdUser) => {
      if (!users.value || !createdUser) return;
      users.value = users.value.concat(createdUser);
    },
  });

  const createUser = async (userData: UserDraft) => {
    if (createUserLoading.value) return;
    await executeCreateUser(0, userData);
  };
  //#endregion create

  //#region update
  const {
    isLoading: updateUserLoading,
    error: updateUserError,
    execute: executeUpdateUser,
  } = useAsyncState((user: User) => usersAPI.updateUser(user), null, {
    immediate: false,
    onSuccess: (updatedUser) => {
      if (!users.value || !updatedUser) return;
      users.value = users.value.map((user) => {
        if (user.id === updatedUser.id) {
          return updatedUser;
        }
        return user;
      });
    },
  });

  const updateUser = async (user: User) => {
    if (updateUserLoading.value) return;
    await executeUpdateUser(0, user);
  };
  //#endregion edit

  //#region delete
  const {
    isLoading: deleteUserLoading,
    error: deleteUserError,
    execute: executeDeleteUser,
  } = useAsyncState((id: User['id']) => usersAPI.deleteUser(id), null, {
    immediate: false,
    onSuccess: (deletedUser) => {
      if (!users.value || !deletedUser) return;
      users.value = users.value.filter((user) => user.id !== deletedUser.id);
    },
  });

  const deleteUser = async (id: User['id']) => {
    if (deleteUserLoading.value) return;
    await executeDeleteUser(0, id);
  };
  //#endregion delete

  return {
    getUsersLoading,
    getUsersError,
    users,

    createUserLoading,
    createUserError,
    createUser,

    updateUserLoading,
    updateUserError,
    updateUser,

    deleteUserLoading,
    deleteUserError,
    deleteUser,
  };
};
