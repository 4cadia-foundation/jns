import axios from 'axios';

export default class Config {
  static async loadConfigJSON(file) {
    try {
      const response = await axios.get(file);
      return response.data;
    } catch (err) {
      console.error('[Config] Error: ' + err);
    }
  }
}
