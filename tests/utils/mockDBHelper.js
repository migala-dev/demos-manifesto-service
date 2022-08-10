const { newDb } = require('pg-mem');
const fs = require('fs');
const { v4 } = require('uuid');
const testConstants = require('./constants');

class MockDBHelper {
  constructor() {}

  async createDB() {
    this._db = newDb();
    const { Client } = this._db.adapters.createPg();
    this._client = new Client();
    this._registerExtensions();
    this._createTablesAndData();
    this._backup = this._db.backup();
    console.log('database created');
  }

  getClient() {
    return this._client;
  }

  restore() {
    this._backup.restore();
  }

  _createTablesAndData() {
    let sqlQuery = fs.readFileSync('./dump.sql', 'utf8');
    sqlQuery = sqlQuery.replace('$PRIMARY_USER__COGNITO_ID', testConstants.PRIMARY_USER__COGNITO_ID);
    this._db.public.none(sqlQuery);
  }

  _registerExtensions() {
    this._db.registerExtension('uuid-ossp', (schema) => {
      schema.registerFunction({
        name: 'uuid_generate_v4',
        returns: 'uuid',
        implementation: v4,
        impure: true,
      });
    });
  }
}

class MockUserTable {
  constructor() {}
}

module.exports = new MockDBHelper();
