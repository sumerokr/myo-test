import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import EditUserForm from './EditUserForm.vue';

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

describe('EditUserForm', () => {
  it('Renders the form', () => {
    const wrapper = mount(EditUserForm, { props: { user: user } });

    expect(wrapper.find('[data-testid="edit-form"]').exists()).toBe(true);
  });

  it('Renders user data', () => {
    const wrapper = mount(EditUserForm, { props: { user: user } });

    expect((wrapper.find('#id').element as HTMLInputElement).value).toBe(user.id);
    expect((wrapper.find('#username').element as HTMLInputElement).value).toBe(user.username);
  });

  it('Submits the same data if not edited', async () => {
    const wrapper = mount(EditUserForm, { props: { user: user } });
    await wrapper.find('[data-testid="edit-form"]').trigger('submit');

    expect(wrapper.emitted('submit')?.[0][0]).toEqual(user);
  });

  it('Submits the edited data when modified', async () => {
    const wrapper = mount(EditUserForm, { props: { user: user } });
    const assertedUsername = 'custom_username';
    await wrapper.find('#username').setValue(assertedUsername);
    await wrapper.find('[data-testid="edit-form"]').trigger('submit');

    expect(wrapper.emitted('submit')?.[0][0]).toEqual({
      ...user,
      username: assertedUsername,
    });
  });

  it('Does not allow modification of id and createdAt fields', async () => {
    const wrapper = mount(EditUserForm, { props: { user: user } });
    await wrapper.find('#id').setValue('modified_id');
    await wrapper.find('#createdAt').setValue('modified_date');
    await wrapper.find('[data-testid="edit-form"]').trigger('submit');

    expect(wrapper.emitted('submit')?.[0][0]).toEqual(user);
  });

  it('Does not show an error by default', async () => {
    const wrapper = mount(EditUserForm, { props: { user: user } });

    expect(wrapper.find('[data-testid="edit-form-error"]').exists()).toBe(false);
  });

  it('Shows an error if any', async () => {
    const assertedError = 'Something happened';
    const wrapper = mount(EditUserForm, { props: { user: user, error: assertedError } });

    expect(wrapper.find('[data-testid="edit-form-error"]').text()).toBe(assertedError);
  });
});
