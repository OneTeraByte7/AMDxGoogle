// server/src/services/mockFirestore.js
const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, '../../data/db.json');

class MockFirestore {
    constructor() {
        this.data = null;
        this.initialized = false;
    }

    async _init() {
        if (this.initialized) return;
        try {
            await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
            const content = await fs.readFile(DB_PATH, 'utf-8');
            this.data = JSON.parse(content);
        } catch (err) {
            this.data = {
                users: {
                    'demo-user': {
                        uid: 'demo-user',
                        displayName: 'Demo User',
                        email: 'demo@nutrivita.app',
                        profileComplete: true,
                        dailyCalorieTarget: 2500,
                        healthGoal: 'maintain',
                        age: 28,
                        weight: 75,
                        height: 175,
                        activityLevel: 'active',
                        dietaryPreference: 'omnivore',
                        dailyLogs: {},
                    },
                },
            };
            await this._save();
        }
        this.initialized = true;
    }

    async _save() {
        await fs.writeFile(DB_PATH, JSON.stringify(this.data, null, 2));
    }

    collection(name) {
        return new MockCollection(this, [name]);
    }
}

class MockCollection {
    constructor(db, pathArr) {
        this.db = db;
        this.pathArr = pathArr;
        this.filters = [];
        this.sortField = null;
        this.sortDir = 'asc';
    }

    doc(id) {
        return new MockDoc(this.db, [...this.pathArr, id]);
    }

    where(field, op, val) {
        this.filters.push({ field, op, val });
        return this;
    }

    orderBy(field, dir = 'asc') {
        this.sortField = field;
        this.sortDir = dir;
        return this;
    }

    async add(data) {
        await this.db._init();
        const id = uuidv4();
        const docRef = this.doc(id);
        await docRef.set(data);
        return { id };
    }

    async get() {
        await this.db._init();
        let current = this.db.data;
        for (const segment of this.pathArr) {
            current = current[segment] || {};
        }

        let docs = Object.entries(current)
            .filter(([id, val]) => typeof val === 'object' && !Array.isArray(val))
            .map(([id, val]) => ({
                id,
                data: () => val,
                exists: true,
            }));

        // Apply filters (basic '==' support for now)
        for (const f of this.filters) {
            if (f.op === '==') {
                docs = docs.filter((d) => d.data()[f.field] === f.val);
            }
        }

        // Apply sort
        if (this.sortField) {
            docs.sort((a, b) => {
                const valA = a.data()[this.sortField];
                const valB = b.data()[this.sortField];
                if (valA < valB) return this.sortDir === 'asc' ? -1 : 1;
                if (valA > valB) return this.sortDir === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return { docs, empty: docs.length === 0 };
    }
}

class MockDoc {
    constructor(db, pathArr) {
        this.db = db;
        this.pathArr = pathArr;
    }

    collection(name) {
        return new MockCollection(this.db, [...this.pathArr, name]);
    }

    async get() {
        await this.db._init();
        let current = this.db.data;
        let exists = true;
        for (const segment of this.pathArr) {
            if (!current[segment]) {
                exists = false;
                break;
            }
            current = current[segment];
        }
        return {
            exists,
            id: this.pathArr[this.pathArr.length - 1],
            data: () => current,
        };
    }

    async set(data, options = {}) {
        await this.db._init();
        let current = this.db.data;
        for (let i = 0; i < this.pathArr.length - 1; i++) {
            const segment = this.pathArr[i];
            if (!current[segment]) current[segment] = {};
            current = current[segment];
        }
        const id = this.pathArr[this.pathArr.length - 1];
        if (options.merge) {
            current[id] = { ...(current[id] || {}), ...data };
        } else {
            current[id] = data;
        }
        await this.db._save();
    }

    async update(data) {
        return this.set(data, { merge: true });
    }

    async delete() {
        await this.db._init();
        let current = this.db.data;
        for (let i = 0; i < this.pathArr.length - 1; i++) {
            current = current[this.pathArr[i]];
            if (!current) return;
        }
        delete current[this.pathArr[this.pathArr.length - 1]];
        await this.db._save();
    }
}

module.exports = new MockFirestore();
