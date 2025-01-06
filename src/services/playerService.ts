import PocketBase from 'pocketbase';

export const pb = new PocketBase('https://quizazoid.pockethost.io');

export const authenticate = async (email, password) => {
  try {
    const authData = await pb
      .collection('_superusers')
      .authWithPassword(email, password);
    console.log(authData, 'authdata');
    pb.authStore.save(authData.token, authData.user);
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

export const fetchPlayers = async () => {
  try {
    const records = await pb
      .collection('players')
      .getFullList({ requestKey: null });
    return records.map((player) => ({
      name: player.name,
      class: player.class,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const deletePlayer = async (name) => {
  try {
    const records = await pb.collection('players').getFullList({
      filter: `name="${name}"`,
      requestKey: null,
    });
    if (records.length > 0) {
      await pb.collection('players').delete(records[0].id);
    }
  } catch (error) {
    console.error(error);
  }
};
