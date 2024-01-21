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
    execute: createUser,
  } = useAsyncState((userData: UserDraft) => usersAPI.createUser(userData), null, {
    immediate: false,
    onSuccess: (createdUser) => {
      if (!users.value || !createdUser) return;
      users.value = users.value.concat(createdUser);
    },
  });
  //#endregion create

  //#region update
  const {
    isLoading: updateUserLoading,
    error: updateUserError,
    execute: updateUser,
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
  //#endregion edit

  //#region delete
  const {
    isLoading: deleteUserLoading,
    error: deleteUserError,
    execute: deleteUser,
  } = useAsyncState((id: User['id']) => usersAPI.deleteUser(id), null, {
    immediate: false,
    onSuccess: (deletedUser) => {
      if (!users.value || !deletedUser) return;
      users.value = users.value.filter((user) => user.id !== deletedUser.id);
    },
  });
  //#endregion delete

  return {
    getUsersLoading,
    getUsersError,
    users,

    createUserLoading,
    createUserError,
    createUser: async (userData: UserDraft) => {
      if (createUserLoading.value) return;
      await createUser(0, userData);
    },

    updateUserLoading,
    updateUserError,
    updateUser: async (user: User) => {
      if (updateUserLoading.value) return;
      await updateUser(0, user);
    },

    deleteUserLoading,
    deleteUserError,
    deleteUser: async (id: User['id']) => {
      if (deleteUserLoading.value) return;
      await deleteUser(0, id);
    },
  };
};
