import { normalizeStrictGender } from './genderPromptService.js';

export const resolveUserGender = (user) => normalizeStrictGender(user?.gender);

export const withGenderFilter = (query = {}, user) => ({
  ...query,
  gender: resolveUserGender(user)
});
