import getSession from "./getSession";

const getCurrentUser = async () => {
  try {
    const session = await getSession();
    const user = session?.user;
    return user;
  } catch (error) {
    console.log(error);
  }
};

export default getCurrentUser;
