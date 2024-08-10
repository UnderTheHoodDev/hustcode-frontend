export const updateUsername = (state: any, value: string) => {
  state.set(value);
  return [...state];
};
