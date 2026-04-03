export const createRandomId = () => {
  return Math.random().toString(32).substring(2, 9);
}

export default {
  createRandomId
}