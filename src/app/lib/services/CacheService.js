import { CACHE_TTL } from '../constants';

class AppCache {
  static instance = new Map();

  static get(key) {
    const entry = this.instance.get(key);
    return entry && entry.expiry > Date.now() ? entry.value : null;
  }

  static set(key, value, ttl = CACHE_TTL.MEDIUM) {
    this.instance.set(key, { value, expiry: Date.now() + ttl * 1000 });
    this.cleanup();
  }

  static cleanup() {
    if (this.instance.size > 100) {
      Array.from(this.instance.keys())
        .slice(0, 20)
        .forEach(k => this.instance.delete(k));
    }
  }

  static clear() {
    this.instance.clear();
  }
}

export default AppCache;