const utils = require('../utils');
const okta = require('../../');
let orgUrl = process.env.OKTA_CLIENT_ORGURL;
let mockServer = false;

if (process.env.OKTA_USE_MOCK) {
  orgUrl = `${orgUrl}/update-group`;
  mockServer = true;
}

const client = new okta.Client({
  orgUrl: orgUrl,
  token: process.env.OKTA_CLIENT_TOKEN
});

describe('Group API tests', () => {
  it('should update a group', async () => {
    // 1. Create a new group
    let newGroup = {
      profile: {
        name: 'Update Test Group'
      }
    };

    // Cleanup the group if it exists
    if (!mockServer) {
      await utils.cleanup(client, null, newGroup);
    }

    const createdGroup = await client.createGroup(newGroup);
    utils.validateGroup(createdGroup, newGroup);

    // 2. Update the group name and description
    createdGroup.profile.name = 'Update Test Group - Updated';
    createdGroup.profile.description = 'Description updated';

    const updatedGroup = await createdGroup.update();
    utils.validateGroup(updatedGroup, createdGroup);

    // 3. Delete the group
    await client.deleteGroup(createdGroup.id);
  });
});
