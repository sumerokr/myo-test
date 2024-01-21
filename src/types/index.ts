export type User = {
  id: string;
  username: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar: string;
  };
  createdAt: string;
};

export type UserDraft = Omit<User, 'id' | 'createdAt'>;
