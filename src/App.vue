<script setup lang="ts">
import CreateUserForm from '@/components/CreateUserForm.vue';
import DeleteUserConfirmation from '@/components/DeleteUserConfirmation.vue';
import EditUserForm from '@/components/EditUserForm.vue';
import ModalDialog from '@/components/ModalDialog.vue';
import TheButton from '@/components/TheButton.vue';
import UserCard from '@/components/UserCard.vue';
import { useUsers } from '@/composables/use-users';
import type { User, UserDraft } from '@/types';
import { refDebounced } from '@vueuse/core';
import { computed, ref } from 'vue';

const {
  users,
  getUsersLoading,
  getUsersError,

  createUserLoading,
  createUserError,
  createUser,

  updateUserLoading,
  updateUserError,
  updateUser,

  deleteUserLoading,
  deleteUserError,
  deleteUser,
} = useUsers();

//#region search
const searchQuery = ref('');
const debouncedSearchQuery = refDebounced(searchQuery, 250);

const filteredUsers = computed(() => {
  if (!debouncedSearchQuery.value || !users.value) return users.value;

  return users.value.filter((user) => {
    const {
      username,
      profile: { firstName, lastName },
    } = user;

    return [username.toLowerCase(), firstName.toLowerCase(), lastName.toLowerCase()].some((value) =>
      value.includes(debouncedSearchQuery.value.toLowerCase())
    );
  });
});
//#endregion search

//#region create
const isCreateFormVisible = ref(false);

const handleUserCreate = async (userData: UserDraft) => {
  await createUser(userData);
  if (!createUserError.value) {
    isCreateFormVisible.value = false;
  }
};
//#endregion create

//#region edit
const userToEdit = ref<User | null>(null);

const handleUserUpdate = async (user: User) => {
  await updateUser(user);
  if (!updateUserError.value) {
    userToEdit.value = null;
  }
};
//#endregion edit

//#region delete
const userToDelete = ref<User | null>(null);

const handleUserDelete = async (id: User['id']) => {
  await deleteUser(id);
  if (!deleteUserError.value) {
    userToDelete.value = null;
  }
};
//#endregion delete
</script>

<template>
  <h1 class="text-3xl font-medium mb-2">Users</h1>

  <div class="sticky z-10 top-0 flex gap-x-4 py-4 bg-slate-50">
    <input
      class="block w-full border-2 rounded-xl p-2"
      type="search"
      placeholder="Search"
      v-model="searchQuery"
    />
    <TheButton class="flex-shrink-0" type="button" @click="isCreateFormVisible = true"
      >Create</TheButton
    >
  </div>

  <!-- at least empty array is returned from the API -->
  <div v-if="filteredUsers">
    <!-- there are some users -->
    <template v-if="filteredUsers.length">
      <ul class="_minmax grid gap-4" data-testid="user-list">
        <li v-for="user in filteredUsers" :key="user.id">
          <UserCard :user="user" @edit="userToEdit = user" @delete="userToDelete = user" />
        </li>
      </ul>

      <Teleport to="body">
        <Transition name="fade">
          <ModalDialog v-if="userToEdit" @close="userToEdit = null">
            <EditUserForm
              :user="userToEdit"
              :is-loading="updateUserLoading"
              :error="updateUserError"
              @submit="handleUserUpdate"
              @cancel="userToEdit = null"
            />
          </ModalDialog>
        </Transition>
      </Teleport>

      <Teleport to="body">
        <Transition name="fade">
          <ModalDialog v-if="userToDelete" @close="userToDelete = null">
            <DeleteUserConfirmation
              :user="userToDelete"
              :is-loading="deleteUserLoading"
              :error="deleteUserError"
              @confirm="handleUserDelete(userToDelete.id)"
              @cancel="userToDelete = null"
            />
          </ModalDialog>
        </Transition>
      </Teleport>
    </template>

    <!-- users exist, but search query doesn't match any of them -->
    <div v-else-if="debouncedSearchQuery.length">
      <h2 class="mb-2 text-xl font-medium">No users found ¯\_(ツ)_/¯</h2>
    </div>

    <!-- there are no users returned from the API -->
    <div v-else data-testid="empty-user-list">
      <h2 class="mb-2 text-xl font-medium">There are no users yet</h2>
      <p>Feel free to create one</p>
    </div>
  </div>

  <div v-else-if="getUsersLoading" class="flex justify-center" data-testid="get-users-loading">
    <svg
      class="animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M12 22q-2.05 0-3.875-.788t-3.187-2.15q-1.363-1.362-2.15-3.187T2 12q0-2.075.788-3.887t2.15-3.175Q6.3 3.575 8.124 2.788T12 2q.425 0 .713.288T13 3q0 .425-.288.713T12 4Q8.675 4 6.337 6.338T4 12q0 3.325 2.338 5.663T12 20q3.325 0 5.663-2.337T20 12q0-.425.288-.712T21 11q.425 0 .713.288T22 12q0 2.05-.788 3.875t-2.15 3.188q-1.362 1.362-3.175 2.15T12 22"
      />
    </svg>
  </div>

  <div v-else-if="getUsersError" data-testid="get-users-error">{{ getUsersError }}</div>

  <Teleport to="body">
    <Transition name="fade">
      <ModalDialog v-if="isCreateFormVisible" @close="isCreateFormVisible = false">
        <CreateUserForm
          :is-loading="createUserLoading"
          :error="createUserError"
          @submit="handleUserCreate"
          @cancel="isCreateFormVisible = false"
        />
      </ModalDialog>
    </Transition>
  </Teleport>
</template>

<style scoped>
._minmax {
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
}
</style>
