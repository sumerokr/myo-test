<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFetch, refDebounced } from '@vueuse/core';
import type { User, UserDraft } from '@/types';
import ModalDialog from '@/components/ModalDialog.vue';
import EditUserForm from '@/components/EditUserForm.vue';
import CreateUserForm from '@/components/CreateUserForm.vue';
import DeleteUserConfirmation from '@/components/DeleteUserConfirmation.vue';
import UserCard from '@/components/UserCard.vue';
import TheButton from '@/components/TheButton.vue';

const {
  isFetching,
  error,
  data: users,
} = useFetch('https://65a7b87994c2c5762da76352.mockapi.io/api/users').get().json<User[]>();

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

const {
  isFetching: isCreating,
  error: creatingError,
  data: createdUser,
  execute: createUser,
  post: setCreatePayload,
  onFetchResponse: onUserCreated,
} = useFetch(() => 'https://65a7b87994c2c5762da76352.mockapi.io/api/users/', {
  immediate: false,
}).json<User>();

const handleUserCreate = async (userData: UserDraft) => {
  if (isCreating.value) {
    return;
  }

  setCreatePayload(userData);
  await createUser();
};

onUserCreated(() => {
  if (!users.value || !createdUser.value) return;
  users.value = users.value.concat(createdUser.value);
  isCreateFormVisible.value = false;
});
//#endregion create

//#region edit
const userToEdit = ref<User | null>(null);

const {
  isFetching: isUpdating,
  error: updatingError,
  data: updatedUser,
  execute: updateUser,
  put: setUpdatePayload,
  onFetchResponse: onUserUpdated,
} = useFetch(
  () => `https://65a7b87994c2c5762da76352.mockapi.io/api/users/${userToEdit.value?.id}`,
  {
    immediate: false,
  }
).json<User>();

const handleUserUpdate = async (userData: User) => {
  if (isUpdating.value) {
    return;
  }

  setUpdatePayload(userData);
  await updateUser();
};

onUserUpdated(() => {
  if (!users.value || !updatedUser.value) return;
  users.value = users.value.map((user): User => {
    if (user.id === updatedUser.value?.id) {
      return updatedUser.value;
    }
    return user;
  });

  userToEdit.value = null;
});
//#endregion edit

//#region delete
const userToDelete = ref<User | null>(null);

const {
  isFetching: isDeleting,
  error: deleteError,
  execute: deleteUser,
  onFetchResponse: onUserDeleted,
} = useFetch(
  () => `https://65a7b87994c2c5762da76352.mockapi.io/api/users/${userToDelete.value?.id}`,
  {
    immediate: false,
  }
)
  .delete()
  .json<User>();

const handleUserDelete = async () => {
  if (isDeleting.value) {
    return;
  }

  await deleteUser();
};

onUserDeleted(() => {
  if (!users.value || !userToDelete.value) return;
  users.value = users.value!.filter((user) => user.id !== userToDelete.value?.id);
  userToDelete.value = null;
});
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

  <div v-if="filteredUsers">
    <template v-if="filteredUsers.length">
      <ul class="_minmax grid gap-4" data-testid="user-list">
        <li v-for="user in filteredUsers" :key="user.id">
          <UserCard :user="user" @edit="userToEdit = user" @delete="userToDelete = user" />
        </li>
      </ul>

      <Teleport to="body">
        <Transition name="fade">
          <ModalDialog v-if="userToEdit" @close="userToEdit = null" data-testid="edit-popup">
            <EditUserForm
              :user="userToEdit"
              :is-updating="isUpdating"
              :updating-error="updatingError"
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
              :is-deleting="isDeleting"
              :deleting-error="deleteError"
              @confirm="handleUserDelete"
              @cancel="userToDelete = null"
            />
          </ModalDialog>
        </Transition>
      </Teleport>
    </template>

    <div v-else data-testid="empty-user-list">
      <h2 class="mb-2 text-xl font-medium">There are no users yet</h2>
      <p>Feel free to create one</p>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <ModalDialog v-if="isCreateFormVisible" @close="isCreateFormVisible = false">
          <CreateUserForm
            :is-creating="isCreating"
            :creating-error="creatingError"
            @submit="handleUserCreate"
            @cancel="isCreateFormVisible = false"
          />
        </ModalDialog>
      </Transition>
    </Teleport>
  </div>

  <div v-else-if="isFetching" class="flex justify-center" data-testid="get-users-fetching">
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

  <div v-else-if="error" data-testid="get-users-error">{{ error }}</div>
</template>

<style scoped>
._minmax {
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
}

.fade-enter-active {
  transition-timing-function: ease-out;
}
.fade-leave-active {
  transition-timing-function: ease-in;
}

.fade-enter-active,
.fade-leave-active {
  transition-property: transform, opacity;
  transition-duration: 0.15s;
}

.fade-enter-from,
.fade-leave-to {
  transform: translateY(0.5rem);
  opacity: 0;
}
</style>
