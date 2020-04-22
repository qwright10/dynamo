import { DynamoClient } from './client/DynamoClient';
import path from 'path';
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const client = new DynamoClient({
    token: process.env.token,
    owner: process.env.owner
});
client.start();